import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, CheckCircle2 } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/client/dashboard");
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">BookHub</h1>
          </div>
          <div className="flex gap-3">
            <SignInButton forceRedirectUrl="/client/dashboard" mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
            <SignUpButton forceRedirectUrl="/client/dashboard" mode="modal">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </SignUpButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 text-balance">
            Smart Appointment Booking Made Simple
          </h2>
          <p className="text-xl text-gray-600 text-balance max-w-2xl mx-auto">
            Schedule appointments effortlessly. Manage your calendar, employees,
            and clients all in one intelligent platform.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <SignUpButton forceRedirectUrl="/client/dashboard" mode="modal">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
            </SignUpButton>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: Calendar,
              title: "Smart Calendar",
              desc: "Intuitive date/time selection",
            },
            {
              icon: Clock,
              title: "Time Slots",
              desc: "Flexible scheduling options",
            },
            {
              icon: Users,
              title: "Team Management",
              desc: "Manage employees & clients",
            },
            {
              icon: CheckCircle2,
              title: "Real-time Updates",
              desc: "Instant confirmation",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg border border-blue-100 hover:border-blue-300 transition"
            >
              <feature.icon className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
          <p className="text-blue-100 mb-6 text-lg">
            Join hundreds of businesses managing appointments smarter
          </p>
          <SignUpButton forceRedirectUrl="/client/dashboard" mode="modal">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Create Your Account
            </Button>
          </SignUpButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-100 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2025 BookHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
