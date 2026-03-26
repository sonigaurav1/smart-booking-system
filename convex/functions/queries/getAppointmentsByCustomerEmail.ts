import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
    args: {
        customerEmail: v.string(),
    },
    handler: async (ctx, args) => {
        const appointments = await ctx.db
            .query("appointments")
            .filter((q) => q.eq(q.field("clientEmail"), args.customerEmail))
            .collect()
            .then((apts) => apts.sort((a, b) => {
                const dateA = new Date(a.appointmentDate);
                const dateB = new Date(b.appointmentDate);
                return dateB.getTime() - dateA.getTime();
            }));

        // Fetch business and service details for each appointment
        const enrichedAppointments = await Promise.all(
            appointments.map(async (apt) => {
                const business = await ctx.db.get(apt.businessId);
                const service = await ctx.db.get(apt.serviceId);
                const employee = await ctx.db.get(apt.employeeId);

                return {
                    ...apt,
                    businessName: business?.name || "Unknown Business",
                    serviceName: service?.name || "Unknown Service",
                    employeeName: employee?.name || "Unknown Employee",
                };
            })
        );

        return enrichedAppointments;
    },
});
