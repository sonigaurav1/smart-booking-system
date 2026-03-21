"use client"

export default function EmployeeSchedule() {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Employee Schedule</h3>
        <button className="text-muted-foreground hover:text-foreground">⋮</button>
      </div>
      <div className="text-center py-12 text-muted-foreground">
        <p>Schedule will appear here</p>
      </div>
    </div>
  )
}
