"use client";

import { useState } from "react";
import convex from "@/lib/convex-client";
import { api } from "../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function BusinessProfilePage() {
  const { isSignedIn, user } = useUser();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name) {
      toast.error("Business name is required");
      return;
    }
    if (!isSignedIn || !user) {
      toast.error("Please sign in to create your shop");
      return;
    }
    setLoading(true);
    try {
      // 1) Ensure we have a corresponding Convex user and get its _id
      const clerkId = user.id;
      const primaryEmail =
        user.primaryEmailAddress?.emailAddress ??
        user.emailAddresses[0]?.emailAddress ??
        "";
      const displayName =
        user.fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username ||
        "User";

      // Try to fetch existing user
      let currentUser = (await convex.query(api.users.getCurrentUser, {
        clerkId,
      })) as { _id: Id<"users"> } | null;
      if (!currentUser) {
        // Create then fetch again (getOrCreateUser returns id on insert, so read after)
        await convex.mutation(api.users.getOrCreateUser, {
          clerkId,
          email: primaryEmail,
          name: displayName,
        });
        currentUser = await convex.query(api.users.getCurrentUser, { clerkId });
      }

      if (!currentUser?._id) {
        throw new Error("Could not resolve current user in database");
      }

      // 2) Create the business
      const businessId = await convex.mutation(
        api.functions.mutations.createBusiness.default,
        {
          ownerId: currentUser._id,
          name: name.trim(),
          slug: slug.trim() || undefined,
          address: address.trim() || undefined,
          phone: phone.trim() || undefined,
        }
      );

      toast.success("Shop created successfully");
      console.log("Created business:", businessId);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Business Profile</h1>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Business Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Hello Saloon"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="slug">Custom URL Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())}
            placeholder="hello-saloon"
          />
          <p className="text-xs text-muted-foreground">
            Your public URL will be /shop/{slug || "your-slug"}
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="123-456-7890"
          />
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          type="button"
          className="cursor-pointer"
          disabled={loading || !name.trim()}
          onClick={() => {
            console.log("Create business clicked");
            handleCreate();
          }} // Replace with handleCreate when ready
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
