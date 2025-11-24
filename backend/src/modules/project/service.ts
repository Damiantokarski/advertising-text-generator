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
