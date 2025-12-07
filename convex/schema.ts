import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // USERS
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("client"),
      v.literal("user")
    ),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_role", ["role"]),

  // BUSINESS / SHOP PROFILE
  businesses: defineTable({
    ownerId: v.id("users"),
    // human-friendly unique URL id, e.g. "hello-saloon"
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()), // salon, doctor, repair, etc
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    logo: v.optional(v.string()),
    openTime: v.string(), // "09:00"
    closeTime: v.string(), // "21:00"
    createdAt: v.number(),
  })
    .index("by_ownerId", ["ownerId"])
    .index("by_slug", ["slug"])
    .index("by_createdAt", ["createdAt"]),

  // EMPLOYEES (under business)
  employees: defineTable({
    businessId: v.id("businesses"),
    name: v.string(),
    email: v.string(),
    photo: v.optional(v.string()),
    availableTimes: v.array(v.string()),
    createdAt: v.number(),
  }).index("by_businessId", ["businessId"]),

  // SERVICES
  services: defineTable({
    businessId: v.id("businesses"),
    name: v.string(),
    duration: v.number(), // in minutes
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_businessId", ["businessId"]),

  // CLIENTS OF A BUSINESS
  clients: defineTable({
    businessId: v.id("businesses"),
    clerkId: v.optional(v.string()),
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_businessId", ["businessId"]),

  // APPOINTMENTS
  appointments: defineTable({
    businessId: v.id("businesses"),
    clientId: v.optional(v.string()), // clerkId
    clientName: v.string(),
    clientEmail: v.string(),
    employeeId: v.id("employees"),
    serviceId: v.id("services"),
    appointmentDate: v.string(),
    appointmentTime: v.string(),
    status: v.union(
      v.literal("done"),
      v.literal("pending"),
      v.literal("cancelled")
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_businessId", ["businessId"])
    .index("by_date_employee", ["appointmentDate", "employeeId"]),
});
