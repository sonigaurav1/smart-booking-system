import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuthServer, getUserRoleFromClerk } from "../../../lib/auth/clerk-server";
// TODO: Wire to Convex server client. Removed invalid runMutation import to satisfy build.


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        requireAuthServer(req);
        const role = await getUserRoleFromClerk(req);
        if (role !== "client") return res.status(403).json({ error: "Only clients can create businesses" });


        // Placeholder response until Convex client wiring is added
        return res.status(501).json({ error: "Not implemented: create business" });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return res.status(401).json({ error: message });
    }
}