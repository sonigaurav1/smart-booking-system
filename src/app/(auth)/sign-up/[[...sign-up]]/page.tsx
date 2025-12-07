"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <SignUp appearance={{ elements: { card: "shadow-md" } }} />
    </div>
  );
}
