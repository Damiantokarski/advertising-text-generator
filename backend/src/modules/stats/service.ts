import { prisma } from "../../lib/prisma";
import { TokenPayload } from "../../lib/types";

type DateCount = { date: string; count: number };

// Format daty do YYYY-MM-DD w strefie Europe/Warsaw
const warsawDayKey = (d: Date): string => {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: "Europe/Warsaw",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).formatToParts(d);

	const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
	return `${get("year")}-${get("month")}-${get("day")}`; // YYYY-MM-DD
};

const countByDay = (
	dates: Date[],
	rangeStart: Date,
	rangeEnd: Date
): DateCount[] => {
	const map = new Map<string, number>();

	for (const d of dates) {
		const key = warsawDayKey(d);
		map.set(key, (map.get(key) ?? 0) + 1);
	}

	// wypełnij brakujące dni (count = 0)
	const startUtc = new Date(
		Date.UTC(
			rangeStart.getFullYear(),
			rangeStart.getMonth(),
			rangeStart.getDate()
		)
	);
	const endUtc = new Date(
		Date.UTC(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate())
	);

	const result: DateCount[] = [];
	const cursor = new Date(startUtc);

	while (cursor < endUtc) {
		const key = warsawDayKey(cursor);
		result.push({ date: key, count: map.get(key) ?? 0 });
		cursor.setUTCDate(cursor.getUTCDate() + 1);
	}

	return result;
};
export const projectStatsService = async (user: TokenPayload) => {
	try {
		const now = new Date();

		const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const startNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

		const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const startThisMonthAgain = startThisMonth;

		const [total, lastProjects] = await Promise.all([
			prisma.project.count({
				where: { userId: user.id },
			}),
			prisma.project.findMany({
				where: { userId: user.id },
				orderBy: { createdAt: "desc" },
				take: 5,
			}),
		]);

		const [currentMonthDates, lastMonthDates] = await Promise.all([
			prisma.project.findMany({
				where: {
					userId: user.id,
					createdAt: { gte: startThisMonth, lt: startNextMonth },
				},
				select: { createdAt: true },
			}),
			prisma.project.findMany({
				where: {
					userId: user.id,
					createdAt: { gte: startLastMonth, lt: startThisMonthAgain },
				},
				select: { createdAt: true },
			}),
		]);

		const projectsCurrentMonthByDate = countByDay(
			currentMonthDates.map((p) => p.createdAt),
			startThisMonth,
			startNextMonth
		);

		const projectsLastMonthByDate = countByDay(
			lastMonthDates.map((p) => p.createdAt),
			startLastMonth,
			startThisMonthAgain
		);

		return {
			total,
			lastProjects,
			projectsCurrentMonthByDate, // [{ date: "YYYY-MM-DD", count: number }, ...]
			projectsLastMonthByDate, // [{ date: "YYYY-MM-DD", count: number }, ...]
		};
	} catch (error) {
		return {
			total: 0,
			lastProjects: [],
			projectsCurrentMonthByDate: [],
			projectsLastMonthByDate: [],
		};
	}
};
