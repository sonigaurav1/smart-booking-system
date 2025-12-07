"use client";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";

export default function ClientUnauthorizedPage() {
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-rose-900 via-rose-800 to-rose-700 p-6">
      <div className="w-full max-w-lg space-y-6 rounded-xl border border-rose-600/40 bg-rose-900/40 backdrop-blur-md p-8 text-rose-50 shadow-2xl shadow-black/40">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Access denied</h1>
          <p className="text-rose-100/80 text-sm">
            You are signed in, but your account doesn&apos;t have client
            permissions.
          </p>
          <p className="text-rose-100/70 text-xs">
            If you selected the wrong Google/Microsoft account by mistake, sign
            out and sign back in with your client account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => signOut({ redirectUrl: "/client/sign-in" })}
            className="inline-flex items-center justify-center rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            Sign out and switch account
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-white/0 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            Go to home
          </Link>
        </div>
      </div>
    </div>
  );
}
