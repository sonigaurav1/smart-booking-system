import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import type { Doc } from "../../_generated/dataModel";

export default mutation({
    args: {
        businessId: v.id("businesses"),
        name: v.string(),
        email: v.optional(v.string()),
        photo: v.optional(v.string()),
        availableTimes: v.optional(v.array(v.string())),
    },
    handler: async ({ db, auth }, args) => {
        const identity = await auth.getUserIdentity();
        console.log("Identity:", identity);
        if (!identity) throw new Error("Not authenticated");

        const business = await db.get(args.businessId);
        if (!business) throw new Error("Business not found");

        const insertPayload = {
            businessId: args.businessId,
            name: args.name,
            email: args.email ?? undefined,
            photo: args.photo ?? undefined,
            availableTimes: args.availableTimes ?? [],
            createdAt: Date.now(),
        } as unknown as Doc<"employees">;

        return await db.insert("employees", insertPayload);
    },
});