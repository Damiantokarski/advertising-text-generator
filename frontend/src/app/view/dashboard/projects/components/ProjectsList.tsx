import { ProjectCard } from "./ProjectCard";
import List from "../../../../ui/List/List";
import ListItem from "../../../../ui/List/ListItem";

interface ProjectListProps {
	refetch: () => void;
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

export const ProjectList = ({
	refetch,
	isProjects,
	projects,
}: ProjectListProps) => {
	if (isProjects)
		return (
			<p className="text-center text-gray-500 mt-10">No projects available...</p>
		);

	return (
		<List
			type="ul"
			className="flex flex-col gap-2 overflow-y-auto h-[calc(100%-8px)] hidden-scrollbar mt-4"
		>
			{projects.map((project) => (
				<ListItem key={project.id} className=" w-full">
					<ProjectCard project={project} />
				</ListItem>
			))}
		</List>
	);
};
