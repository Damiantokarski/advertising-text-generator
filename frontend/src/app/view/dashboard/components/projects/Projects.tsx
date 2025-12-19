import { Pagination } from "../../../../ui/Pagination";
import { Title } from "../../../../ui/Title";
import { ProjectList } from "./components/ProjectsList";
import { Searchbar } from "./components/Searchbar";
import { useProjects } from "./hooks/useProjects";

export const Projects = () => {
	const {
		projects,
		page,
		pageSize,
		total,
		totalPages,
		nextPage,
		prevPage,
		goToPage,
		setPageSize,
		setSearch,
	} = useProjects();

	return (
		<section className="relative bg-surface rounded-lg shadow-md p-8 w-full h-full max-h-[calc(100vh-176px)] mt-16 ">
			<Title
				as="h1"
				title="Project List"
				className="absolute -top-10.5  text-5xl font-bold text-primary-blue-sky"
			/>
			<Searchbar onSearch={setSearch} />

			<Pagination
				page={page}
				pageSize={pageSize}
				total={total}
				totalPages={totalPages}
				nextPage={nextPage}
				prevPage={prevPage}
				goToPage={goToPage}
				setPageSize={setPageSize}
			/>
			<ProjectList projects={projects} isProjects={projects.length === 0} />
		</section>
	);
};
