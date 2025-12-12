import { useNavigate } from "react-router-dom";
import { Title } from "../../../../ui/Title";
import { Icon } from "../../../../ui/Icon";

interface ProjectCardProps {
	project: {
		projectId: string;
		id: number;
		job: string;
		title: string;
		name: string;
		status: string;
		createdAt: string;
	};
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
				<button onClick={() => console.log("edit")} className="cursor-pointer">
					<div className="flex items-center gap-2 text-primary-blue">
						<Icon type="pencil" className="w-5 h-5 text-danger" />
					</div>
				</button>

				<button onClick={() => console.log("delete")} className="cursor-pointer ">
					<div className="flex items-center gap-2 text-fire ">
						<Icon type="trash" className="w-5 h-5 text-danger" />
					</div>
				</button>
			</div>
		</article>
	);
};
