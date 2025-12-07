"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [month, setMonth] = useState(selectedDate.getMonth())
  const [year, setYear] = useState(selectedDate.getFullYear())

  // Mock data for appointments
  const appointments = [
    { time: "9:30-10:30", employee: "Dr. Sarah", client: "John Doe" },
    { time: "10:30-11:30", employee: "Dr. Mike", client: "Jane Smith" },
    { time: "11:30-12:30", employee: "Dr. Sarah", client: "Bob Johnson" },
    { time: "2:30-3:30", employee: "Dr. Mike", client: "Alice Brown" },
    { time: "3:30-4:30", employee: "Dr. Sarah", client: "Charlie Wilson" },
  ]

  const employees = ["Emp Name", "Name 1", "Name 2", "Name 3", "Name 4", "Name 5"]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            📅
          </Button>
          <span className="text-sm font-medium">1-6 of 10</span>
          <Button variant="outline" size="icon" className="w-8 h-8 bg-transparent">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="w-8 h-8 bg-transparent">
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            ⋮
          </Button>
        </div>
      </div>

      {/* Calendar Grid View */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <div className="min-w-max">
          {/* Header with time slots */}
          <div className="grid gap-px bg-border" style={{ gridTemplateColumns: "120px repeat(6, 1fr)" }}>
            <div className="bg-card p-4" />
            {employees.map((emp, i) => (
              <div key={i} className="bg-card p-4 text-center font-semibold text-sm">
                {emp}
              </div>
            ))}
          </div>

          {/* Time slots */}
          <div className="grid gap-px bg-border" style={{ gridTemplateColumns: "120px repeat(6, 1fr)" }}>
            {["9:30-10:30", "10:30-11:30", "11:30-12:30", "2:30-3:30", "3:30-4:30", "4:30-5:30", "5:30-6:30"].map(
              (time, i) => (
                <div key={i} className="contents">
                  <div className="bg-card p-4 text-sm font-semibold border-r border-border">
                    <span className="text-primary">{time}</span>
                  </div>
                  {[0, 1, 2, 3, 4, 5].map((j) => (
                    <div
                      key={`${i}-${j}`}
                      className="bg-card p-3 border-r border-border hover:bg-blue-50 cursor-pointer transition"
                    >
                      {i < appointments.length && j === 0 && (
                        <div className="text-xs font-medium px-3 py-2 bg-blue-200 text-blue-900 rounded">
                          {appointments[i].client}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
