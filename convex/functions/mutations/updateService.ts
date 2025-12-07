import { mutation } from "../../_generated/server";

export default mutation(async ({ db, auth }, payload: any) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await db.get(payload.serviceId);
    if (!existing) throw new Error("Service not found");

    // Optional: verify businessId matches
    if (payload.businessId && String(existing.businessId) !== String(payload.businessId)) {
        throw new Error("Mismatched businessId");
    }

    const patch: any = {};
    if (payload.name !== undefined) patch.name = payload.name;
    if (payload.duration !== undefined) patch.duration = payload.duration;
    if (payload.price !== undefined) patch.price = payload.price;
    if (payload.description !== undefined) patch.description = payload.description;
    if (payload.category !== undefined) patch.category = payload.category;

    await db.patch(payload.serviceId, patch);
    return true;
});
