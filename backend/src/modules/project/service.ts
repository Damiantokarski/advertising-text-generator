import { prisma } from "../../lib/prisma";
import { TokenPayload } from "../../lib/types";

export const getProjectsService = async (
	user: TokenPayload,
	page = 1,
	pageSize = 10,
	q?: string
) => {
	try {
		const take = Math.max(1, pageSize);
		const skip = Math.max(0, (Math.max(1, page) - 1) * take);

		const where: any = {
			userId: user.id,
			...(q
				? {
						OR: [
							{ name: { contains: q } },
							{ job: { contains: q } },
							{ title: { contains: q } },
							{ projectId: { contains: q } },
						],
				  }
				: {}),
		};

		const [total, projects] = await prisma.$transaction([
			prisma.project.count({ where }),
			prisma.project.findMany({
				where,
				include: { texts: true, templates: true },
				skip,
				take,
				orderBy: { createdAt: "desc" },
			}),
		]);

		const totalPages = total === 0 ? 1 : Math.ceil(total / take);

		return {
			projects,
			total,
			page: Math.max(1, page),
			pageSize: take,
			totalPages,
			message: "Projects fetched successfully",
			status: true,
		};
	} catch (error) {
		return {
			projects: [],
			total: 0,
			page: 1,
			pageSize: 10,
			totalPages: 1,
			message: "Failed to fetch projects",
			status: false,
		};
	}
};

export const createProjectService = async (
	user: TokenPayload,
	data: {
		name: string;
		task: string;
		title: string;
		priority: string;
	}
) => {
	try {
		const { name, task, title, priority } = data;

		const existingProject = await prisma.project.findFirst({
			where: { job: task, userId: user.id },
		});

		if (existingProject) {
			return {
				status: false,
				message: "Project with the same job number already exists.",
			};
		}

		await prisma.project.create({
			data: {
				name,
				job: task,
				title,
				status: priority,
				userId: user.id,
			},
		});
		return { status: true, message: "Project created successfully" };
	} catch (error) {
		return { status: false, message: "Failed to create project" };
	}
};

export const getProject = async (id: string, user: TokenPayload) => {
	try {
		const project = await prisma.project.findFirst({
			where: { id, userId: user.id },
			include: {
				texts: true,
				templates: true,
				projectSettings: true,
			},
		});
		return {
			project: {
				id: project?.id,
				...project,
			},
			status: true,
			message: "Project fetched successfully",
		};
	} catch (error) {
		return { project: null, status: false, message: "Failed to fetch project" };
	}
};

export const updateProjectService = async (
	id: string,
	user: TokenPayload,
	texts: any[],
	templates: any[]
) => {
	try {
		// Ensure project belongs to user
		const owned = await prisma.project.findFirst({
			where: { id, userId: user.id },
		});
		if (!owned) {
			return { status: false, message: "Project not found" };
		}

		await prisma.project.update({
			where: { id, userId: user.id },
			data: {
				texts: {
					deleteMany: {},
					createMany: {
						data: texts.map((text) => ({
							...text,
						})),
					},
				},
				templates: {
					deleteMany: {},
					createMany: {
						data: templates.map((template) => ({
							...template,
						})),
					},
				},
			},
		});
		return { status: true, message: "Project updated successfully" };
	} catch (error) {
		console.error("Error updating project:", error);
		return { status: false, message: "Failed to update project" };
	}
};

export const deleteProjectItemsService = async (
	id: string,
	user: TokenPayload,
	selectedItems: string[]
) => {
	try {
		// Ensure project belongs to user
		const owned = await prisma.project.findFirst({
			where: { id, userId: user.id },
		});
		if (!owned) {
			return { status: false, message: "Project not found" };
		}

		await prisma.$transaction([
			prisma.text.deleteMany({
				where: {
					id: { in: selectedItems },
					projectId: id,
				},
			}),
			prisma.template.deleteMany({
				where: {
					id: { in: selectedItems },
					projectId: id,
				},
			}),
		]);
		return { status: true, message: "Items deleted successfully" };
	} catch (error) {
		return { status: false, message: "Failed to delete items" };
	}
};

export const editProjectService = async (
	id: string,
	user: TokenPayload,
	data: { name: string; task: string; title: string; priority: string }
) => {
	try {
		const owned = await prisma.project.findFirst({
			where: { id, userId: user.id },
		});
		if (!owned) {
			return { status: false, message: "Project not found" };
		}
		const { name, task, title, priority } = data;

		await prisma.project.updateMany({
			where: { id, userId: user.id },
			data: {
				name,
				job: task,
				title,
				status: priority,
			},
		});
		return { status: true, message: "Project updated successfully" };
	} catch (error) {
		return { status: false, message: "Failed to update project" };
	}
};
export const deleteProjectService = async (id: string, user: TokenPayload) => {
	try {
		const owned = await prisma.project.findFirst({
			where: { id, userId: user.id },
		});
		if (!owned) {
			return { status: false, message: "Project not found" };
		}
		await prisma.project.deleteMany({
			where: { id, userId: user.id },
		});

		return { status: true, message: "Project deleted successfully" };
	} catch (error) {
		return { status: false, message: "Failed to delete project" };
	}
};
