import { mutation } from "../../_generated/server";

export default mutation(async ({ db, auth }, payload: any) => {
    const identity = await auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existing = await db.get(payload.serviceId);
    if (!existing) throw new Error("Service not found");

    // Optional: verify businessId matches (for services)
    if (payload.businessId && 'businessId' in existing && String((existing as any).businessId) !== String(payload.businessId)) {
        throw new Error("Mismatched businessId");
    }

    await db.delete(payload.serviceId);
    return true;
});
