import type React from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface PublicMetadata {
  role?: string;
}

const adminMenuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

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
    <div className="min-h-screen flex" data-admin-role={role}>
      {/* Left Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 border-r border-slate-800">
        {/* Logo/Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-sm text-slate-400">Smart Booking System</p>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 mb-8">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <button className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-200">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-slate-700 my-6"></div>

        {/* User Info */}
        <div className="mb-6 p-3 bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-400">Logged in as</p>
          <p className="text-sm font-medium text-white truncate">
            {user?.emailAddresses[0]?.emailAddress}
          </p>
        </div>

        {/* Sign Out */}
        <SignOutButton redirectUrl="/sign-in">
          <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </SignOutButton>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white overflow-auto">{children}</main>
    </div>
  );
}
