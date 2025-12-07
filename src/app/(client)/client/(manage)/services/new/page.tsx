"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import convex from "@/lib/convex-client";
import { api } from "../../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

export default function NewServicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit") || null;
  const { isSignedIn, user } = useUser();

  const [businessId, setBusinessId] = useState<Id<"businesses"> | null>(null);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!isSignedIn || !user) {
        setError("Please sign in to manage services.");
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

        if (editId) {
          const svc = await convex.query(
            api.functions.queries.getServiceById.default,
            { serviceId: editId as unknown as Id<"services"> }
          );
          if (svc) {
            setName(svc.name ?? "");
            setDuration(svc.duration ?? 30);
            setPrice(svc.price ?? 0);
            setCategory(svc.category ?? "");
            setDescription(svc.description ?? "");
          }
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user, editId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (!isSignedIn || !user) {
      setError("Please sign in to save services.");
      return;
    }
    if (!businessId) {
      setError("No business selected");
      return;
    }

    try {
      const priceValue = Number(price);
      const pricePayload = Number.isFinite(priceValue) ? priceValue : undefined;

      if (editId) {
        await convex.mutation(api.functions.mutations.updateService.default, {
          serviceId: editId as unknown as Id<"services">,
          businessId,
          name: name.trim(),
          duration: Number(duration) || 0,
          price: pricePayload,
          category: category.trim() || undefined,
          description: description.trim() || undefined,
        });
      } else {
        await convex.mutation(api.functions.mutations.createService.default, {
          businessId,
          name: name.trim(),
          duration: Number(duration) || 0,
          price: pricePayload,
          category: category.trim() || undefined,
          description: description.trim() || undefined,
        });
      }
      router.push("..");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-destructive">{error}</div>;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold">
        {editId ? "Edit Service" : "Add Service"}
      </h1>
      <p className="text-muted-foreground mb-4">
        {editId
          ? "Edit your service details."
          : "Create a new service offering."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Duration (min)
            </label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded border p-2"
            rows={4}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            disabled={!isSignedIn || loading || !businessId}
          >
            Save Service
          </Button>
          <Button
            variant="ghost"
            type="button"
            onClick={() => router.push("..")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
