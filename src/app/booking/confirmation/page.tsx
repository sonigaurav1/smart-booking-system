"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("bookingId");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 bg-muted p-4 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Confirmation ID</p>
              <p className="font-mono text-sm font-semibold">
                {bookingId || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium text-green-600">
                Your booking is confirmed
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              A confirmation email has been sent to your inbox. You can now
              close this page or browse more services.
            </p>

            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/shop/all">Browse Services</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/user/bookings">My Bookings</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading confirmation...</p>
          </div>
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}
