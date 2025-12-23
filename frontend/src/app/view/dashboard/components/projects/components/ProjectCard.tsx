import { useNavigate } from "react-router-dom";
import { Title } from "../../../../../ui/Title";
import type { ProjectItem } from "../hooks/useProjects";
import { IconButton } from "../../../../../ui/IconButton";
import { ProjectForm } from "../../../../../Ui/ProjectForm";
import { useModal } from "../../../../../hooks/useModal";
import { deleteProjectApi, editProjectApi } from "../../../../../../api/projectsApi";

interface ProjectCardProps {
	project: ProjectItem;
	refetch: () => void;
}

export const ProjectCard = ({ project, refetch }: ProjectCardProps) => {
	const navigate = useNavigate();
	const { openModal, closeModal } = useModal();

	const handleCurrentProject = () =>
		navigate(`/text-generator/project/${project.id}`);

	const handleUpdateProject = () => {
		openModal({
			title: "Edit Project",
			content: <ProjectForm onSubmit={updateProject} project={project} />,
			className: "max-w-3xl",
		});
	};

	const updateProject = async (data: { name: string, task: string, title: string, priority: string }) => {
		editProjectApi(project.id, data);
		refetch();
		closeModal();
	}

	const deleteProject = async () =>{
		deleteProjectApi(project.id);
		refetch();
	}

	return (
		<article
			tabIndex={0}
			className="relative flex gap-8 p-4 bg-white rounded-lg shadow border border-primary-blue-sky hover:border-amber transition-colors duration-300 dark:border-primary-blue-hover dark:bg-primary-blue-hover/40 dark:hover:border-primary-blue-sky"
		>
			<div className="flex items-center gap-10 w-full cursor-pointer" role="button" onClick={handleCurrentProject}>
				<Title
					as="h3"
					title={project.title}
					className="text-lg font-bold text-primary-text dark:text-gray-200"
				/>
				<div className="flex gap-6">
					<div>
						<p className="text-xs font-semibold text-info uppercase text-primary-blue dark:text-gray-200">
							Task:
						</p>
						<p className="text-sm text-gray-700 dark:text-gray-400">{project.job}</p>
					</div>
					<div>
						<p className="text-xs font-semibold text-info uppercase text-primary-blue dark:text-gray-200">
							Created At:
						</p>
						<p className="text-sm text-gray-700 dark:text-gray-400">{project.createdAt}</p>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<IconButton
					icon="pencil"
					text="Edit"
					className="text-primary-blue"
					onClick={handleUpdateProject}
					tooltipPosition="left"
					tooltipOffsetClass="mt-1"
				/>
				<IconButton
					icon="trash"
					text="Delete"
					className="text-fire"
					onClick={deleteProject}
					tooltipPosition="left"
					tooltipOffsetClass="mt-1"
				/>
			</div>
		</article>
	);
};
