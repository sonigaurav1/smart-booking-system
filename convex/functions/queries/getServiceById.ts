import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
    args: { serviceId: v.id("services") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.serviceId);
    },
});
