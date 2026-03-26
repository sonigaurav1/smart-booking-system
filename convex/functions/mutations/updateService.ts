import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
    args: {
        serviceId: v.id("services"),
        businessId: v.optional(v.string()),
        name: v.optional(v.string()),
        duration: v.optional(v.number()),
        price: v.optional(v.number()),
        description: v.optional(v.string()),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.serviceId);
        if (!existing) throw new Error("Service not found");

        // Optional: verify businessId matches (for services)
        if (args.businessId && 'businessId' in existing && String((existing as { businessId?: string }).businessId) !== String(args.businessId)) {
            throw new Error("Mismatched businessId");
        }

        const patch: Record<string, unknown> = {};
        if (args.name !== undefined) patch.name = args.name;
        if (args.duration !== undefined) patch.duration = args.duration;
        if (args.price !== undefined) patch.price = args.price;
        if (args.description !== undefined) patch.description = args.description;
        if (args.category !== undefined) patch.category = args.category;

        await ctx.db.patch(args.serviceId, patch);
        return true;
    },
});
