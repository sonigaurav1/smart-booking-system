"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutGrid, Calendar, Users, Briefcase, CreditCard, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  { name: "Employees", href: "/dashboard/employees", icon: Briefcase },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Website", href: "/dashboard/website", icon: Globe },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 bg-primary text-primary-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">BookHub</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-sm text-white/60">
        <p>&copy; 2025 BookHub</p>
      </div>
    </aside>
  )
}
