export interface UserIdentity {
    role: string;
    [key: string]: any;
}

export interface AuthContext {
    getUserIdentity(): UserIdentity | null;
}

export interface Context {
    auth: AuthContext;
}

export function requireAuth(ctx: Context): UserIdentity {
    const identity = ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return identity;
}

export function requireRole(ctx: Context, allowed: string[]): UserIdentity {
    const identity = requireAuth(ctx);
    const userRole = identity.role;
    if (!allowed.includes(userRole)) throw new Error("Not authorized");
    return identity;
}