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
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full hover:-translate-y-0.5">
        {/* Logo/Header */}
        <div className="relative h-32 bg-linear-to-br from-blue-50 to-blue-100 overflow-hidden">
          {logo ? (
            <Image
              src={logo}
              alt={`${name} logo`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center text-2xl font-bold text-blue-600 shadow-md">
                {name.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-1">
            {name}
          </h3>
          <p className="text-sm text-blue-600 font-medium mb-2">
            {category || "Professional Services"}
          </p>
          {address && (
            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-slate-100">
              <svg
                className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {address}
              </p>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
              View Services
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
