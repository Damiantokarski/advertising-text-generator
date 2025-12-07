export interface CreateProjectPayload {
	name: string;
	task: string;
	title: string;
	priority: string;
}

export const createProjectApi = async (data: CreateProjectPayload) => {
	const res = await fetch(`http://localhost:4000/api/projects/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
	console.log(res)
	if (!res.ok) throw new Error(`Failed to create Project: ${res.statusText}`);
	return res.json();
};

export interface GetProjectsPayload {
	page: number;
	pageSize: number;
	q?: string;
}

export const getProjectsApi = async (data: GetProjectsPayload) => {
	const params = new URLSearchParams();
	params.set("page", String(data.page));
	params.set("pageSize", String(data.pageSize));

	if (data.q) params.set("q", data.q);

	const res = await fetch(
		`http://localhost:4000/api/projects?${params.toString()}`
	);

	if (!res.ok) throw new Error(`Failed to fetch Projects: ${res.statusText}`);
	return res.json();
};

export const getProjectApi = async (id: string) => {
  const res = await fetch(
    `http://localhost:4000/api/projects/${id}`
  );
  if (!res.ok) throw new Error(`Failed to fetch Projects: ${res.statusText}`);
  return res.json();
};
