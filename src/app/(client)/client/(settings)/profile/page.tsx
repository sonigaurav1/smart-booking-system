"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import convex from "@/lib/convex-client";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const router = useRouter();
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

  const handleSave = async () => {
    if (!business || !formData.name) {
      toast({
        title: "Validation Error",
        description: "Business name is required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await convex.mutation(api.functions.mutations.updateBusiness.default, {
        businessId: business._id as Id<"businesses">,
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category || undefined,
        address: formData.address || undefined,
        phone: formData.phone || undefined,
        openTime: formData.openTime || undefined,
        closeTime: formData.closeTime || undefined,
        logo: formData.logo || undefined,
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
      if (updatedBusiness) {
        setBusiness(updatedBusiness as Business);
        setFormData(updatedBusiness);
      }
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
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">No business found</h2>
        <p className="text-muted-foreground">
          Please create a business first in settings.
        </p>
        <Button onClick={() => router.push("/client/settings/business")}>
          Create Business
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>Update your business information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your Business Name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Business description"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category || ""}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="e.g., Salon, Restaurant, Clinic"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="openTime">Opening Time</Label>
              <Input
                id="openTime"
                type="time"
                value={formData.openTime || "09:00"}
                onChange={(e) =>
                  setFormData({ ...formData, openTime: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="closeTime">Closing Time</Label>
              <Input
                id="closeTime"
                type="time"
                value={formData.closeTime || "21:00"}
                onChange={(e) =>
                  setFormData({ ...formData, closeTime: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/client/dashboard")}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
