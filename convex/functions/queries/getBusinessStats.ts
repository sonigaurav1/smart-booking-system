import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
    args: { businessId: v.id("businesses") },
    handler: async (ctx, args) => {
        const appointments = await ctx.db
            .query("appointments")
            .withIndex("by_businessId", (q) => q.eq("businessId", args.businessId))
            .collect();

        const totalAppointments = appointments.length;
        const completedAppointments = appointments.filter(a => a.status === "done").length;
        const pendingAppointments = appointments.filter(a => a.status === "pending").length;
        const cancelledAppointments = appointments.filter(a => a.status === "cancelled").length;

        // Calculate total revenue from completed appointments
        let totalRevenue = 0;
        for (const apt of appointments) {
            if (apt.status === "done") {
                const service = await ctx.db.get(apt.serviceId);
                if (service && service.price) {
                    totalRevenue += service.price;
                }
            }
        }

        // Count unique customers
        const uniqueCustomers = new Set(appointments.map(a => a.clientId || a.clientEmail)).size;

        // Get today's appointments
        const today = new Date().toISOString().split('T')[0];
        const todayAppointments = appointments.filter(a => a.appointmentDate === today);

        return {
            totalAppointments,
            completedAppointments,
            pendingAppointments,
            cancelledAppointments,
            totalRevenue,
            uniqueCustomers,
            todayAppointments: todayAppointments.length,
            appointmentsList: appointments,
        };
    },
});
