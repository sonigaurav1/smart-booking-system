type Props = {
  searchParams: { bookingId?: string };
};

export default function BookingConfirmationPage({ searchParams }: Props) {
  const bookingId = searchParams?.bookingId;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">Booking Confirmed</h1>
      {bookingId ? (
        <p className="text-muted-foreground">
          Your booking ID is <span className="font-mono">{bookingId}</span>.
        </p>
      ) : (
        <p className="text-muted-foreground">Your booking was successful.</p>
      )}
      <p className="text-sm text-muted-foreground">
        A confirmation email has been sent to your inbox.
      </p>
    </div>
  );
}
