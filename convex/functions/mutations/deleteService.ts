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

    await db.delete(payload.serviceId);
    return true;
});
