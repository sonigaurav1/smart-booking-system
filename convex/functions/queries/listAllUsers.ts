import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
    args: {
        role: v.optional(v.union(v.literal("admin"), v.literal("client"), v.literal("user"))),
    },
    handler: async (ctx, args) => {
        if (args.role) {
            return await ctx.db
                .query("users")
                .withIndex("by_role", (q) => q.eq("role", args.role as "admin" | "client" | "user"))
                .collect();
        }
        return await ctx.db.query("users").collect();
    },
});
