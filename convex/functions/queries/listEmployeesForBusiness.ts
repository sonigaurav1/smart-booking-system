import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
    args: { businessId: v.id("businesses") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("employees")
            .withIndex("by_businessId", (q) => q.eq("businessId", args.businessId))
            .collect();
    },
});
