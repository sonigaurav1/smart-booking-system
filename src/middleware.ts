import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/about(.*)',
  '/contact(.*)',
  '/help(.*)',
  '/user(.*)',
  '/admin/sign-in(.*)',
  '/client/sign-in(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/shop(.*)'
]);

// Admin-only routes (namespaced under /admin)
// Note: avoid matching admin-unauthorized by excluding it explicitly
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
const isAdminUnauthorizedRoute = createRouteMatcher(['/admin-unauthorized(.*)']);

// Client (business owner) routes exposed at root
// These map to your (client) group: dashboard, services, employees, clients, bookings, schedule, settings, profile
const isClientRoute = createRouteMatcher([
  '/client/dashboard(.*)',
  '/client/services(.*)',
  '/client/employees(.*)',
  '/clients(.*)',
  '/client/bookings(.*)',
  '/client/schedule(.*)',
  '/client/settings(.*)',
  '/client/profile(.*)'
]);

export default clerkMiddleware(async (auth, req) => {

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Require authentication for all non-public routes
  await auth.protect();

  const session = await auth();
  const userId = session?.userId;
  const sessionClaims = session?.sessionClaims as { publicMetadata?: Record<string, unknown> } | undefined;

  // Fallback sign-in redirect (should be rare due to protect())
  if (!userId) {
    // Treat /admin-unauthorized as non-admin route to avoid loops
    const isTrueAdminArea = isAdminRoute(req) && !isAdminUnauthorizedRoute(req);
    const signInPath = isTrueAdminArea ? '/admin/sign-in' : '/sign-in';
    const signInUrl = new URL(signInPath, req.url);
    signInUrl.searchParams.set('redirectUrl', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Prefer role from session publicMetadata; fallback to Clerk user fetch
  let role = (sessionClaims?.publicMetadata?.role as string | undefined) ?? undefined;
  if (!role) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      role = (clerkUser.publicMetadata as Record<string, unknown> | null | undefined)?.role as string | undefined;
    } catch {
      // swallow; role remains undefined
    }
  }

  // Admin section guard - exclude /admin-unauthorized to prevent self-redirect loops
  if (isAdminRoute(req) && !isAdminUnauthorizedRoute(req) && role !== 'admin') {
    return NextResponse.redirect(new URL('/admin-unauthorized', req.url));
  }

  // Client dashboard/management guard
  if (isClientRoute(req) && role !== 'client') {
    return NextResponse.redirect(new URL('/client/client-unauthorized', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ]
};
