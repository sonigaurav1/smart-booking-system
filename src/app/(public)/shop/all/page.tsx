"use client";

import { useEffect, useState } from "react";
import convex from "@/lib/convex-client";
import ShopCard from "@/components/shop/shop-card";
import { api } from "../../../../../convex/_generated/api";

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
          {}
        );
        setShops(list);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Shops</h1>
      {loading ? (
        <div>Loading...</div>
      ) : shops.length === 0 ? (
        <div className="text-muted-foreground">No shops yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      )}
    </div>
  );
}
