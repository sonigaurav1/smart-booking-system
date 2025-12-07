"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/clerk-react";

export default function AdminDashboardPage() {
  const { signOut } = useClerk();

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform activity.</p>
      </div>

      <Button
        className="mt-10"
        onClick={() => signOut({ redirectUrl: "/admin/sign-in" })}
      >
        Sign Out
      </Button>
    </>
  );
}
