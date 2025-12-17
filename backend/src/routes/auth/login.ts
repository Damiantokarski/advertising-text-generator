import express from "express";
import { prisma } from "../../lib/prisma";
import { requireUnauthenticated } from "../../middleware/auth";
import { ZodError, z } from "zod";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

const router = express.Router();

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password required"),
})

router.post("/login", requireUnauthenticated, async (req, res) => {
    try {
        const result = loginSchema.safeParse(req.body);
        console.log(`[auth] /login attempt`, { ip: req.ip, email: req.body?.email });

        if (!result.success) {
            res.status(400).json({
                error: "Validation failed",
                details: result.error.issues.map((error: any) => ({
                    path: error.path.join("."),
                    message: error.message,
                })),
            });
            return;
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log(`[auth] /login invalid email`, { email });
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const passwordValid: boolean = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            console.log(`[auth] /login invalid password`, { email });
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const sessionToken = randomBytes(32).toString("hex");
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await prisma.session.create({
            data: {
                token: sessionToken,
                userId: user.id,
                expiresAt,
            },
        });

        console.log(`[auth] /login success`, { userId: user.id, email: user.email });
        res.cookie("sessionToken", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: expiresAt,
        });

        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });
    } catch (error) {
        console.error("Sign in error:", error);
        if (error instanceof ZodError) {
            res.status(400).json({
                error: "Validation failed",
                details: error.issues.map((e) => ({
                    path: e.path.join("."),
                    message: e.message,
                })),
            });
            return;
        }
        res.status(500).json({ error: "Internal server error" })
    }
});



export default router;