import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export default mutation({
    args: {
        userId: v.id("users"),
        role: v.union(v.literal("admin"), v.literal("client"), v.literal("user")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Not authenticated");

        const actingUser = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .unique();

        if (!actingUser || actingUser.role !== "admin") {
            throw new Error("Not authorized");
        }

        // Update role in database
        await ctx.db.patch(args.userId, { role: args.role });

        // Get the user to find their Clerk ID
        const targetUser = await ctx.db.get(args.userId);
        if (targetUser && targetUser.clerkId) {
            try {
                // Update role in Clerk's public metadata via HTTP (Clerk API)
                // Note: Role is synced to Clerk's publicMetadata to ensure middleware can access it
                const clerkToken = process.env.CLERK_SECRET_KEY;
                if (clerkToken) {
                    await fetch(`https://api.clerk.com/v1/users/${targetUser.clerkId}`, {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${clerkToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            public_metadata: {
                                role: args.role,
                            },
                        }),
                    });
                }
            } catch (error) {
                console.error("Failed to update Clerk metadata:", error);
                // Continue anyway - database is updated
            }
        }

        return true;
    },
});
