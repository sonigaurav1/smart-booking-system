import { AlertCircle } from "lucide-react"

export default function BookingHero() {
  return (
    <div className="bg-primary text-primary-foreground px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-12">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Hello, Let's Talk!</h1>
          <p className="text-primary-foreground/90 text-lg mb-4">
            Schedule a 30 min one-to-one Appointment to discuss your challenges.
          </p>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg w-fit">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">This is optional but highly recommended!</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <img
            src="/professional-woman-doctor.jpg"
            alt="Professional booking consultant"
            className="rounded-lg w-48 h-48 object-cover"
          />
        </div>
      </div>
    </div>
  )
}
