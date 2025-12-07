"use client";
import { SignIn } from "@clerk/nextjs";

export default function AdminSignInCatchAll() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Admin Portal Login
          </h1>
          <p className="text-slate-300 text-sm">
            Restricted area. Authorized administrators only.
          </p>
        </div>
        <div className="rounded-xl border border-slate-600/50 bg-slate-800/60 backdrop-blur-md shadow-2xl shadow-black/40 p-4">
          <SignIn
            path="/admin/sign-in"
            routing="path"
            afterSignInUrl="/admin"
            afterSignUpUrl="/admin"
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-indigo-500 hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 text-sm font-medium",
                card: "bg-transparent shadow-none",
                headerTitle: "text-white",
                headerSubtitle: "text-slate-300",
                socialButtonsBlockButton:
                  "text-slate-200 border-slate-600/60 hover:bg-slate-700",
                formFieldInput:
                  "bg-slate-700/70 border-slate-600 focus:border-indigo-500 text-slate-100",
                footer: "hidden",
              },
              layout: {
                socialButtonsVariant: "iconButton",
                privacyPageUrl: "https://example.com/privacy",
                termsPageUrl: "https://example.com/terms",
              },
            }}
          />
        </div>
        <p className="text-center text-xs text-slate-400">
          If you believe you should have access, contact support.
        </p>
      </div>
    </div>
  );
}
