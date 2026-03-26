"use client";

export const dynamic = "force-dynamic";

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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Edit, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

type Service = {
  _id: Id<"services">;
  name: string;
  duration: number;
  description?: string;
  price?: number;
  category?: string;
};

export default function ClientServicesPage() {
  const { isSignedIn, user } = useUser();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    duration: 30,
    price: 0,
    description: "",
    category: "",
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
          const svcs = await convex.query(
            api.functions.queries.listServicesForBusiness.default,
            { businessId: business._id as Id<"businesses"> },
          );
          setServices(svcs);
        }
      } catch (error) {
        console.error("Failed to load services:", error);
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user]);

  const handleAddService = () => {
    setEditingService(null);
    setFormData({
      name: "",
      duration: 30,
      price: 0,
      description: "",
      category: "",
    });
    setOpenDialog(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      duration: service.duration,
      price: service.price || 0,
      description: service.description || "",
      category: service.category || "",
    });
    setOpenDialog(true);
  };

  const handleSaveService = async () => {
    if (!formData.name.trim() || !businessId) {
      toast.error("Please fill in the service name");
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        // Update service
        await convex.mutation(api.functions.mutations.updateService.default, {
          serviceId: editingService._id,
          businessId: businessId as Id<"businesses">,
          name: formData.name,
          duration: formData.duration,
          price: formData.price || undefined,
          description: formData.description || undefined,
          category: formData.category || undefined,
        });

        setServices((prev) =>
          prev.map((s) =>
            s._id === editingService._id
              ? {
                  ...s,
                  name: formData.name,
                  duration: formData.duration,
                  price: formData.price || undefined,
                  description: formData.description || undefined,
                  category: formData.category || undefined,
                }
              : s,
          ),
        );
        toast.success("Service updated successfully");
      } else {
        // Create new service
        const newServiceId = await convex.mutation(
          api.functions.mutations.createService.default,
          {
            businessId: businessId as Id<"businesses">,
            name: formData.name,
            duration: formData.duration,
            price: formData.price || undefined,
            description: formData.description || undefined,
            category: formData.category || undefined,
          },
        );

        const newService: Service = {
          _id: newServiceId as Id<"services">,
          name: formData.name,
          duration: formData.duration,
          price: formData.price || undefined,
          description: formData.description || undefined,
          category: formData.category || undefined,
        };
        setServices((prev) => [...prev, newService]);
        toast.success("Service created successfully");
      }
      setOpenDialog(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save service";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService || !businessId) return;

    setDeleting(true);
    try {
      await convex.mutation(api.functions.mutations.deleteService.default, {
        serviceId: selectedService._id,
        businessId: businessId as Id<"businesses">,
      });

      setServices((prev) => prev.filter((s) => s._id !== selectedService._id));
      toast.success("Service deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedService(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete service";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading services...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">
          Please sign in to manage services
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground mt-1">
            Manage services offered by your business
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <Button onClick={handleAddService}>
            <Plus className="size-4 mr-2" />
            Add Service
          </Button>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="service-name">Service Name</Label>
                <Input
                  id="service-name"
                  placeholder="e.g., Hair Cut"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    step="5"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value) || 30,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Hair Care"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Service description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveService} disabled={saving}>
                {saving ? "Saving..." : "Save Service"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {services.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <Plus className="size-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">No services yet</p>
            <p className="text-muted-foreground mt-1">
              Add your first service to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <Card
              key={service._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    {service.category && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {service.category}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditService(service)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedService(service);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {service.description && (
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="size-4 text-muted-foreground" />
                    <span>{service.duration} minutes</span>
                  </div>
                  {service.price !== undefined && service.price > 0 && (
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <DollarSign className="size-4 text-muted-foreground" />
                      <span>${service.price.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedService?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteService}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? "Deleting..." : "Delete Service"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
