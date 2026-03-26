"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Appointment {
  appointmentDate: string;
  status: "done" | "pending" | "cancelled" | "confirmed";
  _id?: string;
}

interface BookingsChartProps {
  appointments?: Appointment[];
}

function generateLast10DaysData(appointments: Appointment[]) {
  const data = [];
  for (let i = 9; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const dayNum = i + 1;

    const dayAppointments = appointments.filter(
      (a) => a.appointmentDate === dateStr,
    );
    const served = dayAppointments.filter((a) => a.status === "done").length;
    const bookings = dayAppointments.filter(
      (a) => a.status === "pending",
    ).length;

    data.push({
      day: `Day ${11 - dayNum}`,
      served,
      bookings,
    });
  }
  return data;
}

export default function BookingsChart({
  appointments = [],
}: BookingsChartProps) {
  const data = generateLast10DaysData(appointments);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
        <CardDescription>Served vs Bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="served"
              fill="var(--color-primary)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="bookings"
              fill="var(--color-muted)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
