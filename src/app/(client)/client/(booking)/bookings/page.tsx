"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import convex from "@/lib/convex-client";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, User, Mail, FileText } from "lucide-react";
import { toast } from "sonner";

type Appointment = {
  _id: Id<"appointments">;
  appointmentDate: string;
  appointmentTime: string;
  clientName: string;
  clientEmail: string;
  status: "pending" | "confirmed" | "done" | "cancelled";
  notes?: string;
  employeeId?: string;
  serviceId?: string;
};

type Employee = { _id: string; name: string };
type Service = { _id: string; name: string; duration?: number };

export default function BookingsPage() {
  const { user, isSignedIn } = useUser();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [employees, setEmployees] = useState<Record<string, string>>({});
  const [services, setServices] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "complete" | null>(
    null,
  );
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !user) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // Get business for this clerk user
        const business = await convex.query(
          api.functions.queries.getBusinessForClerk.default,
          { clerkId: user.id },
        );

        if (business) {
          setBusinessId(business._id);

          // Get appointments
          const appts = await convex.query(
            api.functions.queries.getAppointmentsByBusiness.default,
            { businessId: business._id as Id<"businesses"> },
          );

          // Get employees and services for mapping
          const emps = await convex.query(
            api.functions.queries.listEmployeesForBusiness.default,
            { businessId: business._id as Id<"businesses"> },
          );

          const svcs = await convex.query(
            api.functions.queries.listServicesForBusiness.default,
            { businessId: business._id as Id<"businesses"> },
          );

          setAppointments(appts);

          // Create maps for quick lookup
          const empMap: Record<string, string> = {};
          emps.forEach((e: Employee) => {
            empMap[e._id] = e.name;
          });
          setEmployees(empMap);

          const svcMap: Record<string, string> = {};
          svcs.forEach((s: Service) => {
            svcMap[s._id] = s.name;
          });
          setServices(svcMap);
        }
      } catch (error) {
        console.error("Failed to load bookings:", error);
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user]);

  const handleCancelAppointment = async () => {
    if (!selectedAppointment || !businessId) return;

    setCancelling(true);
    try {
      await convex.mutation(
        api.functions.mutations.updateAppointmentStatus.default,
        {
          appointmentId: selectedAppointment._id,
          businessId: businessId as Id<"businesses">,
          status: "cancelled",
        },
      );

      setAppointments((prev) =>
        prev.map((a) =>
          a._id === selectedAppointment._id ? { ...a, status: "cancelled" } : a,
        ),
      );

      toast.success("Appointment cancelled");
      setCancelDialogOpen(false);
      setSelectedAppointment(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to cancel appointment";
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  const handleAppointmentAction = async () => {
    if (!selectedAppointment || !businessId || !actionType) return;

    setCancelling(true);
    try {
      const newStatus = actionType === "accept" ? "confirmed" : "done";

      await convex.mutation(
        api.functions.mutations.updateAppointmentStatus.default,
        {
          appointmentId: selectedAppointment._id,
          businessId: businessId as Id<"businesses">,
          status: newStatus,
        },
      );

      setAppointments((prev) =>
        prev.map((a) =>
          a._id === selectedAppointment._id ? { ...a, status: newStatus } : a,
        ),
      );

      toast.success(
        actionType === "accept"
          ? "Appointment confirmed"
          : "Appointment marked as served",
      );
      setActionDialogOpen(false);
      setSelectedAppointment(null);
      setActionType(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update appointment";
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading appointments...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Please sign in to view bookings</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings & Appointments</h1>
        <p className="text-muted-foreground mt-1">
          Manage all appointments for your business
        </p>
      </div>

      {appointments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <Calendar className="size-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">No appointments yet</p>
            <p className="text-muted-foreground mt-1">
              Appointments will appear here when clients book services
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card
              key={appointment._id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {appointment.clientName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Service: {services[appointment.serviceId || ""] || "N/A"}
                    </p>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {getStatusLabel(appointment.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span>{appointment.appointmentDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="size-4 text-muted-foreground" />
                    <span>{appointment.appointmentTime}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <User className="size-4 text-muted-foreground" />
                    <span>
                      {employees[appointment.employeeId || ""] || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="size-4 text-muted-foreground" />
                    <span className="truncate">{appointment.clientEmail}</span>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="flex gap-3 text-sm bg-muted p-3 rounded">
                    <FileText className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{appointment.notes}</p>
                  </div>
                )}

                {appointment.status !== "cancelled" && (
                  <div className="flex gap-2 justify-end pt-2 flex-wrap">
                    {appointment.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setActionType("accept");
                            setActionDialogOpen(true);
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setCancelDialogOpen(true);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {appointment.status === "confirmed" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setActionType("complete");
                            setActionDialogOpen(true);
                          }}
                        >
                          Mark as Served
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setCancelDialogOpen(true);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment for{" "}
              <strong>{selectedAppointment?.clientName}</strong> on{" "}
              <strong>{selectedAppointment?.appointmentDate}</strong> at{" "}
              <strong>{selectedAppointment?.appointmentTime}</strong>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancelAppointment}
            disabled={cancelling}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {cancelling ? "Cancelling..." : "Cancel Appointment"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "accept"
                ? "Confirm Appointment"
                : "Mark as Served"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "accept"
                ? `Confirm this appointment for ${selectedAppointment?.clientName} on ${selectedAppointment?.appointmentDate} at ${selectedAppointment?.appointmentTime}?`
                : `Mark this appointment as served for ${selectedAppointment?.clientName}? This will complete the booking and free up the time slot.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAppointmentAction}
            disabled={cancelling}
            className={
              actionType === "accept" ? "" : "bg-green-600 hover:bg-green-700"
            }
          >
            {cancelling
              ? actionType === "accept"
                ? "Accepting..."
                : "Completing..."
              : actionType === "accept"
                ? "Accept Appointment"
                : "Mark as Complete"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
