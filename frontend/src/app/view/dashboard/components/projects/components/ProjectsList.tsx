import { ProjectCard } from "./ProjectCard";
import List from "../../../../../ui/List/List";
import ListItem from "../../../../../ui/List/ListItem";

interface ProjectListProps {
	isProjects: boolean;
	projects: {
		projectId: string;
		id: number;
		job: string;
		title: string;
		name: string;
		status: string;
		createdAt: string;
	}[];
}

export const ProjectList = ({ isProjects, projects }: ProjectListProps) => {
	if (isProjects)
		return (
			<p className="text-center text-gray-500 mt-10">No projects available...</p>
		);

	return (
		<List
			type="ul"
			className="flex flex-col gap-2 overflow-y-auto hidden-scrollbar mt-4 h-[calc(100%-48px)] "
		>
			{projects.map((project) => (
				<ListItem key={project.id} className=" w-full">
					<ProjectCard project={project} />
				</ListItem>
			))}
		</List>
	);
};
