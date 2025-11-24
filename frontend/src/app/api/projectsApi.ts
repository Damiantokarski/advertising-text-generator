export const getProjectsApi = async (page = 1, pageSize = 10, q?: string) => {
	const params = new URLSearchParams();
	params.set("page", String(page));
	params.set("pageSize", String(pageSize));

	if (q) params.set("q", q);

	const res = await fetch(
		`http://localhost:4000/api/projects?${params.toString()}`
	);

	if (!res.ok) throw new Error(`Failed to fetch Projects: ${res.statusText}`);
	return res.json();
};
