"use client";

interface Appointment {
  clientName: string;
  status: "done" | "pending" | "cancelled" | "confirmed";
  serviceId: string;
  _id?: string;
}

interface Service {
  _id: string;
  price?: number;
  name: string;
}

interface RecentTransactionsProps {
  appointments?: Appointment[];
  services?: Service[];
}

export default function RecentTransactions({
  appointments = [],
  services = [],
}: RecentTransactionsProps) {
  // Get completed appointments (transactions)
  const completedAppointments = appointments
    .filter((a) => a.status === "done")
    .slice(0, 3)
    .map((apt) => {
      const service = services.find((s) => s._id === apt.serviceId);
      return {
        name: apt.clientName,
        amount: service?.price || 0,
      };
    });

  if (completedAppointments.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Transactions</h3>
          <button className="text-primary text-sm font-medium">See All</button>
        </div>
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">No completed appointments yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Transactions</h3>
        <button className="text-primary text-sm font-medium">See All</button>
      </div>
      <div className="space-y-3">
        {completedAppointments.map((tx, i) => (
          <div
            key={i}
            className="flex justify-between items-center pb-3 border-b border-border last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10" />
              <span className="font-medium text-sm">{tx.name}</span>
            </div>
            <span className="text-green-600 font-semibold">
              +${tx.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
