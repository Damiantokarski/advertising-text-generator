import { HttpError } from "../../lib/errors";
import { prisma } from "../../lib/prisma";

export const getProjectsService = async (
	page = 1,
	pageSize = 10,
	q?: string
) => {
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
	};
};

export const createProjectService = async (data: any) => {
	const existingProject = await prisma.project.findFirst({
		where: { job: data.jobNumber },
	});

	if (existingProject) {
		throw new HttpError(
			"Project with this job number already exists",
			409,
			"DUPLICATE_JOB",
			"jobNumber"
		);
	}

	return prisma.project.create({
		data: {
			projectId: data.projectId,
			name: data.projectName,
			job: data.jobNumber,
			title: data.taskTitle,
			status: data.status,
		},
	});
};
