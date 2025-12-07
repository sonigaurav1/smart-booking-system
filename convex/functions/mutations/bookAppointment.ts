import { mutation } from "../../_generated/server";


export default mutation(async ({ db, auth }, payload: any) => {
    // payload: { businessId, clientName, clientEmail, employeeId, serviceId, appointmentDate, appointmentTime, notes }
    const identity = await auth.getUserIdentity();
    // identity may be anonymous if you allow guest booking; you can still accept clientName/email


    // basic checks: employee exists, service belongs to business
    const employee = await db.get(payload.employeeId);
    if (!employee) throw new Error("Employee not found");


    const service = await db.get(payload.serviceId);
    if (!service) throw new Error("Service not found");


    // optionally: check for slot conflicts
    const conflicts = await db.query("appointments")
        .withIndex("by_date_employee", (q) =>
            q.eq("appointmentDate", payload.appointmentDate).eq("employeeId", payload.employeeId)
        )
        .collect();


    const isConflict = conflicts.some((a) => a.appointmentTime === payload.appointmentTime && a.status !== "cancelled");
    if (isConflict) throw new Error("Slot not available");


    const appointmentId = await db.insert("appointments", {
        businessId: payload.businessId,
        clientId: identity ? identity.subject : undefined,
        clientName: payload.clientName,
        clientEmail: payload.clientEmail,
        employeeId: payload.employeeId,
        serviceId: payload.serviceId,
        appointmentDate: payload.appointmentDate,
        appointmentTime: payload.appointmentTime,
        status: "pending",
        notes: payload.notes || undefined,
        createdAt: Date.now(),
    });


    return appointmentId;
});