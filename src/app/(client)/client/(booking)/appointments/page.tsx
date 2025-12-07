"use client"

import { Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AppointmentsPage() {
  const appointments = [
    { id: 1, name: "Omkar", employee: "Omkar", service: "Stretches and exercises", timing: "9:30 AM", status: "Done" },
    { id: 2, name: "Omkar", employee: "Omkar", service: "Stretches and exercises", timing: "10:30 AM", status: "Done" },
    { id: 3, name: "Omkar", employee: "Omkar", service: "Joint mobilization", timing: "10:30 AM", status: "Done" },
    { id: 4, name: "Omkar", employee: "Omkar", service: "Joint mobilization", timing: "9:30 AM", status: "Pending" },
    { id: 5, name: "Omkar", employee: "Omkar", service: "Magnetic therapy", timing: "10:30 AM", status: "Pending" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "text-green-600"
      case "Pending":
        return "text-orange-500"
      case "Cancelled":
        return "text-red-500"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-transparent" size="sm">
            <Filter className="w-4 h-4" />
            All
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Appointment
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.NO</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Timing</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((apt) => (
              <TableRow key={apt.id}>
                <TableCell className="font-medium">{apt.id}</TableCell>
                <TableCell>{apt.name}</TableCell>
                <TableCell>{apt.employee}</TableCell>
                <TableCell className="text-muted-foreground">{apt.service}</TableCell>
                <TableCell>{apt.timing}</TableCell>
                <TableCell className={`font-semibold ${getStatusColor(apt.status)}`}>{apt.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
