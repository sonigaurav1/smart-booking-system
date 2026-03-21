"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import convex from "@/lib/convex-client";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";

interface Business {
  _id: string;
  name: string;
  openTime?: string;
  closeTime?: string;
}

interface DaySchedule {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export default function ClientSchedulePage() {
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [daySchedules, setDaySchedules] = useState<DaySchedule[]>([
    { day: "Monday", open: "09:00", close: "18:00", closed: false },
    { day: "Tuesday", open: "09:00", close: "18:00", closed: false },
    { day: "Wednesday", open: "09:00", close: "18:00", closed: false },
    { day: "Thursday", open: "09:00", close: "18:00", closed: false },
    { day: "Friday", open: "09:00", close: "18:00", closed: false },
    { day: "Saturday", open: "10:00", close: "16:00", closed: false },
    { day: "Sunday", open: "00:00", close: "00:00", closed: true },
  ]);

  useEffect(() => {
    (async () => {
      if (!isSignedIn || !user) {
        setLoading(false);
        return;
      }

      try {
        const businessData = await convex.query(
          api.functions.queries.getBusinessForClerk.default,
          { clerkId: user.id },
        );
        if (businessData) {
          setBusiness(businessData as Business);
          if (businessData.openTime && businessData.closeTime) {
            setDaySchedules((prev) =>
              prev.map((schedule) => ({
                ...schedule,
                open: businessData.openTime,
                close: businessData.closeTime,
              })),
            );
          }
        }
      } catch (e) {
        console.error("Failed to load business:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isSignedIn, user]);

  const handleTimeChange = (
    index: number,
    field: "open" | "close",
    value: string,
  ) => {
    const newSchedules = [...daySchedules];
    newSchedules[index][field] = value;
    setDaySchedules(newSchedules);
  };

  const handleClosedChange = (index: number, closed: boolean) => {
    const newSchedules = [...daySchedules];
    newSchedules[index].closed = closed;
    setDaySchedules(newSchedules);
  };

  const handleSave = async () => {
    if (!business) return;

    setSaving(true);
    try {
      // Get the first non-closed day's hours as default
      const openDay = daySchedules.find((d) => !d.closed);
      const openTime = openDay?.open || "09:00";
      const closeTime = openDay?.close || "18:00";

      await convex.mutation(api.functions.mutations.updateBusiness.default, {
        businessId: business._id as Id<"businesses">,
        name: business.name,
        openTime,
        closeTime,
      });

      toast({
        title: "Success",
        description: "Schedule updated successfully",
      });
    } catch (e) {
      console.error("Failed to save schedule:", e);
      toast({
        title: "Error",
        description: "Failed to save schedule",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="w-8 h-8" />
          Schedule & Availability
        </h1>
        <p className="text-muted-foreground">
          Configure opening hours and availability for each day of the week
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>
            Set your business hours for each day
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {daySchedules.map((schedule, index) => (
            <div
              key={schedule.day}
              className="flex items-center gap-4 p-4 border border-border rounded-lg"
            >
              <div className="w-24">
                <p className="font-semibold text-sm">{schedule.day}</p>
              </div>

              {schedule.closed ? (
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Closed</p>
                </div>
              ) : (
                <div className="flex-1 flex items-center gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Open
                    </label>
                    <Input
                      type="time"
                      value={schedule.open}
                      onChange={(e) =>
                        handleTimeChange(index, "open", e.target.value)
                      }
                      className="h-8 w-24 text-sm"
                    />
                  </div>
                  <span className="text-muted-foreground">—</span>
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Close
                    </label>
                    <Input
                      type="time"
                      value={schedule.close}
                      onChange={(e) =>
                        handleTimeChange(index, "close", e.target.value)
                      }
                      className="h-8 w-24 text-sm"
                    />
                  </div>
                </div>
              )}

              <Button
                variant={schedule.closed ? "outline" : "ghost"}
                size="sm"
                onClick={() => handleClosedChange(index, !schedule.closed)}
              >
                {schedule.closed ? "Mark Open" : "Mark Closed"}
              </Button>
            </div>
          ))}

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-6"
          >
            {saving ? "Saving..." : "Save Schedule"}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Note</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          <p>
            Your business hours help customers see your availability.
            Appointments cannot be booked outside these hours.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
