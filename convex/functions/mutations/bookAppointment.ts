import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
    args: {
        businessId: v.id("businesses"),
        clientName: v.string(),
        clientEmail: v.string(),
        employeeId: v.id("employees"),
        serviceId: v.id("services"),
        appointmentDate: v.string(),
        appointmentTime: v.string(),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        // Validate employee exists and belongs to business
        const employee = await ctx.db.get(args.employeeId);
        if (!employee || employee.businessId !== args.businessId) {
            throw new Error("Employee not found");
        }

        // Validate service exists and belongs to business
        const service = await ctx.db.get(args.serviceId);
        if (!service || service.businessId !== args.businessId) {
            throw new Error("Service not found");
        }

        // Check for slot conflicts
        const conflicts = await ctx.db
            .query("appointments")
            .withIndex("by_date_employee", (q) =>
                q
                    .eq("appointmentDate", args.appointmentDate)
                    .eq("employeeId", args.employeeId)
            )
            .collect();

        const isConflict = conflicts.some(
            (a) =>
                a.appointmentTime === args.appointmentTime &&
                a.status !== "cancelled"
        );

        if (isConflict) {
            throw new Error("Slot not available");
        }

        const appointmentId = await ctx.db.insert("appointments", {
            businessId: args.businessId,
            clientId: identity ? identity.subject : undefined,
            clientName: args.clientName,
            clientEmail: args.clientEmail,
            employeeId: args.employeeId,
            serviceId: args.serviceId,
            appointmentDate: args.appointmentDate,
            appointmentTime: args.appointmentTime,
            status: "pending",
            notes: args.notes,
            createdAt: Date.now(),
        });

        return appointmentId;
    },
});