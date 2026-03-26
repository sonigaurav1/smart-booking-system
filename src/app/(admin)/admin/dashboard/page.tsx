"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useClerk } from "@clerk/clerk-react";
import { BarChart3, Users, Calendar, TrendingUp } from "lucide-react";
import convex from "@/lib/convex-client";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import Link from "next/link";

interface Stats {
  totalBusinesses: number;
  totalAppointments: number;
  totalUsers: number;
  activeAppointments: number;
}

interface RecentAppointment {
  _id: string;
  clientName: string;
  businessId: string;
  appointmentDate: string;
  status: string;
}

export default function AdminDashboardPage() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [stats, setStats] = useState<Stats>({
    totalBusinesses: 0,
    totalAppointments: 0,
    totalUsers: 0,
    activeAppointments: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<
    RecentAppointment[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn || !user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const [businesses, users] = await Promise.all([
          convex.query(api.functions.queries.listBusinesses.default, {}),
          convex.query(api.functions.queries.listAllUsers.default, {}),
        ]);

        // For admin, we show high-level stats
        const totalAppointments = businesses.reduce((sum: number, b: any) => {
          return sum + (b.appointmentCount || 0);
        }, 0);

        setStats({
          totalBusinesses: businesses?.length || 0,
          totalAppointments: totalAppointments,
          totalUsers: users?.length || 0,
          activeAppointments: 0, // Could be calculated if we fetch more data
        });

        // For now, show empty recent appointments
        setRecentAppointments([]);
      } catch (e) {
        console.error("Failed to load admin stats:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Platform overview and statistics
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
        >
          Sign Out
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Total Businesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              Registered on platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Admins & staff members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Active Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Pending appointments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>
            Latest 5 appointments across all businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : recentAppointments.length === 0 ? (
            <p className="text-muted-foreground">No appointments yet</p>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((apt) => (
                <div
                  key={apt._id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg border hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{apt.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {apt.appointmentDate}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      apt.status === "done"
                        ? "bg-green-100 text-green-800"
                        : apt.status === "pending"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full">
                Platform Settings
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full">
                Manage Users
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
