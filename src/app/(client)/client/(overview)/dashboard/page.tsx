"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import convex from "@/lib/convex-client";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import BookingsChart from "@/components/dashboard/bookings-chart";
import EmployeeSchedule from "@/components/dashboard/employee-schedule";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, CheckCircle2, AlertCircle, Users } from "lucide-react";

export default function DashboardPage() {
  const { user, isSignedIn } = useUser();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
    cancelledAppointments: 0,
    totalRevenue: 0,
    uniqueCustomers: 0,
    todayAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!isSignedIn || !user) {
        setLoading(false);
        return;
      }

      try {
        const business = await convex.query(
          api.functions.queries.getBusinessForClerk.default,
          { clerkId: user.id },
        );
        if (business) {
          setBusinessId(business._id);
          const businessStats = await convex.query(
            api.functions.queries.getBusinessStats.default,
            { businessId: business._id as Id<"businesses"> },
          );
          setStats(businessStats);
        }
      } catch (e) {
        console.error("Failed to load dashboard stats:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user]);

  const statCards = [
    {
      icon: Calendar,
      title: "Total No of Appointments",
      value: stats.totalAppointments.toString(),
      color: "text-primary",
      bgColor: "bg-blue-50",
    },
    {
      icon: CheckCircle2,
      title: "Appointments Served",
      value: stats.completedAppointments.toString(),
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: AlertCircle,
      title: "Appointments Pending",
      value: stats.pendingAppointments.toString(),
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: Users,
      title: "Total Customers",
      value: stats.uniqueCustomers.toString(),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-card rounded-lg p-6 border border-border"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-muted-foreground text-sm mt-3">{stat.title}</p>
              <p className={`text-4xl font-bold mt-1 ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Balance & Transactions */}
        <div className="lg:col-span-1 space-y-6">
          <BalanceCard
            revenue={stats.totalRevenue}
            todayAppointments={stats.todayAppointments}
          />
          <RecentTransactions />
        </div>

        {/* Right Column - Bookings & Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <BookingsChart />
          <EmployeeSchedule />
        </div>
      </div>
    </div>
  );
}

function BalanceCard({
  revenue,
  todayAppointments,
}: {
  revenue: number;
  todayAppointments: number;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            Total Revenue
          </h3>
          <button className="text-muted-foreground hover:text-foreground">
            ⋮
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-4xl font-bold text-primary">
            ${revenue.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            From completed appointments
          </p>
        </div>
      </div>
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Today</h3>
        </div>
        <div className="space-y-2">
          <p className="text-4xl font-bold text-blue-600">
            {todayAppointments}
          </p>
          <p className="text-sm text-muted-foreground">
            Appointments scheduled
          </p>
        </div>
      </div>
    </div>
  );
}
