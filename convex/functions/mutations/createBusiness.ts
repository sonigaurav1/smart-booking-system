import { mutation } from "../../_generated/server";
import type { Id } from "../../_generated/dataModel";

function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

type CreateBusinessInput = {
    ownerId: Id<"users">;
    name: string;
    slug?: string;
    description?: string;
    category?: string;
    address?: string;
    phone?: string;
    logo?: string;
    openTime?: string;
    closeTime?: string;
};

export default mutation(async ({ db }, businessData: CreateBusinessInput) => {
    // Expect: { ownerId, name, slug?, description?, category?, address?, phone?, logo?, openTime?, closeTime? }
    const baseSlug = businessData.slug
        ? slugify(businessData.slug)
        : slugify(businessData.name ?? "");

    if (!businessData.ownerId) throw new Error("ownerId is required");
    if (!businessData.name) throw new Error("name is required");
    if (!baseSlug) throw new Error("slug could not be derived from name");

    // Ensure slug uniqueness (append -2, -3, ... if needed)
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (true) {
        const existing = await db
            .query("businesses")
            .withIndex("by_slug", (q) => q.eq("slug", uniqueSlug))
            .first();
        if (!existing) break;
        counter += 1;
        uniqueSlug = `${baseSlug}-${counter}`;
    }

    const id = await db.insert("businesses", {
        ownerId: businessData.ownerId,
        slug: uniqueSlug,
        name: businessData.name,
        description: businessData.description || undefined,
        category: businessData.category || undefined,
        address: businessData.address || undefined,
        phone: businessData.phone || undefined,
        logo: businessData.logo || undefined,
        openTime: businessData.openTime || "09:00",
        closeTime: businessData.closeTime || "21:00",
        createdAt: Date.now(),
    });
    return id;
});