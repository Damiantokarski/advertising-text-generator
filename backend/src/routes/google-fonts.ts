import { getGoogleFonts } from "../modules/google-fonts/service";
import express from "express";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const fonts = await getGoogleFonts();
    res.json(fonts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching Google Fonts" });
  }
});

export default router;