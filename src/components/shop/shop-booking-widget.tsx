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
          employeeId: employeeId as any,
          serviceId: serviceId as any,
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
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Book an Appointment</h2>

        {/* Client Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Name</label>
            <Input
              placeholder="Enter your full name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="text-sm font-medium">Service</div>
          <Select value={serviceId} onValueChange={setServiceId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent className="w-(--radix-select-trigger-width)">
              {services.map((s) => (
                <SelectItem key={s._id} value={s._id}>
                  <span className="flex gap-2">
                    <span>{s.name}</span>
                    {s.price ? (
                      <span className="text-muted-foreground">${s.price}</span>
                    ) : null}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium">Professional</div>
          <Select value={employeeId} onValueChange={setEmployeeId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select professional" />
            </SelectTrigger>
            <SelectContent className="w-(--radix-select-trigger-width)">
              {employees.map((e) => (
                <SelectItem key={e._id} value={e._id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DateSelector value={date} onChange={setDate} />
        <TimeSelector value={time} onChange={setTime} />
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button size="lg" disabled={!canBook || loading} onClick={handleBook}>
          {loading
            ? "Booking..."
            : selectedService
              ? `Book ${selectedService.name}`
              : "Book Appointment"}
        </Button>
      </div>
    </div>
  );
}
