import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const listEmployees = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("employees")
      .withIndex("by_businessId", (q) => q.eq("businessId", args.businessId))
      .collect()
  },
})

export const createEmployee = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.string(),
    email: v.string(),
    photo: v.optional(v.string()),
    availableTimes: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("employees", {
      ...args,
      createdAt: Date.now(),
    })
  },
})
