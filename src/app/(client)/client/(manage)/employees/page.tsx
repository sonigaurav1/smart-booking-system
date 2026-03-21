"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import convex from "@/lib/convex-client";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit, Mail } from "lucide-react";
import { toast } from "sonner";

type Employee = {
  _id: Id<"employees">;
  name: string;
  email: string;
  photo?: string;
  availableTimes?: string[];
};

export default function EmployeesPage() {
  const { isSignedIn, user } = useUser();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (!isSignedIn || !user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const business = await convex.query(
          api.functions.queries.getBusinessForClerk.default,
          { clerkId: user.id },
        );

        if (business) {
          setBusinessId(business._id);
          const emps = await convex.query(
            api.functions.queries.listEmployeesForBusiness.default,
            { businessId: business._id as Id<"businesses"> },
          );
          setEmployees(emps);
        }
      } catch (error) {
        console.error("Failed to load employees:", error);
        toast.error("Failed to load employees");
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user]);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setFormData({
      name: "",
      email: "",
    });
    setOpenDialog(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
    });
    setOpenDialog(true);
  };

  const handleSaveEmployee = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !businessId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      if (editingEmployee) {
        // Update employee
        await convex.mutation(api.functions.mutations.updateEmployee.default, {
          employeeId: editingEmployee._id,
          businessId: businessId as Id<"businesses">,
          name: formData.name,
          email: formData.email,
        });

        setEmployees((prev) =>
          prev.map((e) =>
            e._id === editingEmployee._id
              ? {
                  ...e,
                  name: formData.name,
                  email: formData.email,
                }
              : e,
          ),
        );
        toast.success("Employee updated successfully");
      } else {
        // Create new employee
        const newEmployeeId = await convex.mutation(
          api.functions.mutations.createEmployee.default,
          {
            businessId: businessId as Id<"businesses">,
            name: formData.name,
            email: formData.email,
            availableTimes: [],
          },
        );

        const newEmployee: Employee = {
          _id: newEmployeeId as Id<"employees">,
          name: formData.name,
          email: formData.email,
        };
        setEmployees((prev) => [...prev, newEmployee]);
        toast.success("Employee created successfully");
      }
      setOpenDialog(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save employee";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee || !businessId) return;

    setDeleting(true);
    try {
      await convex.mutation(api.functions.mutations.deleteEmployee.default, {
        employeeId: selectedEmployee._id,
        businessId: businessId as Id<"businesses">,
      });

      setEmployees((prev) =>
        prev.filter((e) => e._id !== selectedEmployee._id),
      );
      toast.success("Employee deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete employee";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading employees...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">
          Please sign in to manage employees
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground mt-1">
            Manage team members who provide services
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <Button onClick={handleAddEmployee}>
            <Plus className="size-4 mr-2" />
            Add Employee
          </Button>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? "Edit Employee" : "Add New Employee"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="employee-name">Employee Name</Label>
                <Input
                  id="employee-name"
                  placeholder="e.g., John Smith"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employee-email">Email Address</Label>
                <Input
                  id="employee-email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEmployee} disabled={saving}>
                {saving ? "Saving..." : "Save Employee"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {employees.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <Plus className="size-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">No employees yet</p>
            <p className="text-muted-foreground mt-1">
              Add your first employee to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {employees.map((employee) => (
            <Card
              key={employee._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Mail className="size-4" />
                      <span>{employee.email}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditEmployee(employee)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedEmployee?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteEmployee}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "Deleting..." : "Delete Employee"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
