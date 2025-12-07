"use client"

const timeSlots = ["9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"]

export default function TimeSelector({
  value,
  onChange,
}: {
  value: string
  onChange: (time: string) => void
}) {
  return (
    <div className="bg-card rounded-lg p-8 border border-border">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Pick a time</h2>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => onChange(time)}
            className={`py-3 px-4 rounded-lg font-medium transition-all ${
              value === time ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-blue-100"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  )
}
