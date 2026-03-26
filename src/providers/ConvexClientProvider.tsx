"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export default function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // During build time without Clerk key, wrap children but don't provide ClerkProvider
  // This allows dynamic pages to render at request time with proper env vars
  if (!clerkKey) {
    // Still provide Convex if available
    if (convex && convexUrl) {
      return <>{children}</>;
    }
    return <>{children}</>;
  }

  // If Convex is not available, just use Clerk
  if (!convexUrl || !convex) {
    return <ClerkProvider publishableKey={clerkKey}>{children}</ClerkProvider>;
  }

  // Both Convex and Clerk are available
  return (
    <ClerkProvider publishableKey={clerkKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
