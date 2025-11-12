import express from "express";
import { login } from "../modules/login/service";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // TODO
        const returned = await login("dupa");
        res.json({
            test: "json",
            ret: returned,
        })
    } catch (e: any) {
        console.error("GET /api/projects error:", e);
        res.status(500).json({
            error: "Nie udało się pobrać projektów",
            message: e?.message ?? String(e),
        });
    }
});

router.get("/logout", async (req, res) => {
    try {
        // TODO
        const returned = await login("dupa");
        res.json({
            test: "json",
            ret: returned,
        })
    } catch (e: any) {
        console.error("GET /api/projects error:", e);
        res.status(500).json({
            error: "Nie udało się pobrać projektów",
            message: e?.message ?? String(e),
        });
    }
});


export default router;