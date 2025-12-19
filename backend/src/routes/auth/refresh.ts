import { Router } from "express";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/refresh", async (req, res) => {
	try {
		const sessionToken = req.cookies.sessionToken;
		if (!sessionToken) {
			console.log(`[auth] /refresh no session token`, { ip: req.ip });
			res.status(400).json({
				error: "Session does not exist",
			});
			return;
		}

		const session = await prisma.session.findUnique({
			where: {
				token: sessionToken,
			},
			include: {
				user: true,
			},
		});
		if (!session) {
			console.log(`[auth] /refresh invalid token`, { ip: req.ip });
			res.status(401).json({ error: "Session token invalid" });
			return;
		}

		if (session.expiresAt < new Date()) {
			console.log(`[auth] /refresh expired session`, { ip: req.ip });
			res.clearCookie("sessionToken");
			res.clearCookie("accessToken");
			res.json({ user: null });
			return;
		}

		const secret = process.env.ACCESS_TOKEN_SECRET;
		if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not defined");

		const accessToken = jwt.sign(
			{
				id: session.userId,
				name: session.user.name,
				email: session.user.email,
				role: session.user.role,
			},
			secret,
			{ expiresIn: "5m" }
		);

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 5 * 60 * 1000,
		});
		console.log(`[auth] /refresh success`, {
			ip: req.ip,
			userId: session.user.id,
		});
		res.json({
			success: true,
		});
	} catch (error) {
		console.error("Access token refresh error", error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
