"use client"

import { useUser } from "@clerk/nextjs"
import DashboardStats from "@/components/dashboard/stats"
import RecentTransactions from "@/components/dashboard/recent-transactions"
import BookingsChart from "@/components/dashboard/bookings-chart"
import EmployeeSchedule from "@/components/dashboard/employee-schedule"

export default function DashboardPage() {
  const { user } = useUser()

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Balance & Transactions */}
        <div className="lg:col-span-1 space-y-6">
          <BalanceCard />
          <RecentTransactions />
        </div>

        {/* Right Column - Bookings & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <BookingsChart />
          <EmployeeSchedule />
        </div>
      </div>
    </div>
  )
}

function BalanceCard() {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Balance</h3>
        <button className="text-muted-foreground hover:text-foreground">⋮</button>
      </div>
      <div className="space-y-2">
        <p className="text-4xl font-bold text-primary">$10,500.00</p>
        <p className="text-sm text-muted-foreground">Available</p>
      </div>
    </div>
  )
}
