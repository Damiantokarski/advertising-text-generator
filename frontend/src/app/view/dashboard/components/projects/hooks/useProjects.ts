import { useEffect, useState, useCallback } from "react";
import { getProjectsApi } from "../../../../../../api/projectsApi";

export interface ProjectItem {
	projectId: string;
	id: string;
	job: string;
	title: string;
	name: string;
	status: string;
	createdAt: string;
}

export interface ProjectUpdatePayload {
	projectName?: string;
	jobNumber?: string;
	taskTitle?: string;
}

export interface UseProjectsResult {
	projects: ProjectItem[];
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;

	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
	setPage: (p: number) => void;
	setPageSize: (size: number) => void;
	nextPage: () => void;
	prevPage: () => void;
	goToPage: (p: number) => void;

	setSearch: (term: string) => void;
}

export function useProjects(): UseProjectsResult {
	const [projects, setProjects] = useState<ProjectItem[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSizeState] = useState<number>(10);
	const [total, setTotal] = useState<number>(0);
	const [totalPages, setTotalPages] = useState<number>(1);

	const [searchTerm, setSearchTerm] = useState<string>("");

	const [debouncedSearch, setDebouncedSearch] = useState<string>("");

	useEffect(() => {
		const id = window.setTimeout(() => setDebouncedSearch(searchTerm), 300);
		return () => window.clearTimeout(id);
	}, [searchTerm]);

	const fetchProjects = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const data = await getProjectsApi({
				page,
				pageSize,
				q: debouncedSearch || undefined,
			});
			setProjects(data.projects ?? []);
			setTotal(data.total ?? 0);
			setTotalPages(data.totalPages ?? 1);
		} catch (err: unknown) {
			if (err instanceof Error) setError(err);
			else setError(new Error("Unknown error occurred"));
		} finally {
			setIsLoading(false);
		}
	}, [page, pageSize, debouncedSearch]);

	const setPageSize = useCallback((size: number) => {
		setPageSizeState(Math.max(1, size));
		setPage(1);
	}, []);

	const setSearch = useCallback((term: string) => {
		setSearchTerm(term);
		setPage(1);
	}, []);

	useEffect(() => {
		fetchProjects();
	}, [fetchProjects]);

	const nextPage = useCallback(
		() => setPage((p) => Math.min(p + 1, totalPages)),
		[totalPages]
	);
	const prevPage = useCallback(() => setPage((p) => Math.max(p - 1, 1)), []);
	const goToPage = useCallback(
		(p: number) => setPage(Math.max(1, Math.min(p, totalPages))),
		[totalPages]
	);

	return {
		projects,
		isLoading,
		error,
		refetch: fetchProjects,

		page,
		pageSize,
		total,
		totalPages,
		setPage,
		setPageSize,
		nextPage,
		prevPage,
		goToPage,

		setSearch,
	};
}
