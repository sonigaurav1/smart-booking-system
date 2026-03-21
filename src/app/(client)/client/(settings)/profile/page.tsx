"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import convex from "@/lib/convex-client";
import { api } from "convex/_generated/api";
import type { Id } from "../../../../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Business {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  address?: string;
  phone?: string;
  logo?: string;
  openTime?: string;
  closeTime?: string;
}

export default function ClientProfilePage() {
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Business>>({});

  useEffect(() => {
    (async () => {
      if (!isSignedIn || !user) {
        setLoading(false);
        return;
      }

      try {
        const businessData = await convex.query(
          api.functions.queries.getBusinessForClerk.default,
          { clerkId: user.id },
        );
        if (businessData) {
          setBusiness(businessData as Business);
          setFormData(businessData);
        }
      } catch (e) {
        console.error("Failed to load business profile:", e);
        toast({
          title: "Error",
          description: "Failed to load business profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!business) return;

    setSaving(true);
    try {
      await convex.mutation(api.functions.mutations.updateBusiness.default, {
        businessId: business._id as Id<"businesses">,
        name: formData.name || business.name,
        description: formData.description,
        category: formData.category,
        address: formData.address,
        phone: formData.phone,
        openTime: formData.openTime,
        closeTime: formData.closeTime,
        logo: formData.logo,
      });

      toast({
        title: "Success",
        description: "Business profile updated successfully",
      });

      // Refresh the business data
      const updatedBusiness = await convex.query(
        api.functions.queries.getBusinessForClerk.default,
        { clerkId: user!.id },
      );
      setBusiness(updatedBusiness as Business);
      setFormData(updatedBusiness);
    } catch (e) {
      console.error("Failed to update business:", e);
      toast({
        title: "Error",
        description:
          e instanceof Error ? e.message : "Failed to update business profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">
          No business found. Please create one in settings.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Business Profile</h1>
        <p className="text-muted-foreground">
          Update your business details and branding
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Edit your business profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium">Business Name</label>
            <Input
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              placeholder="Enter business name"
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder="Enter business description"
              className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>
            <Input
              name="category"
              value={formData.category || ""}
              onChange={handleInputChange}
              placeholder="e.g., Salon, Clinic, Gym"
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <Input
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
              placeholder="Enter business address"
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              placeholder="Enter business phone number"
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Opening Time</label>
              <Input
                name="openTime"
                type="time"
                value={formData.openTime || ""}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Closing Time</label>
              <Input
                name="closeTime"
                type="time"
                value={formData.closeTime || ""}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
