import { fetchProtected } from "./fetchProtected";

export const projectsStatsApi = async () => {
	const res = await fetchProtected(`http://localhost:4000/api/stats`);
	if (!res.ok) throw new Error(`Failed to fetch Projects: ${res.statusText}`);
	return res.json();
};
