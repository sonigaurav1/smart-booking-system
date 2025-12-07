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

const data = [
  { day: "Day 1", served: 65, bookings: 20 },
  { day: "Day 2", served: 85, bookings: 15 },
  { day: "Day 3", served: 60, bookings: 25 },
  { day: "Day 4", served: 80, bookings: 18 },
  { day: "Day 5", served: 70, bookings: 22 },
  { day: "Day 6", served: 75, bookings: 20 },
  { day: "Day 7", served: 78, bookings: 17 },
  { day: "Day 8", served: 82, bookings: 16 },
  { day: "Day 9", served: 72, bookings: 23 },
  { day: "Day 10", served: 85, bookings: 15 },
];

export default function BookingsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
        <CardDescription>Served vs Bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
            />
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
