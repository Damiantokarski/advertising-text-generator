import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../lib/types";
import { AuthenticatedRequest } from "../lib/types";


export async function requireAccessToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            console.log(`[auth] access token missing`, { ip: req.ip });
            res.status(401).json({ error: "Missing access token" });
            return
        }

        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) throw new Error("ACCESS_TOKEN_SECRET is not defined");
        const decoded = jwt.verify(accessToken, secret) as TokenPayload;

        req.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
        }

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);

        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: "Invalid or expired access token." });
        }

        res.status(500).json({ error: "Internal server error" });
    }
}

export async function requireEstablishedSession(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const sessionToken = req.cookies.sessionToken;
        if (!sessionToken) {
            console.log(`[auth] no session token`, { ip: req.ip });
            res.status(401).json({ error: "Authentication required" });
            return;
        }

        const session = await prisma.session.findUnique({
            where: { token: sessionToken },
            include: { user: true },
        });

        if (!session || session.expiresAt < new Date()) {
            console.log(`[auth] invalid session token`, { ip: req.ip });
            res.clearCookie("sessionToken");
            res.status(401).json({ error: "Invalid session" });
            await prisma.session.deleteMany({
                where: { token: sessionToken },
            });
            return;
        }
        req.session = {
            id: session.id,
            token: session.token,
        };
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function requireUnauthenticated(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const accessToken = req.cookies.accessToken;
        const sessionToken = req.cookies.sessionToken;
        if (!sessionToken && !accessToken) {
            console.log(`[auth] unauthenticated access allowed`, { ip: req.ip });
            next();
            return;
        } else if (!sessionToken && accessToken) {
            console.error("Access token set with no session token");
            res.clearCookie("sessionToken");
            res.status(403).json({ error: "Cannot access while authenticated" });
            return;
        }

        const session = await prisma.session.findUnique({
            where: { token: sessionToken },
            include: { user: true },
        });

        if (!session || session.expiresAt < new Date()) {
            res.clearCookie("accessToken");
            res.clearCookie("sessionToken");
            await prisma.session.deleteMany({
                where: { token: sessionToken },
            });
            console.log(`[auth] expired session cleared`, { ip: req.ip });
            next();
            return;
        }

        res.status(403).json({ error: "Cannot access while authenticated" });
        return
    } catch (err) {
        console.error("Auth middleware error:", err);
        res.status(500).json({ error: "Internal server error" });

    }
}