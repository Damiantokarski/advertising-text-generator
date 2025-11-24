import { createProjectApi } from "../../../../api/projectsApi";
import { useModal } from "../../../hooks/useModal";
import { Icon } from "../../../ui/Icon";
import { Pagination } from "../../../ui/Pagination";
import { ProjectForm, type ProjectFormData } from "../../../ui/ProjectForm";
import { Title } from "../../../ui/Title";
import { ProjectList } from "./components/ProjectsList";
import { Searchbar } from "./components/Searchbar";
import { useProjects } from "./hooks/useProjects";

export const Projects = () => {
	const { openModal, closeModal } = useModal();

	const {
		refetch,
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

	const handleNewProject = () => {
		openModal({
			title: "Create New Project",
			content: <ProjectForm onSubmit={createProject} />,
			className: "max-w-3xl",
		});
	};
	console.log(projects);

	const createProject = async (data: ProjectFormData) => {
		console.log(data);
		const response = await createProjectApi(data);
		console.log("Project created:", response);
		refetch();
		closeModal();
	};

	return (
		<section className="relative bg-surface rounded-lg shadow-md px-8 pt-12 pb-16 w-full max-w-7xl h-full  mx-auto my-12 ">
			<button
				onClick={handleNewProject}
				className="flex items-center gap-2 bg-primary-blue-sky px-4 py-1.5 rounded-md text-surface  hover:bg-primary-blue-hover transition-colors cursor-pointer shadow-sm"
			>
				<Icon type="plus" className="text-sm" />
				<span className="text-sm">Create project</span>
			</button>
			<Title
				as="h1"
				title="Project List"
				className="absolute -top-10.5 ml-8 text-5xl font-bold text-primary-blue-sky"
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
			<ProjectList
				projects={projects}
				isProjects={projects.length === 0}
				refetch={refetch}
			/>
		</section>
	);
};
