"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import convex from "@/lib/convex-client";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { api } from "../../../../../../convex/_generated/api";

type Employee = {
  _id: string;
  businessId: string;
  name: string;
  email?: string;
  photo?: string;
  availableTimes?: string[];
  createdAt?: number;
};

export default function EmployeesPage() {
  const { isSignedIn, user } = useUser();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!isSignedIn || !user) {
        setError("Please sign in to manage employees.");
        setLoading(false);
        return;
      }

      try {
        const business = await convex.query(
          api.functions.queries.getBusinessForClerk.default,
          { clerkId: user.id }
        );
        if (!business) {
          setError(
            "No business found for your account. Create one in profile."
          );
          setLoading(false);
          return;
        }
        setBusinessId(business._id);
        const list = await convex.query(api.employees.listEmployees, {
          businessId: business._id,
        });
        setEmployees(list || []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load employees");
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user]);

  async function confirmDelete() {
    if (!toDelete || !businessId) return;
    try {
      await convex.mutation(api.functions.mutations.deleteEmployee.default, {
        employeeId: toDelete as unknown as Id<"employees">,
        businessId: businessId as unknown as Id<"businesses">,
      });
      setEmployees((s) => s.filter((x) => x._id !== toDelete));
      setToDelete(null);
      toast({ title: "Deleted", description: "Employee deleted." });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to delete";
      setError(msg);
      toast({ title: "Error", description: msg });
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Employees</h1>
        <Link href="./employees/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">S.NO</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Photo</TableHead>
              <TableHead>No of Appo...</TableHead>
              <TableHead>Timing</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="p-3">
                  Loading...
                </TableCell>
              </TableRow>
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-3 text-muted-foreground">
                  No employees yet.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp: Employee) => (
                <TableRow key={emp._id}>
                  <TableCell className="font-medium">{emp._id}</TableCell>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell>
                    <div className="w-8 h-8 rounded-full bg-gray-300" />
                  </TableCell>
                  <TableCell>{0}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {(emp.availableTimes || []).map(
                        (time: string, i: number) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                          >
                            {time}
                          </span>
                        )
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`./new?edit=${emp._id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setToDelete(emp._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={toDelete != null}
        onOpenChange={(open) => {
          if (!open) setToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setToDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => confirmDelete()}>
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {error ? <div className="text-destructive">{error}</div> : null}
    </div>
  );
}
