import { mutation } from "../../_generated/server";

export default mutation(async ({ db }, payload: any) => {
    const existing = await db.get(payload.serviceId);
    if (!existing) throw new Error("Service not found");

    // Optional: verify businessId matches (for services)
    if (payload.businessId && 'businessId' in existing && String((existing as any).businessId) !== String(payload.businessId)) {
        throw new Error("Mismatched businessId");
    }

    await db.delete(payload.serviceId);
    return true;
});
