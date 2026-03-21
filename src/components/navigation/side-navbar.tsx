"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  LayoutGrid,
  Calendar,
  Users,
  Briefcase,
  Globe,
  ChevronDown,
  ChevronRight,
  Settings,
  NotebookPen,
} from "lucide-react";
import { PATH } from "@/constants/PATH";

export type NavItem = {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
};

export interface SideNavbarProps {
  title?: string;
  logoIcon?: React.ComponentType<{ className?: string }>;
  items?: NavItem[];
  variant?: "client" | "admin" | "user";
}

function getDefaultItems(variant: SideNavbarProps["variant"]): NavItem[] {
  switch (variant) {
    case "client":
      return [
        {
          label: "Overview",
          icon: LayoutGrid,
          children: [
            {
              label: "Dashboard",
              href: PATH.client.dashboard,
              icon: LayoutGrid,
            },
            { label: "Calendar", href: PATH.client.calendar, icon: Calendar },
          ],
        },
        {
          label: "Bookings",
          icon: NotebookPen,
          children: [
            {
              label: "Appointments",
              href: PATH.client.appointments,
              icon: NotebookPen,
            },
            { label: "Schedule", href: PATH.client.schedule, icon: Calendar },
          ],
        },
        {
          label: "Manage",
          icon: Briefcase,
          children: [
            { label: "Services", href: PATH.client.services, icon: Briefcase },
            { label: "Employees", href: PATH.client.employees, icon: Users },
          ],
        },
        {
          label: "Settings",
          icon: Settings,
          children: [
            { label: "Profile", href: PATH.client.profile, icon: Users },
            {
              label: "Preferences",
              href: PATH.client.settings,
              icon: Settings,
            },
          ],
        },
        {
          label: "Website",
          icon: Globe,
          children: [
            { label: "Shop Directory", href: PATH.shopAll, icon: Globe },
          ],
        },
      ];
    case "admin":
      return [
        { label: "Dashboard", href: PATH.admin.dashboard, icon: LayoutGrid },
        { label: "Users", href: PATH.admin.users, icon: Users },
        { label: "Clients", href: PATH.admin.clients, icon: Briefcase },
        { label: "Bookings", href: PATH.admin.bookings, icon: Calendar },
        {
          label: "Settings",
          href: PATH.admin.root + "/settings",
          icon: Settings,
        },
      ];
    case "user":
      return [
        { label: "Dashboard", href: PATH.user.dashboard, icon: LayoutGrid },
        { label: "Profile", href: PATH.user.profile, icon: Users },
        { label: "Book", href: PATH.book, icon: Calendar },
      ];
    default:
      return [];
  }
}

export default function SideNavbar({
  title = "BookHub",
  logoIcon: Logo = Calendar,
  items,
  variant = "client",
}: SideNavbarProps) {
  const pathname = usePathname();
  const effectiveItems =
    items && items.length ? items : getDefaultItems(variant);

  return (
    <aside className="w-72 bg-primary text-primary-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Logo className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {effectiveItems.map((item, idx) => (
          <NavNode key={idx} item={item} pathname={pathname} depth={0} />
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 text-sm text-white/60">
        <p>
          &copy; {new Date().getFullYear()} {title}
        </p>
      </div>
    </aside>
  );
}

function NavNode({
  item,
  pathname,
  depth,
}: {
  item: NavItem;
  pathname: string;
  depth: number;
}) {
  const isLeaf = !item.children || item.children.length === 0;
  const Icon = item.icon ?? LayoutGrid;

  const anyChildActive =
    !isLeaf &&
    item.children!.some(
      (c) =>
        c.href && (pathname === c.href || pathname.startsWith(c.href + "/"))
    );
  const [open, setOpen] = useState(anyChildActive);

  if (isLeaf) {
    const isActive =
      !!item.href &&
      (pathname === item.href || pathname.startsWith(item.href + "/"));
    return (
      <Link
        href={item.href ?? "#"}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          isActive
            ? "bg-white/20 text-white"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        )}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span className="truncate" style={{ paddingLeft: depth * 4 }}>
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <div className="rounded-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors",
          anyChildActive
            ? "bg-white/10 text-white"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        )}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span
          className="flex-1 text-sm font-medium"
          style={{ paddingLeft: depth * 2 }}
        >
          {item.label}
        </span>
        {open ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      {open && (
        <div className="mt-1 ml-6 space-y-1">
          {item.children!.map((child, idx) => (
            <NavNode
              key={idx}
              item={child}
              pathname={pathname}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
