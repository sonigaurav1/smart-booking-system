// This module intentionally avoids Node-only imports so Convex can bundle it.
// Do not import this file from Next.js route handlers or other Node contexts.
// Instead, use `src/lib/auth/clerk-server.ts` for Node/Next.js.

export async function getUserRoleFromClerk(): Promise<string | null> {
    throw new Error(
        "getUserRoleFromClerk is not available in Convex runtime. Import from src/lib/auth/clerk-server instead."
    );
}

export function requireAuthServer(): never {
    throw new Error(
        "requireAuthServer is not available in Convex runtime. Import from src/lib/auth/clerk-server instead."
    );
}