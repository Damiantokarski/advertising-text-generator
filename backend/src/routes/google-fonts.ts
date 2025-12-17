import express from "express";
import { getGoogleFonts } from "../modules/google-fonts/service";
import { requireAccessToken } from "../middleware/auth";
import { AuthenticatedRequest } from "../lib/types";

const router = express.Router();

router.use(requireAccessToken);

router.get("/", async (req: AuthenticatedRequest, res) => {
  try {
    const fonts = await getGoogleFonts();
    res.json(fonts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching Google Fonts" });
  }
});

export default router;