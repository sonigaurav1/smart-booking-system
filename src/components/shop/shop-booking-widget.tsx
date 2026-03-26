"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import convex from "@/lib/convex-client";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import DateSelector from "@/components/booking/date-selector";
import TimeSelector from "@/components/booking/time-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { PATH } from "@/constants/PATH";
import { toast } from "sonner";

export default function ShopBookingWidget({
  businessId,
}: {
  businessId: Id<"businesses">;
}) {
  const router = useRouter();
  const { user } = useUser();
  type Service = { _id: string; name: string; price?: number };
  type Employee = { _id: string; name: string };
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [serviceId, setServiceId] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");
  const [clientName, setClientName] = useState<string>(user?.fullName || "");
  const [clientEmail, setClientEmail] = useState<string>(
    user?.primaryEmailAddress?.emailAddress || "",
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch services and employees for this business
    (async () => {
      const [svcs, emps] = await Promise.all([
        convex.query(api.functions.queries.listServicesForBusiness.default, {
          businessId,
        }),
        convex.query(api.functions.queries.listEmployeesForBusiness.default, {
          businessId,
        }),
      ]);
      setServices(svcs);
      setEmployees(emps);
    })();
  }, [businessId]);

  const selectedService = useMemo(
    () => services.find((s) => s._id === serviceId),
    [services, serviceId],
  );

  const canBook =
    serviceId &&
    employeeId &&
    date &&
    time &&
    clientName.trim() &&
    clientEmail.trim();

  async function handleBook() {
    if (!canBook) return;
    setLoading(true);
    try {
      const appointmentId = await convex.mutation(
        api.functions.mutations.bookAppointment.default,
        {
          businessId,
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          employeeId: employeeId as Id<"employees">,
          serviceId: serviceId as Id<"services">,
          appointmentDate: date!.toISOString().slice(0, 10), // YYYY-MM-DD
          appointmentTime: time,
          notes: undefined,
        },
      );
      toast.success("Appointment booked successfully!");
      router.push(PATH.bookingConfirmation(String(appointmentId)));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to book appointment";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-foreground">Your Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Full Name</label>
                <Input
                  placeholder="Enter your name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Service & Professional */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-foreground">Select Service & Professional</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                  Service
                </label>
                <Select value={serviceId} onValueChange={setServiceId}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        <span className="flex gap-2">
                          <span>{s.name}</span>
                          {s.price ? (
                            <span className="text-muted-foreground font-semibold">${s.price}</span>
                          ) : null}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Professional
                </label>
                <Select value={employeeId} onValueChange={setEmployeeId}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choose a professional" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e._id} value={e._id}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Step 3: Date & Time */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-foreground">Select Date & Time</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Date
                </label>
                <DateSelector value={date} onChange={setDate} />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Time
                </label>
                <TimeSelector value={time} onChange={setTime} />
              </div>
            </div>
          </div>

          {/* Booking Button */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => router.back()}
              className="flex-1"
            >
              Go Back
            </Button>
            <Button 
              size="lg" 
              disabled={!canBook || loading}
              onClick={handleBook}
              className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
            >
              {loading
                ? "Booking..."
                : selectedService
                  ? `Book ${selectedService.name}`
                  : "Complete Booking"}
            </Button>
          </div>
        </div>

        {/* Sidebar: Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-linear-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6 space-y-6\">
            <h3 className="text-lg font-semibold text-foreground\">Booking Summary</h3>
            
            <div className="space-y-4 divide-y divide-purple-100\">
              {/* Service Summary */}
              {selectedService && (
                <div className="pb-4\">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2\">Service</p>
                  <p className="font-semibold text-foreground\">{selectedService.name}</p>
                  {selectedService.price && (
                    <p className="text-lg font-bold text-purple-600 mt-1\">${selectedService.price}</p>
                  )}
                </div>
              )}

              {/* Professional Summary */}
              {employeeId && employees.find((e) => e._id === employeeId) && (
                <div className="pt-4 pb-4\">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2\">Professional</p>
                  <p className="font-semibold text-foreground\">{employees.find((e) => e._id === employeeId)?.name}</p>
                </div>
              )}

              {/* Date Summary */}
              {date && (
                <div className="pt-4 pb-4\">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2\">Date</p>
                  <p className="font-semibold text-foreground\">{date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                </div>
              )}

              {/* Time Summary */}
              {time && (
                <div className="pt-4\">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2\">Time</p>
                  <p className="font-semibold text-foreground\">{time}</p>
                </div>
              )}
            </div>

            {/* Status Indicator */}
            {canBook ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center\">
                <p className="text-sm font-semibold text-green-700\">✓ Ready to book</p>
              </div>
            ) : (
              <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 text-center\">
                <p className="text-sm text-muted-foreground\">Complete all fields</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
