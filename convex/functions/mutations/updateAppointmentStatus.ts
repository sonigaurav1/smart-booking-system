import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
    args: {
        appointmentId: v.id("appointments"),
        businessId: v.id("businesses"),
        status: v.union(v.literal("done"), v.literal("pending"), v.literal("cancelled")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const appointment = await ctx.db.get(args.appointmentId);
        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (appointment.businessId !== args.businessId) {
            throw new Error("Unauthorized: Appointment does not belong to this business");
        }

        await ctx.db.patch(args.appointmentId, {
            status: args.status,
        });

        return appointment;
    },
});
