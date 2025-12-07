import type React from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface PublicMetadata {
  role?: string;
}
// NOTE: Role-based access can be enforced here later
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/admin/sign-in");

  // Fetch full user to inspect role (assumes role stored in publicMetadata.role)
  const user = await currentUser();
  const role = (user?.publicMetadata as PublicMetadata)?.role;
  const isAdmin = role === "admin";

  if (!isAdmin) {
    // Authenticated but not an admin: send to a safe page that offers account switching
    redirect("/admin-unauthorized");
  }

  return (
    <div className="min-h-screen p-6" data-admin-role={role}>
      {children}
    </div>
  );
}
