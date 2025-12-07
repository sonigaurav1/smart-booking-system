import type React from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SideNavbar from "@/components/navigation/side-navbar";
import DashboardHeader from "@/components/dashboard/header";

interface PublicMetadata {
  role?: string;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/client/sign-in");

  // Fetch full user to inspect role (assumes role stored in publicMetadata.role)
  const user = await currentUser();
  const role = (user?.publicMetadata as PublicMetadata)?.role;
  const isClient = role === "client";

  if (!isClient) {
    // Authenticated but not a client: send elsewhere
    redirect("/client-unauthorized");
  }

  return (
    <div className="flex h-screen bg-background" data-client-role={role}>
      <SideNavbar variant="client" />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
