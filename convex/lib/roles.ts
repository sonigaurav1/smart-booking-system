import { MutationCtx, QueryCtx } from "../_generated/server";

export async function requireRole(ctx: QueryCtx | MutationCtx, allowed: string[]) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  const userDoc = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();

  if (!userDoc) throw new Error("User record not found");

  if (!allowed.includes(userDoc.role)) {
    throw new Error("Not authorized");
  }

  return userDoc;
}
