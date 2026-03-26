"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import convex from "@/lib/convex-client";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, isSignedIn } = useUser();
  const [business, setBusiness] = useState<{ _id: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const businessData = await convex.query(
          api.functions.queries.getBusinessForClerk.default,
          { clerkId: user.id },
        );

        if (businessData) {
          setBusiness(businessData);
          setFormData({
            name: businessData.name || "",
            description: businessData.description || "",
            phone: businessData.phone || "",
            address: businessData.address || "",
            category: businessData.category || "",
          });
        }
      } catch (error) {
        console.error("Failed to load business settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user]);

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
    if (!business?._id) return;

    setSaving(true);
    try {
      await convex.mutation(api.functions.mutations.updateBusiness.default, {
        businessId: business._id as Id<"businesses">,
        ...formData,
      });

      toast.success("Business settings updated successfully");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update business settings";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Business not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Name */}
          <div>
            <Label htmlFor="name">Business Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your business name"
              className="mt-2"
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g., Salon, Restaurant, Clinic"
              className="mt-2"
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Contact number"
              className="mt-2"
            />
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Business address"
              className="mt-2"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of your business"
              className="mt-2"
              rows={4}
            />
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
