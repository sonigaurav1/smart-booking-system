"use client";
import { lazy, Suspense } from "react";

export const dynamic = "force-dynamic";

const AdminUnauthorizedContent = lazy(
  () => import("./admin-unauthorized-content"),
);

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-rose-900 via-rose-800 to-rose-700 p-6">
    <div className="w-full max-w-lg space-y-6 rounded-xl border border-rose-600/40 bg-rose-900/40 backdrop-blur-md p-8 text-rose-50 shadow-2xl shadow-black/40">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    </div>
  </div>
);

export default function AdminUnauthorizedPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminUnauthorizedContent />
    </Suspense>
  );
}
