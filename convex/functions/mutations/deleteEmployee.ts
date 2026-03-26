import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
    args: {
        employeeId: v.id("employees"),
        businessId: v.optional(v.id("businesses")),
    },
    handler: async ({ db }, args) => {
        const existing = await db.get(args.employeeId);
        if (!existing) throw new Error("Employee not found");

        if (
            args.businessId &&
            String((existing as unknown as { businessId?: string }).businessId) !==
            String(args.businessId)
        ) {
            throw new Error("Mismatched businessId");
        }

        await db.delete(args.employeeId);
        return true;
    },
});
