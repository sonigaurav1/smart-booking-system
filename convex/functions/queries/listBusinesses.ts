import { query } from "../../_generated/server";

export default query(async ({ db }) => {
    // Public list of businesses for /shop/all (limit basic fields)
    const businesses = await db
        .query("businesses")
        .withIndex("by_createdAt")
        .collect();

    return businesses.map((b) => ({
        _id: b._id,
        slug: b.slug,
        name: b.name,
        logo: b.logo,
        category: b.category,
        address: b.address,
    }));
});
