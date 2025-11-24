import { Request, Response } from "express";
import { getProjectsService } from "./service";

const formatDate = (date: Date) =>
	new Intl.DateTimeFormat("pl-PL", {
		day: "numeric",
		month: "long",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}).format(date);

export const getProjectsController = async (_req: Request, res: Response) => {
	try {
		const projects = await getProjectsService();
		const formatted = projects.projects.map((p) => ({
			...p,
			createdAt: formatDate(p.createdAt),
			updatedAt: formatDate(p.updatedAt),
		}));
		res.json({ ...projects, projects: formatted });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: "Nie udało się pobrać projektów" });
	}
};
