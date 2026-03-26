"use client";

interface Appointment {
  employeeId: string;
  appointmentDate: string;
  appointmentTime: string;
  clientName: string;
  status: "pending" | "confirmed" | "done" | "cancelled";
  _id?: string;
}

interface Employee {
  _id: string;
  name: string;
}

interface EmployeeScheduleProps {
  appointments?: Appointment[];
  employees?: Employee[];
}

export default function EmployeeSchedule({
  appointments = [],
  employees = [],
}: EmployeeScheduleProps) {
  // Get today's appointments
  const todayDate = new Date();
  const year = todayDate.getFullYear();
  const month = String(todayDate.getMonth() + 1).padStart(2, "0");
  const day = String(todayDate.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  const todayAppointments = appointments
    .filter((a) => a.appointmentDate === today && a.status === "confirmed")
    .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));

  if (todayAppointments.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Employee Schedule</h3>
          <button className="text-muted-foreground hover:text-foreground">
            ⋮
          </button>
        </div>
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No appointments scheduled for today</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Employee Schedule</h3>
        <button className="text-muted-foreground hover:text-foreground">
          ⋮
        </button>
      </div>
      <div className="space-y-3">
        {todayAppointments.map((apt) => {
          const employee = employees.find((e) => e._id === apt.employeeId);
          return (
            <div
              key={apt._id}
              className="flex justify-between items-center pb-3 border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10" />
                <div>
                  <p className="font-medium text-sm">
                    {employee?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {apt.appointmentTime}
                  </p>
                </div>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  apt.status === "done"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {apt.status === "done" ? "Done" : "Pending"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
