"use client";

import { useState } from "react";
import BookingHero from "@/components/booking/hero";
import DateSelector from "@/components/booking/date-selector";
import TimeSelector from "@/components/booking/time-selector";
import { Button } from "@/components/ui/button";

export default function BookingPage() {
  const [step, setStep] = useState<"date" | "time" | "confirmation">("date");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleContinue = () => {
    if (step === "date" && selectedDate) {
      setStep("time");
    } else if (step === "time" && selectedTime) {
      setStep("confirmation");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-blue-50">
      <BookingHero />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {step === "date" && (
          <div className="space-y-6">
            <DateSelector value={selectedDate} onChange={setSelectedDate} />
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="px-12 bg-transparent"
              >
                Back
              </Button>
              <Button
                size="lg"
                className="px-12"
                onClick={handleContinue}
                disabled={!selectedDate}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "time" && selectedDate && (
          <div className="space-y-6">
            <TimeSelector value={selectedTime} onChange={setSelectedTime} />
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                className="px-12 bg-transparent"
                onClick={() => setStep("date")}
              >
                Back
              </Button>
              <Button
                size="lg"
                className="px-12"
                onClick={handleContinue}
                disabled={!selectedTime}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "confirmation" && selectedDate && selectedTime && (
          <ConfirmationStep date={selectedDate} time={selectedTime} />
        )}
      </div>
    </div>
  );
}

function ConfirmationStep({ date, time }: { date: Date; time: string }) {
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="space-y-2">
        <p className="text-xl font-semibold text-foreground">
          Appointment Confirmed! ✓
        </p>
        <p className="text-muted-foreground">
          Your appointment is scheduled for {date.toLocaleDateString()} at{" "}
          {time}
        </p>
      </div>
      <Button size="lg" className="w-full">
        Return to Home
      </Button>
    </div>
  );
}
