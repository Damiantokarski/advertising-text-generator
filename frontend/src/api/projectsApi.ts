import toast from "react-hot-toast";
import type { Template, Text } from "../app/store/slices/generator";
import { fetchProtected } from "./fetchProtected";

export interface CreateProjectPayload {
	name: string;
	task: string;
	title: string;
	priority: string;
}

export const createProjectApi = async (data: CreateProjectPayload) => {
	const res = await fetchProtected(
		`http://localhost:4000/api/projects/create`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		}
	);

	if (res.ok) {
		toast.success("Project created successfully");
		return res.json();
	} else {
		toast.error("Failed to create project");
		throw new Error(`Failed to create Project: ${res.statusText}`);
	}
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

	const res = await fetchProtected(
		`http://localhost:4000/api/projects?${params.toString()}`
	);

	if (!res.ok) throw new Error(`Failed to fetch Projects: ${res.statusText}`);
	return res.json();
};

export const getProjectApi = async (id: string) => {
	const res = await fetchProtected(`http://localhost:4000/api/projects/${id}`);
	if (!res.ok) throw new Error(`Failed to fetch Projects: ${res.statusText}`);
	return res.json();
};

export const updateProjectApi = async (
	id: string,
	texts: Text[],
	templates: Template[]
) => {
	const res = await fetchProtected(
		`http://localhost:4000/api/projects/${id}/update`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ texts, templates }),
		}
	);

	if (res.ok) {
		toast.success("Project saved successfully");
	} else {
		toast.error("Failed to save project");
		throw new Error(`Failed to update Project: ${res.statusText}`);
	}
};

export const deleteProjectItemsApi = async (
	id: string,
	selectedItems: string[]
) => {
	const res = await fetchProtected(
		`http://localhost:4000/api/projects/${id}/items/delete`,
		{
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ selectedItems }),
		}
	);

	if (res.ok) {
		toast.success("Project items deleted successfully");
	} else {
		toast.error("Failed to delete project items");
		throw new Error(`Failed to delete Project items: ${res.statusText}`);
	}
};

export const editProjectApi = async (
	id: string,
	data: { name: string; task: string; title: string; priority: string }
) => {
	console.log(data, id);
	const res = await fetchProtected(
		`http://localhost:4000/api/projects/${id}/edit`,
		{
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ data }),
		}
	);

	if (res.ok) {
		toast.success("Project updated successfully");
	} else {
		toast.error("Failed to update project");
		throw new Error(`Failed to update Project: ${res.statusText}`);
	}
};

export const deleteProjectApi = async (id: string) => {
	const res = await fetchProtected(
		`http://localhost:4000/api/projects/${id}/delete`,
		{
			method: "DELETE",
		}
	);
	if (res.ok) {
		toast.success("Project deleted successfully");
	} else {
		toast.error("Failed to delete project");
		throw new Error(`Failed to delete Project: ${res.statusText}`);
	}
};
