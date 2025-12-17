import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { requireEstablishedSession, requireUnauthenticated } from "../../middleware/auth";
import { ZodError, z } from "zod";
import bcrypt from "bcryptjs";

const router = Router();

const base = z.object({
    name: z.string().min(1, "Invalid name"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Invalid password"), // TODO legit validation
})

router.post("/signup", requireUnauthenticated, async (req, res) => {
    try {
        console.log(`[auth] /signup attempt`, { ip: req.ip, email: req.body?.email });
        const normalized = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }
        const { email, name, password } = base.parse(normalized); // TODO czy dobrze ten base dalem

        const existing = await prisma.user.findUnique({ where: { email } }); // TODO email or name
        if (existing) {
            console.log(`[auth] /signup duplicate`, { email });
            return res.status(400).json({ error: "User already registered" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
                role: "USER",
            }
        });

        console.log(`[auth] /signup success`, { email });
        res.status(201).json({ ok: true, name: name, email: email });
    } catch (error) {
        console.error("Sign up error:", error);
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.issues.map((e) => ({
                    path: e.path.join("."),
                    message: e.message,
                })),
            });
        }
        if ((error as any).code === "P2002") {
            return res.status(400).json({ error: "Unique constraint failed" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }

});

export default router;