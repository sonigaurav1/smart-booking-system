"use client";

import Image from "next/image";
import Link from "next/link";
import { PATH } from "@/constants/PATH";
import { Card } from "@/components/ui/card";

export type ShopCardProps = {
  slug: string;
  name: string;
  logo?: string;
  category?: string;
  address?: string;
};

export default function ShopCard({
  slug,
  name,
  logo,
  category,
  address,
}: ShopCardProps) {
  return (
    <Link href={PATH.shopBySlug(slug)}>
      <Card className="p-4 hover:shadow-md transition-shadow h-full">
        <div className="flex items-center gap-3">
          <div className="relative size-14 shrink-0 rounded-md overflow-hidden bg-muted">
            {logo ? (
              <Image
                src={logo}
                alt={`${name} logo`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">{name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {category || "Business"}
            </div>
            {address && (
              <div className="text-xs text-muted-foreground truncate mt-0.5">
                {address}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
