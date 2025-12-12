import type { Template, Text } from "../app/store/slices/generator";

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
	const res = await fetch(`http://localhost:4000/api/projects/${id}`);
	if (!res.ok) throw new Error(`Failed to fetch Projects: ${res.statusText}`);
	return res.json();
};

export const updateProjectApi = async (
	id: string,
	texts: Text[],
	templates: Template[]
) => {
	const res = await fetch(`http://localhost:4000/api/projects/${id}/update`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ texts, templates }),
	});

	if (!res.ok) throw new Error(`Failed to update Project: ${res.statusText}`);
};

export const deleteProjectApi = async (id: string, selectedItems: string[]) => {
	const res = await fetch(`http://localhost:4000/api/projects/${id}/items/delete`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ selectedItems }),
	});

	if (!res.ok) throw new Error(`Failed to delete Project: ${res.statusText}`);
};
