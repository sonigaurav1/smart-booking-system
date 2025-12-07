"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import convex from "@/lib/convex-client";
import ShopBookingWidget from "@/components/shop/shop-booking-widget";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

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
          { slug }
        );
        setBusiness(b);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading)
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!business)
    return <div className="container mx-auto px-4 py-8">Shop not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{business.name}</h1>
        {business.address ? (
          <p className="text-muted-foreground">{business.address}</p>
        ) : null}
      </header>

      <ShopBookingWidget businessId={business._id as Id<"businesses">} />
    </div>
  );
}
