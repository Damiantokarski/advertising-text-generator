import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireEstablishedSession } from "../../middleware/auth";

const router = Router();


router.post("/me", async (req, res) => {
    try {
        const sessionToken = req.cookies.sessionToken;
        if (!sessionToken) {
            console.log(`[auth] /me no session token`, { ip: req.ip });
            res.json({ user: null });
            return;
        }

        const session = await prisma.session.findUnique({
            where: { token: sessionToken },
            include: {
                user: true
            }
        });

        if (!session || session.expiresAt < new Date()) {
            console.log(`[auth] /me invalid or expired session`, { ip: req.ip });
            res.clearCookie("sessionToken");
            res.json({ user: null });
            await prisma.session.deleteMany({
                where: { token: sessionToken },
            });
            return;
        }

        console.log(`[auth] /me success`, { ip: req.ip, userId: session.user.id });
        res.json({
            id: session.id,
            token: session.token,
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
        })
    } catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({ error: "Failed to get current user" });
    }
})


export default router;