import express from "express";
import { getProjectsService } from "../modules/project/service";

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const page = Number(req.query.page) || 1;
		const pageSize = Number(req.query.pageSize) || Number(req.query.limit) || 10;

		const q =
			typeof req.query.q === "string" && req.query.q.trim() !== ""
				? req.query.q.trim()
				: undefined;

		const data = await getProjectsService(page, pageSize, q);

		const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
			day: "numeric",
			month: "long",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		});

		const formatted = (Array.isArray(data.projects) ? data.projects : []).map(
			(p) => ({
				...p,
				createdAt: p.createdAt ? dateFormatter.format(new Date(p.createdAt)) : null,
				updatedAt: p.updatedAt ? dateFormatter.format(new Date(p.updatedAt)) : null,
			})
		);

		res.json({
			projects: formatted,
			total: data.total,
			page: data.page,
			pageSize: data.pageSize,
			totalPages: data.totalPages,
		});
	} catch (e: any) {
		console.error("GET /api/projects error:", e);
		res.status(500).json({
			error: "Nie udało się pobrać projektów",
			message: e?.message ?? String(e),
		});
	}
});

export default router;
