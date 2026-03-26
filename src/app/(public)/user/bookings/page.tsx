"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import convex from "@/lib/convex-client";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

interface Appointment {
  _id: string;
  businessId: string;
  businessName: string;
  serviceName: string;
  employeeName: string;
  clientName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "pending" | "confirmed" | "done" | "cancelled";
}

export default function MyBookingsPage() {
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    (async () => {
      if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) {
        setLoading(false);
        return;
      }

      try {
        const userAppointments = await convex.query(
          api.functions.queries.getAppointmentsByCustomerEmail.default,
          { customerEmail: user.primaryEmailAddress.emailAddress },
        );
        setAppointments(userAppointments || []);
      } catch (error) {
        console.error("Failed to load appointments:", error);
        toast({
          title: "Error",
          description: "Failed to load your bookings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user, toast]);

  const handleCancelAppointment = async (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppointment) return;

    try {
      setCancelingId(selectedAppointment._id);
      await convex.mutation(
        api.functions.mutations.updateAppointmentStatus.default,
        {
          appointmentId: selectedAppointment._id as Id<"appointments">,
          businessId: selectedAppointment.businessId as Id<"businesses">,
          status: "cancelled",
        },
      );

      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === selectedAppointment._id
            ? { ...apt, status: "cancelled" }
            : apt,
        ),
      );

      toast({
        title: "Success",
        description: "Appointment cancelled successfully",
      });
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    } finally {
      setCancelingId(null);
      setShowCancelDialog(false);
      setSelectedAppointment(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "done":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "done":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  const isUpcoming = (date: string, time: string, status: string) => {
    if (status === "cancelled" || status === "done") return false;
    const appointmentDateTime = new Date(`${date}T${time}`);
    return appointmentDateTime > new Date();
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Please sign in to view your bookings
            </p>
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-muted-foreground">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-linear-to-r from-emerald-600 to-emerald-700 text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            My Bookings
          </h1>
          <p className="text-lg text-emerald-100">
            {appointments.length === 0
              ? "You haven't made any bookings yet"
              : `You have ${appointments.length} booking${appointments.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {/* Empty State */}
        {appointments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <svg
                className="h-12 w-12 text-muted-foreground/40 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-foreground font-medium">No bookings yet</p>
              <p className="text-muted-foreground text-sm mt-1">
                Explore our services and book your first appointment
              </p>
              <Button asChild className="mt-4">
                <Link href="/shop/all">Browse Services</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-8 bg-emerald-600 rounded"></div>
              <h2 className="text-2xl font-semibold text-foreground">
                Upcoming & Past Bookings
              </h2>
            </div>
            {appointments.map((appointment) => (
              <Card
                key={appointment._id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    {/* Left: Appointment Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {appointment.businessName}
                        </h3>
                        <p className="text-sm text-emerald-600 font-medium mt-1">
                          {appointment.serviceName}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                            Professional
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {appointment.employeeName}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                            Date
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(
                              `${appointment.appointmentDate}T00:00:00`,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                            Time
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {appointment.appointmentTime}
                          </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                            Status
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              appointment.status,
                            )}`}
                          >
                            {getStatusLabel(appointment.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-2 sm:w-auto sm:items-end">
                      {isUpcoming(
                        appointment.appointmentDate,
                        appointment.appointmentTime,
                        appointment.status,
                      ) &&
                        appointment.status !== "done" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment)}
                            disabled={cancelingId === appointment._id}
                            className="text-destructive hover:text-destructive w-full sm:w-auto"
                          >
                            {cancelingId === appointment._id
                              ? "Cancelling..."
                              : "Cancel Booking"}
                          </Button>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your appointment for{" "}
              <span className="font-semibold text-foreground">
                {selectedAppointment?.serviceName}
              </span>{" "}
              on{" "}
              <span className="font-semibold text-foreground">
                {selectedAppointment
                  ? new Date(
                      `${selectedAppointment.appointmentDate}T00:00:00`,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}{" "}
                at {selectedAppointment?.appointmentTime}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Do not Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmCancel}
            className="bg-destructive hover:bg-destructive/90"
          >
            Cancel Appointment
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
