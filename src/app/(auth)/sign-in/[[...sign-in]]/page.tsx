"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <SignIn appearance={{ elements: { card: "shadow-md" } }} />
    </div>
  );
}
