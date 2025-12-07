import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
    args: {
        userId: v.id("users"),
        role: v.union(v.literal("admin"), v.literal("client"), v.literal("user")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const actingUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!actingUser || actingUser.role !== "admin") {
            throw new Error("Not authorized");
        }

        await ctx.db.patch(args.userId, { role: args.role });
        return true;
    },
});