import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        // Find Convex user by clerkId
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) return null;

        // Find business owned by this Convex user
        const business = await ctx.db
            .query("businesses")
            .withIndex("by_ownerId", (q) => q.eq("ownerId", user._id))
            .first();

        return business || null;
    },
});
