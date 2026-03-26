"use client";

import { useEffect, useState } from "react";
import convex from "@/lib/convex-client";
import ShopCard from "@/components/shop/shop-card";
import { api } from "convex/_generated/api";

// List all shops
export default function AllShopsPage() {
  type Shop = {
    _id: string;
    slug: string;
    name: string;
    logo?: string;
    category?: string;
    address?: string;
  };
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await convex.query(
          api.functions.queries.listBusinesses.default,
          {},
        );
        setShops(list);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
              Discover Services
            </h1>
            <p className="text-lg text-blue-100">
              Browse and book appointments from top-rated professionals in your
              area
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="space-y-4 w-full max-w-2xl">
              <div className="h-24 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="h-24 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="h-24 bg-slate-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-foreground font-semibold text-lg">
              No services available yet
            </p>
            <p className="text-muted-foreground mt-2">
              Check back soon for new businesses joining our platform
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-8 bg-blue-600 rounded"></div>
              <h2 className="text-2xl font-semibold text-foreground">
                {shops.length} Service{shops.length !== 1 ? "s" : ""} Available
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((s) => (
                <ShopCard
                  key={s._id}
                  slug={s.slug}
                  name={s.name}
                  logo={s.logo}
                  category={s.category}
                  address={s.address}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
