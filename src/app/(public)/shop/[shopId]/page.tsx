"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import convex from "@/lib/convex-client";
import ShopBookingWidget from "@/components/shop/shop-booking-widget";
import type { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";

export default function ShopPublicPage() {
  const params = useParams<{ shopId: string }>();
  type Business = { _id: Id<"businesses">; name: string; address?: string };
  const slug = decodeURIComponent(params.shopId);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const b = await convex.query(
          api.functions.queries.getBusinessBySlug.default,
          { slug },
        );
        setBusiness(b);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 bg-slate-200 rounded-full animate-pulse mx-auto"></div>
          <p className="text-muted-foreground">Loading business details...</p>
        </div>
      </div>
    );
  if (!business)
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <svg
            className="h-12 w-12 text-muted-foreground/40 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4v2m0 6v2m0-16.5v2m-1.5-1.5h3"
            />
          </svg>
          <p className="text-foreground font-semibold text-lg">
            Business not found
          </p>
          <p className="text-muted-foreground">
            The business you are looking for does not exist
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-purple-600 to-blue-600 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
                {business.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
                  {business.name}
                </h1>
                {business.address && (
                  <div className="flex items-center gap-2 text-purple-100">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                    <span>{business.address}</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-lg text-purple-100">
              Book your appointment in just a few clicks
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <ShopBookingWidget businessId={business._id as Id<"businesses">} />
      </div>
    </div>
  );
}
