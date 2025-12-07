"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserButton, useUser } from "@clerk/nextjs"

export default function DashboardHeader() {
  const { user, isLoaded } = useUser()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"

  if (!isLoaded) {
    return (
      <header className="border-b border-border px-6 py-4 flex justify-between items-center bg-background">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{greeting} 🌅</h2>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-border px-6 py-4 flex justify-between items-center bg-background">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {greeting} <span>🌅</span>
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    </header>
  )
}
