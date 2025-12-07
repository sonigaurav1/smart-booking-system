import { v } from "convex/values";
import { mutation, } from "../../_generated/server";

// Validate args so businessId is a properly-typed Id<"businesses"> and other fields are checked.
export default mutation({
    args: {
        businessId: v.id("businesses"),
        name: v.string(),
        duration: v.number(),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const business = await ctx.db.get(args.businessId);
        if (!business) throw new Error("Business not found");

        return await ctx.db.insert("services", {
            businessId: args.businessId,
            name: args.name,
            duration: args.duration,
            description: args.description ?? undefined,
            price: args.price ?? undefined,
            category: args.category ?? undefined,
            createdAt: Date.now(),
        });
    },
});