"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Plus, Filter, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import convex from "@/lib/convex-client";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  _id: string;
  businessId: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  employeeId: string;
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "done" | "pending" | "cancelled";
  notes?: string;
  createdAt: number;
}

export default function AppointmentsPage() {
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "done" | "cancelled"
  >("all");
  const [updating, setUpdating] = useState<string | null>(null);

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
        if (!business) {
          setLoading(false);
          return;
        }
        setBusinessId(business._id);

        const appointmentsList = await convex.query(
          api.functions.queries.getAppointmentsForBusiness.default,
          { businessId: business._id as Id<"businesses"> },
        );
        setAppointments(appointmentsList || []);
      } catch (e) {
        console.error("Failed to load appointments:", e);
        toast({
          title: "Error",
          description: "Failed to load appointments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user, toast]);

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-orange-500 bg-orange-50";
      case "cancelled":
        return "text-red-500 bg-red-50";
      default:
        return "text-gray-600";
    }
  };

  const getStatusDisplay = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleStatusUpdate = async (
    appointmentId: string,
    newStatus: "done" | "pending" | "cancelled",
  ) => {
    if (!businessId) return;

    setUpdating(appointmentId);
    try {
      await convex.mutation(
        api.functions.mutations.updateAppointmentStatus.default,
        {
          appointmentId: appointmentId as Id<"appointments">,
          businessId: businessId as Id<"businesses">,
          status: newStatus,
        },
      );

      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === appointmentId ? { ...apt, status: newStatus } : apt,
        ),
      );

      toast({
        title: "Success",
        description: `Appointment marked as ${newStatus}`,
      });
    } catch (e) {
      console.error("Failed to update appointment:", e);
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <div className="flex gap-2">
          <div className="flex gap-2">
            {(["all", "pending", "done", "cancelled"] as const).map(
              (status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  className={filter === status ? "" : "bg-transparent"}
                  size="sm"
                  onClick={() => setFilter(status)}
                >
                  <Filter className="w-4 h-4 mr-1" />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-8"
                >
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              filteredAppointments.map((apt) => (
                <TableRow key={apt._id}>
                  <TableCell className="font-medium">
                    {apt.clientName}
                  </TableCell>
                  <TableCell>{apt.clientEmail}</TableCell>
                  <TableCell>{apt.appointmentDate}</TableCell>
                  <TableCell>{apt.appointmentTime}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(apt.status)}`}
                    >
                      {getStatusDisplay(apt.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {apt.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(apt._id, "done")}
                            disabled={updating === apt._id}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleStatusUpdate(apt._id, "cancelled")
                            }
                            disabled={updating === apt._id}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {apt.status !== "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(apt._id, "pending")}
                          disabled={updating === apt._id}
                        >
                          Revert
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
