import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
    args: {
        employeeId: v.id("employees"),
        businessId: v.optional(v.id("businesses")),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        availableTimes: v.optional(v.array(v.string())),
    },
    handler: async ({ db, auth }, args) => {
        const identity = await auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const existing = await db.get(args.employeeId);
        if (!existing) throw new Error("Employee not found");

        if (
            args.businessId &&
            String((existing as unknown as { businessId?: string }).businessId) !==
            String(args.businessId)
        ) {
            throw new Error("Mismatched businessId");
        }

        const patch: Partial<Record<string, unknown>> = {};
        if (args.name !== undefined) patch["name"] = args.name;
        if (args.email !== undefined) patch["email"] = args.email;
        if (args.availableTimes !== undefined) patch["availableTimes"] = args.availableTimes;

        await db.patch(args.employeeId, patch as unknown as Record<string, unknown>);
        return true;
    },
});
