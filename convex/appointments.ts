import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const listAppointments = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("appointments")
      .withIndex("by_businessId", (q) => q.eq("businessId", args.businessId))
      .collect()
  },
})

export const createAppointment = mutation({
  args: {
    businessId: v.id("businesses"),
    clientName: v.string(),
    clientEmail: v.string(),
    employeeId: v.id("employees"),
    serviceId: v.id("services"),
    appointmentDate: v.string(),
    appointmentTime: v.string(),
    status: v.union(v.literal("done"), v.literal("pending"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("appointments", {
      ...args,
      createdAt: Date.now(),
    })
  },
})

export const updateAppointmentStatus = mutation({
  args: {
    appointmentId: v.id("appointments"),
    status: v.union(v.literal("done"), v.literal("pending"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.appointmentId, { status: args.status })
  },
})
