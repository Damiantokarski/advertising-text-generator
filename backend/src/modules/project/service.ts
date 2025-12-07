import { prisma } from "../../lib/prisma";
import { v4 as uuidv4 } from "uuid";

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
				include: { texts: true, banners: true },
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
		console.log(data);

		const existingProject = await prisma.project.findFirst({
			where: { job: task },
		});

		if (existingProject) {
			return {
				status: false,
				message: "Project with the same job number already exists.",
			};
		}

		const projectId = uuidv4();

		await prisma.project.create({
			data: {
				projectId,
				name,
				job: task,
				title,
				status: priority,
			},
		});
		return { status: true, message: "Project created successfully", projectId };
	} catch (error) {
		return { status: false, message: "Failed to create project" };
	}
};

export const getProject = async (projectId: string) => {
	try {
		const project = await prisma.project.findFirst({
			where: { projectId },
			include: {
				texts: true,
				banners: true,
				projectSettings: true,
			},
		});
		return {
			project: {
				id: project?.projectId,
				...project,
			},
			status: true,
			message: "Project fetched successfully",
		};
	} catch (error) {
		return { project: null, status: false, message: "Failed to fetch project" };
	}
};
