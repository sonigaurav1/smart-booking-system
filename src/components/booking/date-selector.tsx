"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DateSelector({
  value,
  onChange,
}: {
  value: Date | null
  onChange: (date: Date) => void
}) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [month, setMonth] = useState(currentDate.getMonth())
  const [year, setYear] = useState(currentDate.getFullYear())

  const getDaysInMonth = (m: number, y: number) => {
    return new Date(y, m + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (m: number, y: number) => {
    return new Date(y, m, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(month, year)
  const firstDay = getFirstDayOfMonth(month, year)
  const days = []

  // Previous month's days
  const prevDaysInMonth = getDaysInMonth(month - 1, year)
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevDaysInMonth - i, isCurrentMonth: false })
  }

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true })
  }

  // Next month's days
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ day: i, isCurrentMonth: false })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  return (
    <div className="bg-card rounded-lg p-8 border border-border">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Choose a Date</h2>

      <div className="space-y-6">
        {/* Month/Year Selector */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary">{monthNames[month]}</span>
            <span className="font-medium">{year}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {["M", "Tu", "W", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div key={day} className="text-center font-semibold text-muted-foreground text-sm py-2">
              {day}
            </div>
          ))}

          {days.map((dayObj, i) => {
            const isSelected =
              value?.getDate() === dayObj.day &&
              value?.getMonth() === month &&
              value?.getFullYear() === year &&
              dayObj.isCurrentMonth

            return (
              <button
                key={i}
                onClick={() => {
                  if (dayObj.isCurrentMonth) {
                    onChange(new Date(year, month, dayObj.day))
                  }
                }}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                  !dayObj.isCurrentMonth ? "text-muted-foreground" : ""
                } ${isSelected ? "bg-primary text-primary-foreground" : dayObj.isCurrentMonth ? "hover:bg-muted" : ""}`}
              >
                {dayObj.day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
