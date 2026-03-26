"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import convex from "@/lib/convex-client";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";

interface Appointment {
  _id: string;
  appointmentDate: string;
  appointmentTime: string;
  employeeId: string;
  clientName: string;
  status: "pending" | "confirmed" | "done" | "cancelled";
}

interface Employee {
  _id: string;
  name: string;
}

export default function CalendarPage() {
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isMarkingServed, setIsMarkingServed] = useState(false);

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

          // Fetch appointments
          const businessAppointments = await convex.query(
            api.functions.queries.getAppointmentsForBusiness.default,
            { businessId: business._id as Id<"businesses"> },
          );
          setAppointments(businessAppointments || []);

          // Fetch employees
          const businessEmployees = await convex.query(
            api.functions.queries.listEmployeesForBusiness.default,
            { businessId: business._id as Id<"businesses"> },
          );
          setEmployees(businessEmployees || []);
        }
      } catch (e) {
        console.error("Failed to load calendar data:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user, refreshKey]);

  // Refresh appointments periodically to reflect changes from bookings page
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((prev) => prev + 1);
    }, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsServed = async () => {
    if (!selectedAppointment || !businessId) return;

    try {
      setIsMarkingServed(true);
      await convex.mutation(
        api.functions.mutations.updateAppointmentStatus.default,
        {
          appointmentId: selectedAppointment._id as Id<"appointments">,
          businessId: businessId as Id<"businesses">,
          status: "done",
        },
      );

      // Update local state
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === selectedAppointment._id
            ? { ...apt, status: "done" }
            : apt,
        ),
      );

      toast({
        title: "Success",
        description: `Appointment marked as served`,
      });

      setSelectedAppointment(null);
    } catch (error) {
      console.error("Failed to mark appointment as served:", error);
      toast({
        title: "Error",
        description: "Failed to mark appointment as served",
        variant: "destructive",
      });
    } finally {
      setIsMarkingServed(false);
    }
  };

  // Get today's date
  const today = new Date();
  // Get the display date (today, but in the selected month/year)
  const displayDate = new Date(year, month, today.getDate());
  const selectedDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Get appointments for selected date (only confirmed, not pending/completed/cancelled)
  const dateAppointments = appointments
    .filter(
      (a) => a.appointmentDate === selectedDateStr && a.status === "confirmed",
    )
    .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));

  // Get unique time slots for selected date
  const timeSlots = [
    ...new Set(dateAppointments.map((a) => a.appointmentTime)),
  ].sort();

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading calendar...</p>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">No business found</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Schedule Calendar
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage employee schedules
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                setMonth(month === 0 ? 11 : month - 1);
                if (month === 0) setYear(year - 1);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {new Date(year, month).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {
                setMonth(month === 11 ? 0 : month + 1);
                if (month === 11) setYear(year + 1);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground font-medium">
            {employees.length > 0 && timeSlots.length > 0
              ? `${timeSlots.length} slot${timeSlots.length !== 1 ? "s" : ""} • ${employees.length} staff`
              : null}
          </div>
        </div>
      </div>

      {/* Show message if no data */}
      {employees.length === 0 || timeSlots.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
          <div className="flex flex-col items-center gap-2">
            <svg
              className="h-12 w-12 text-muted-foreground/40"
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
            <p className="text-sm font-medium text-muted-foreground">
              {employees.length === 0
                ? "No employees found"
                : `No appointments scheduled for ${displayDate.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    },
                  )}`}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              {employees.length === 0
                ? "Create employees in your business settings to get started"
                : "Schedule appointments to see them here"}
            </p>
          </div>
        </div>
      ) : (
        /* Calendar Grid View */
        <div className="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-24 px-4 py-3 text-left text-xs font-semibold text-muted-foreground bg-muted/50 border-b border-border">
                    Time
                  </th>
                  {employees.slice(0, 6).map((emp) => (
                    <th
                      key={emp._id}
                      className="px-4 py-3 text-center text-xs font-semibold text-foreground bg-muted/50 border-b border-r border-border last:border-r-0"
                    >
                      <div className="font-medium">{emp.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time, idx) => (
                  <tr key={time} className={idx % 2 === 0 ? "bg-muted/20" : ""}>
                    <td className="w-24 px-4 py-4 text-sm font-medium text-foreground border-b border-r border-border bg-muted/50">
                      {time}
                    </td>
                    {employees.slice(0, 6).map((emp) => {
                      const apt = dateAppointments.find(
                        (a) =>
                          a.appointmentTime === time &&
                          a.employeeId === emp._id,
                      );
                      return (
                        <td
                          key={`${time}-${emp._id}`}
                          className="px-4 py-4 text-center border-b border-r border-border last:border-r-0 hover:bg-muted/40 transition-colors"
                        >
                          {apt ? (
                            <button
                              onClick={() => setSelectedAppointment(apt)}
                              className="w-full focus:outline-none"
                            >
                              <div className="flex items-center justify-center">
                                <div
                                  className={`inline-flex items-center px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-all hover:shadow-md ${
                                    apt.status === "done"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                      apt.status === "done"
                                        ? "bg-green-500"
                                        : "bg-blue-500"
                                    }`}
                                  />
                                  {apt.clientName}
                                </div>
                              </div>
                            </button>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer info */}
          <div className="px-4 py-3 bg-muted/30 border-t border-border text-xs text-muted-foreground">
            Showing schedule for{" "}
            <span className="font-medium text-foreground">
              {displayDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      <Dialog
        open={!!selectedAppointment}
        onOpenChange={(open) => !open && setSelectedAppointment(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              {selectedAppointment ? (
                <span>
                  {selectedAppointment.clientName} at{" "}
                  {selectedAppointment.appointmentTime}
                </span>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              {/* Appointment Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    Client
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedAppointment.clientName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    Time
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedAppointment.appointmentTime}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    Date
                  </p>
                  <p className="text-sm font-semibold">
                    {new Date(
                      selectedAppointment.appointmentDate + "T00:00:00",
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    Employee
                  </p>
                  <p className="text-sm font-semibold">
                    {employees.find(
                      (e) => e._id === selectedAppointment.employeeId,
                    )?.name || "Unknown"}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium">
                  Status
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                      selectedAppointment.status === "done"
                        ? "bg-green-100 text-green-700"
                        : selectedAppointment.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        selectedAppointment.status === "done"
                          ? "bg-green-500"
                          : selectedAppointment.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-blue-500"
                      }`}
                    />
                    {selectedAppointment.status === "confirmed"
                      ? "Confirmed"
                      : selectedAppointment.status === "done"
                        ? "Served"
                        : selectedAppointment.status.charAt(0).toUpperCase() +
                          selectedAppointment.status.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedAppointment(null)}
              disabled={isMarkingServed}
            >
              Close
            </Button>
            {selectedAppointment?.status === "confirmed" && (
              <Button
                type="button"
                onClick={handleMarkAsServed}
                disabled={isMarkingServed}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                {isMarkingServed ? "Marking..." : "Mark as Served"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
