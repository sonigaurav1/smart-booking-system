import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const business = await ctx.db
            .query("businesses")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();
        if (!business) return null;
        return business;
    },
});
