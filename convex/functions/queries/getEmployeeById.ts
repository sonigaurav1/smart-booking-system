import { query } from "../../_generated/server";
import { v } from "convex/values";

export default query({
    args: { employeeId: v.id("employees") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.employeeId);
    },
});
