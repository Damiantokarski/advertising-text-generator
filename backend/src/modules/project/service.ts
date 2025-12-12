import { prisma } from "../../lib/prisma";

export const getProjectsService = async (
	page = 1,
	pageSize = 10,
	q?: string
) => {
	try {
		const take = Math.max(1, pageSize);
		const skip = Math.max(0, (Math.max(1, page) - 1) * take);

		const where = q
			? {
					OR: [
						{ name: { contains: q } },
						{ job: { contains: q } },
						{ title: { contains: q } },
						{ projectId: { contains: q } },
					],
				}
			: undefined;

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

export const createProjectService = async (data: {
	name: string;
	task: string;
	title: string;
	priority: string;
}) => {
	try {
		const { name, task, title, priority } = data;

		const existingProject = await prisma.project.findFirst({
			where: { job: task },
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
			},
		});
		return { status: true, message: "Project created successfully" };
	} catch (error) {
		return { status: false, message: "Failed to create project" };
	}
};

export const getProject = async (id: string) => {
	try {
		const project = await prisma.project.findFirst({
			where: { id },
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
	texts: any[],
	templates: any[]
) => {
	try {
		await prisma.project.update({
			where: { id },
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
	selectedItems: string[]
) => {
	try {
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
