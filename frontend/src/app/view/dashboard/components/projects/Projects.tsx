
import { createProjectApi } from "../../../../../api/projectsApi";
import { useModal } from "../../../../hooks/useModal";

import { Icon } from "../../../../ui/Icon";
import { Pagination } from "../../../../Ui/Pagination";
import { ProjectForm, type ProjectFormData } from "../../../../Ui/ProjectForm";
import { Title } from "../../../../ui/Title";
import { ProjectList } from "./components/ProjectsList";
import { Searchbar } from "./components/Searchbar";
import { useProjects } from "./hooks/useProjects";

export const Projects = () => {
	const { openModal, closeModal } = useModal();
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
		refetch,
	} = useProjects();

	const handleNewProject = () => {

		openModal({
			title: "Create New Project",
			content: <ProjectForm onSubmit={createProject} />,
			className: "max-w-3xl",
		});
	};

	const createProject = async (data: ProjectFormData) => {
		await createProjectApi(data);

		refetch();
		closeModal();
	};

	return (
		<section className="relative bg-surface rounded-lg shadow-md p-8 w-full h-full max-h-[calc(100vh-176px)] mt-16 dark:bg-dark-section">
			<button
				onClick={handleNewProject}
				className="absolute -top-34 left-0 flex items-center gap-2 bg-primary-blue-sky px-4 py-1.5 rounded-md text-surface  hover:bg-primary-blue-hover transition-colors cursor-pointer shadow-sm dark:bg-primary-blue-hover dark:hover:bg-primary-blue"
			>
				<Icon type="plus" className="text-sm" />
				<span className="text-sm">Create project</span>
			</button>
			<Title
				as="h1"
				title="Project List"
				className="absolute -top-10.5  text-5xl font-bold text-primary-blue-sky dark:text-primary-blue-hover"
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
			<ProjectList projects={projects} isProjects={projects.length === 0} refetch={refetch} />
		</section>
	);
};
