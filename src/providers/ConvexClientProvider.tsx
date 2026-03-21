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
  // During build time without required env vars, skip all providers
  if (!convexUrl || !clerkKey) {
    return <>{children}</>;
  }

  if (!convex) {
    // Has Clerk key but no Convex URL, just use Clerk
    return <ClerkProvider publishableKey={clerkKey}>{children}</ClerkProvider>;
  }

  // Both Convex and Clerk URLs available
  return (
    <ClerkProvider publishableKey={clerkKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
