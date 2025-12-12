import express from "express";
import {
	createProjectService,
	deleteProjectItemsService,
	getProject,
	getProjectsService,
	updateProjectService,
} from "../modules/project/service";
import { HttpError } from "../lib/errors";

const router = express.Router();

router.post("/create", async (req, res) => {
	try {
		console.log("Request body:", req.body);
		const project = await createProjectService(req.body);
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
			error: "Failed to fetch projects",
			message: e?.message ?? String(e),
		});
	}
});

router.get("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const project = await getProject(id);

		if (!project) {
			return res.status(404).json({ error: "Project not found" });
		}

		res.status(200).json(project);
	} catch (e: any) {
		console.error(`GET /api/projects/${req.params.id} error:`, e);
		res.status(500).json({
			error: "Failed to fetch project",
			message: e?.message ?? String(e),
		});
	}
});

router.put("/:id/update", async (req, res) => {
	try {
		const id = req.params.id;
		const { texts, templates } = req.body;
		await updateProjectService(id, texts, templates);
		res.status(200).json({ message: "Project updated successfully" });
	} catch (e: any) {
		console.error(`PUT /api/projects/${req.params.id}/update error:`, e);
		res.status(500).json({
			error: "Failed to update project",
			message: e?.message ?? String(e),
		});
	}
});

router.delete("/:id/items/delete", async (req, res) => {
	try {
		const id = req.params.id;
		const { selectedItems } = req.body;
		await deleteProjectItemsService(id, selectedItems);
		res.status(200).json({ message: "Selected items deleted successfully" });
	} catch (e: any) {
		console.error(`DELETE /api/projects/${req.params.id}/delete error:`, e);
		res.status(500).json({
			error: "Failed to delete selected items",
			message: e?.message ?? String(e),
		});
	}
});

export default router;
