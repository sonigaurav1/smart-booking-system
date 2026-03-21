"use client"

import { Calendar, CheckCircle2, AlertCircle } from "lucide-react"

export default function DashboardStats() {
  const stats = [
    {
      icon: Calendar,
      title: "Total No of Appointments",
      value: "48",
      color: "text-primary",
      bgColor: "bg-blue-50",
    },
    {
      icon: CheckCircle2,
      title: "Appointments Served",
      value: "10",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: AlertCircle,
      title: "Appointments Pending",
      value: "38",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <div key={i} className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-muted-foreground text-sm mt-3">{stat.title}</p>
            <p className={`text-4xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        )
      })}
    </div>
  )
}
