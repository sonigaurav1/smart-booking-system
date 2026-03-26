import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
    args: {
        serviceId: v.id("services"),
        businessId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.serviceId);
        if (!existing) throw new Error("Service not found");

        // Optional: verify businessId matches (for services)
        if (args.businessId && 'businessId' in existing && String((existing as { businessId?: string }).businessId) !== String(args.businessId)) {
            throw new Error("Mismatched businessId");
        }

        await ctx.db.delete(args.serviceId);
        return true;
    },
});
