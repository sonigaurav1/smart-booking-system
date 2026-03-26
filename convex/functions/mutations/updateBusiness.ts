import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
    args: {
        businessId: v.id("businesses"),
        name: v.string(),
        description: v.optional(v.string()),
        category: v.optional(v.string()),
        address: v.optional(v.string()),
        phone: v.optional(v.string()),
        openTime: v.optional(v.string()),
        closeTime: v.optional(v.string()),
        logo: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const business = await ctx.db.get(args.businessId);
        if (!business) {
            throw new Error("Business not found");
        }

        const updateData: Record<string, unknown> = {
            name: args.name,
        };

        if (args.description !== undefined) updateData.description = args.description;
        if (args.category !== undefined) updateData.category = args.category;
        if (args.address !== undefined) updateData.address = args.address;
        if (args.phone !== undefined) updateData.phone = args.phone;
        if (args.openTime !== undefined) updateData.openTime = args.openTime;
        if (args.closeTime !== undefined) updateData.closeTime = args.closeTime;
        if (args.logo !== undefined) updateData.logo = args.logo;

        await ctx.db.patch(args.businessId, updateData);

        return await ctx.db.get(args.businessId);
    },
});
