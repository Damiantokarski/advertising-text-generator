import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireAccessToken, requireEstablishedSession, requireUnauthenticated } from "../../middleware/auth";
import { AuthenticatedRequest } from "../../lib/types";

const router = Router();

router.post("/logout", requireEstablishedSession, async (req, res) => {
    try {
        console.log(`[auth] /logout attempt`, { ip: req.ip });
        const sessionToken = req.cookies.sessionToken;
        if (sessionToken) {
            await prisma.session.deleteMany({
                where: { token: sessionToken },
            });
            res.clearCookie("sessionToken");
            res.clearCookie("accessToken");
        }
        console.log(`[auth] /logout success`, { ip: req.ip });
        res.json({ message: "Signed out successfully" });
    } catch (error) {
        console.error("Signout error:", error);
        res.status(500).json({ error: "Failed to sign out" });
    }
})

export default router;