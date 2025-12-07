"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import convex from "@/lib/convex-client";
import { api } from "../../../../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function ClientServicesPage() {
  const { isSignedIn, user } = useUser();
  const [services, setServices] = useState<any[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!isSignedIn || !user) {
        setLoading(false);
        setError("Please sign in to manage services.");
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
        const list = await convex.query(
          api.functions.queries.listServicesForBusiness.default,
          { businessId: business._id }
        );
        setServices(list || []);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load services");
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user]);

  async function confirmDelete() {
    if (!toDelete || !businessId) return;
    try {
      await convex.mutation(api.functions.mutations.deleteService.default, {
        serviceId: toDelete,
        businessId,
      });
      setServices((s) => s.filter((x) => x._id !== toDelete));
      setToDelete(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">
            Add and edit your services, categories, and pricing.
          </p>
        </div>

        <Link href="./services/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="text-left text-sm text-muted-foreground">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Service</th>
              <th className="p-3">Category</th>
              <th className="p-3">Duration</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-3">
                  Loading...
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-3 text-muted-foreground">
                  No services yet.
                </td>
              </tr>
            ) : (
              services.map((s: any) => (
                <tr key={s._id} className="border-t">
                  <td className="p-3 font-medium">{s._id}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.category ?? "—"}</td>
                  <td className="p-3">{s.duration} min</td>
                  <td className="p-3">
                    {s.price ? `$${Number(s.price).toFixed(2)}` : "—"}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link href={`./new?edit=${s._id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setToDelete(s._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
              Are you sure you want to delete this service? This action cannot
              be undone.
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
