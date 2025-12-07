"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import convex from "@/lib/convex-client";
import { api } from "../../../../../../../convex/_generated/api";
import { useUser, useAuth } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

export default function NewEmployeePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit") ?? null;
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [timesRaw, setTimesRaw] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!isSignedIn || !user) {
        setLoading(false);
        return;
      }
      // Ensure Convex client has the Clerk session token for authenticated requests
      try {
        const token = await getToken();
        if (token) {
          // Set Authorization header for Convex HTTP client
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          convex.setFetchOptions({
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      } catch (err) {
        // If token retrieval fails, continue and let the queries surface an auth error
        console.warn("Failed to get Clerk token:", err);
      }
      try {
        const business = await convex.query(
          api.functions.queries.getBusinessForClerk.default,
          { clerkId: user.id }
        );
        if (!business) {
          toast({
            title: "No business",
            description: "Create a business from your profile first.",
          });
          setLoading(false);
          return;
        }
        setBusinessId(business._id);

        if (editId) {
          const employee = await convex.query(
            api.functions.queries.getEmployeeById.default,
            { employeeId: editId }
          );
          if (employee) {
            setName(employee.name ?? "");
            setEmail(employee.email ?? "");
            setTimesRaw((employee.availableTimes || []).join(", "));
          }
        }
      } catch (e: unknown) {
        toast({
          title: "Error",
          description: e instanceof Error ? e.message : String(e),
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user, editId, toast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!businessId)
      return toast({
        title: "No business",
        description: "Business not found.",
      });
    if (!name.trim())
      return toast({ title: "Validation", description: "Name is required." });

    const times = timesRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      setSaving(true);
      // Refresh token before mutation to ensure auth is current
      try {
        const token = await getToken();
        if (token) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          convex.setFetchOptions({
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      } catch (err) {
        console.warn("Failed to refresh Clerk token before mutation:", err);
      }
      if (editId) {
        await convex.mutation(api.functions.mutations.updateEmployee.default, {
          employeeId: editId,
          businessId,
          name: name.trim(),
          email: email.trim() || undefined,
          availableTimes: times,
        });
        toast({ title: "Updated", description: "Employee updated." });
      } else {
        await convex.mutation(api.functions.mutations.createEmployee.default, {
          businessId,
          name: name.trim(),
          email: email.trim() || undefined,
          availableTimes: times,
        });
        toast({ title: "Created", description: "Employee created." });
      }
      router.push("..");
    } catch (e: unknown) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold">{editId ? "Edit" : "Add"} Employee</h1>
      <p className="text-muted-foreground mb-4">
        Create or update an employee profile.
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

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Available Times (comma separated)
          </label>
          <Input
            value={timesRaw}
            onChange={(e) => setTimesRaw(e.target.value)}
            placeholder="9:00-9:45, 10:00-10:45"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={saving || loading}>
            {saving ? "Saving..." : "Save Employee"}
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
