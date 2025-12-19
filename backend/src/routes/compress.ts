import express from "express";
import { compressImage } from "../modules/compress/service";

const router = express.Router();

router.post("/", async (req, res) => {
	try {
		await compressImage(req, res);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error compressing image" });
	}
});
export default router;
