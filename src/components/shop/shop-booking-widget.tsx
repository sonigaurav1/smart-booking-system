"use client";

import { useEffect, useMemo, useState } from "react";
import convex from "@/lib/convex-client";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import DateSelector from "@/components/booking/date-selector";
import TimeSelector from "@/components/booking/time-selector";
import { Button } from "@/components/ui/button";
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
  type Service = { _id: string; name: string; price?: number };
  type Employee = { _id: string; name: string };
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [serviceId, setServiceId] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch services and employees for this business
    (async () => {
      const [svcs, emps] = await Promise.all([
        convex.query(api.functions.queries.listServicesForBusiness.default, {
          businessId,
        }),
        convex.query(api.employees.listEmployees, { businessId }),
      ]);
      setServices(svcs);
      setEmployees(emps);
    })();
  }, [businessId]);

  const selectedService = useMemo(
    () => services.find((s) => s._id === serviceId),
    [services, serviceId]
  );
  // const selectedEmployee = useMemo(() => employees.find((e) => e._id === employeeId), [employees, employeeId]);

  const canBook = serviceId && employeeId && date && time;

  async function handleBook() {
    if (!canBook) return;
    setLoading(true);
    try {
      const appointmentId = await convex.mutation(
        api.functions.mutations.bookAppointment.default,
        {
          businessId,
          clientName: "", // will be stored from Clerk or entered in form; keeping minimal
          clientEmail: "",
          employeeId,
          serviceId,
          appointmentDate: date!.toISOString().slice(0, 10), // YYYY-MM-DD
          appointmentTime: time,
          notes: undefined,
        }
      );
      toast.success("Appointment booked");
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
    <div className="space-y-6">
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
                  <span className="flex justify-between w-full">
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

      <div className="flex justify-end">
        <Button size="lg" disabled={!canBook || loading} onClick={handleBook}>
          {loading
            ? "Booking..."
            : selectedService
              ? `Book ${selectedService.name}`
              : "Book"}
        </Button>
      </div>
    </div>
  );
}
