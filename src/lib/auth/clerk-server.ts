import { clerkClient, getAuth } from "@clerk/nextjs/server";

export async function getUserRoleFromClerk(req?: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const auth = getAuth(req as any);
    const userId = auth.userId;
    if (!userId) return null;
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    // prefer publicMetadata.role which should contain "admin" | "client" | "user"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (user as any).publicMetadata?.role || null;
}

export function requireAuthServer(req?: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { userId } = getAuth(req as any);
    if (!userId) throw new Error("Not authenticated");
    return userId;
}
