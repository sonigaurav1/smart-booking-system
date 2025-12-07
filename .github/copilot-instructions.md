# Copilot instructions for smart-booking-system

Use this as the “how this repo works” cheat‑sheet so an AI agent can ship changes quickly and safely.

## Big picture
- Stack: Next.js (App Router) + Convex (serverless DB/functions) + Clerk (auth/roles) + Tailwind + shadcn/ui.
- Data lives in Convex; the schema is defined in `convex/schema.ts`. Core tables: `users`, `businesses`, `employees`, `services`, `clients`, `appointments` with helpful indexes (e.g., `appointments.by_date_employee`).
- AuthZ model: roles are stored on users (`admin` | `client` | `user`). Middleware enforces access by route:
  - Public: `/`, `/about`, `/contact`, `/help`, `/shop(.*)`, `/sign-in`, `/sign-up`, plus `/user(.*)`.
  - Admin-guarded: `/admin(.*)` requires Clerk `publicMetadata.role === 'admin'`.
  - Client-guarded: `/client/(dashboard|services|employees|bookings|schedule|settings|profile)` requires role `client`.
  - Middleware source of truth: `src/middleware.ts`.
- App structure (App Router): grouped routes under `src/app/(admin)`, `(client)`, `(auth)`, `(public)`. Use `src/constants/PATH.ts` instead of hardcoding URLs.

## Day-to-day workflows
- Dev servers:
  - Web: `npm run dev` (Next.js).
  - Convex: `npm run convex` (runs `npx convex dev`). Start it alongside Next.
- Required env:
  - `NEXT_PUBLIC_CONVEX_URL` (used by `src/lib/convex-client.ts`). When running `convex dev`, use the printed URL, or set your hosted Convex URL.
  - `CLERK_JWT_ISSUER_DOMAIN` (used by `convex/auth.config.ts`) and standard Clerk Next.js envs for middleware/session.
- Build: `npm run build`, start: `npm start`.
- TypeScript path alias: `@/*` -> `./src/*` (see `tsconfig.json`). Prefer absolute imports.

## Backend patterns (Convex)
You’ll see two styles; prefer the newer co-located style under `convex/functions/...`:
- New style: default-exported `query`/`mutation` modules with explicit `args` when possible and `convex/values` validation. Examples:
  - Query with index: `convex/functions/queries/listServicesForBusiness.ts`.
  - Mutation with RBAC: `convex/functions/mutations/updateUserRole.ts` checks Clerk identity and admin role.
  - Booking flow: `convex/functions/mutations/bookAppointment.ts` validates slot conflicts via index `by_date_employee`.
- Legacy/top-level style also exists (e.g., `convex/appointments.ts`, `convex/employees.ts`, `convex/users.ts`). If you touch these, keep the export shape (`export const foo = query|mutation({...})`) consistent.
- Reuse helpers: `convex/functions/helpers/requireRole.ts` exposes `requireAuth`/`requireRole(ctx, allowed)`; use it to centralize checks.
- DB guidelines:
  - Only query rows via defined indexes (see `schema.ts` comments and existing queries). Example: appointments by business or by `(appointmentDate, employeeId)`.
  - Store timestamps as `Date.now()` numbers; optional fields use `undefined`/`optional()` (not `null`).

## Frontend patterns
- Convex client: `src/lib/convex-client.ts` instantiates `ConvexHttpClient` with `NEXT_PUBLIC_CONVEX_URL`.
- Auth:
  - Route protection is handled in `src/middleware.ts` using Clerk session and `publicMetadata.role`.
  - There’s a lightweight `src/lib/auth-context.tsx` (mock/localStorage) used for UI state; real access control must not rely on it.
- UI: shadcn/ui components in `src/components/ui/*`, and booking widgets in `src/components/booking/*` (e.g., `date-selector.tsx`, `time-selector.tsx`). Prefer composing these.
- Routes: import from `src/constants/PATH.ts` to avoid typos and ease refactors.

## Adding features quickly (examples)
- New read API: add `convex/functions/queries/yourQuery.ts` with `args` using `v` validators and a `withIndex` query. Example pattern: see `listServicesForBusiness`.
- New write API: add `convex/functions/mutations/yourMutation.ts`, validate identity with `requireAuth/requireRole` and write with `db.insert/patch`. Example pattern: see `updateUserRole` or `bookAppointment`.
- Frontend call: import the function via the generated Convex API (or use `ConvexHttpClient`), wire into a page under the appropriate route group, and gate navigation via `PATH` constants.

## Gotchas and conventions
- Ensure both Next and Convex are running; most “API not reachable” issues are missing `NEXT_PUBLIC_CONVEX_URL` or a stopped Convex dev server.
- Roles are evaluated via Clerk public metadata; when you change a user’s role (see `updateUserRole.ts`), middleware starts enforcing it immediately.
- Be consistent: don’t mix legacy and new Convex module styles within the same feature. New work should go under `convex/functions/...`.
- Use indexes defined in `schema.ts`; if you need a new query shape, add an index first, then commit the query.

## Pointers to read first
- Routing/auth: `src/middleware.ts`, `src/constants/PATH.ts`
- Data model: `convex/schema.ts`
- Convex examples: `convex/functions/mutations/bookAppointment.ts`, `convex/functions/queries/listServicesForBusiness.ts`, `convex/appointments.ts`
- UI/booking: `src/components/booking/*`

If anything here feels off (auth source of truth vs `AuthContext`, preferred Convex style, or API call conventions), tell me and I’ll tighten the guidance to match current usage.