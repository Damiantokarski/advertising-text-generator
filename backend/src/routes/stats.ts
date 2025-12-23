import express from "express";
import { requireAccessToken } from "../middleware/auth";
import { AuthenticatedRequest } from "../lib/types";
import { HttpError } from "../lib/errors";
import { projectStatsService } from "../modules/stats/service";

const router = express.Router();

router.use(requireAccessToken);

router.get("/", async (req: AuthenticatedRequest, res) => {
	try {
		const project = await projectStatsService(req.user!);
		res.status(201).json(project);
	} catch (e: any) {
		if (e instanceof HttpError) {
			return res
				.status(e.status)
				.json({ error: e.message, code: e.code, field: e.field });
		}
		res
			.status(500)
			.json({ error: "Something went wrong while creating the project" });
	}
});

export default router;
