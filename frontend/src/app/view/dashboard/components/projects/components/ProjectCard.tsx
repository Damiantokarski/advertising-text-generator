import { useNavigate } from "react-router-dom";
import { Title } from "../../../../../ui/Title";
import type { ProjectItem } from "../hooks/useProjects";
import { IconButton } from "../../../../../ui/IconButton";

interface ProjectCardProps {
	project: ProjectItem;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
	const navigate = useNavigate();

	const handleCurrentProject = () =>
		navigate(`/text-generator/project/${project.id}`);

	return (
		<article
			role="button"
			tabIndex={0}
			className="relative flex gap-8 p-4 bg-white rounded-lg shadow cursor-pointer border border-primary-blue-sky hover:border-amber transition-colors duration-300"
			onClick={handleCurrentProject}
		>
			<div className="flex items-center  gap-10 w-full">
				<Title
					as="h3"
					title={project.title}
					className="text-lg font-bold text-primary-text"
				/>
				<div className="flex gap-6">
					<div>
						<p className="text-xs font-semibold text-info uppercase text-primary-blue">
							Task:
						</p>
						<p className="text-sm text-gray-700">{project.job}</p>
					</div>
					<div>
						<p className="text-xs font-semibold text-info uppercase text-primary-blue">
							Created At:
						</p>
						<p className="text-sm text-gray-700">{project.createdAt}</p>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<IconButton
					icon="pencil"
					text="Edit"
					className="text-primary-blue"
					onClick={() => console.log("edit")}
					tooltipPosition="left"
					tooltipOffsetClass="mt-1"
				/>
				<IconButton
					icon="trash"
					text="Delete"
					className="text-fire"
					onClick={() => console.log("delete")}
					tooltipPosition="left"
					tooltipOffsetClass="mt-1"
				/>
			</div>
		</article>
	);
};
