import { createProjectApi } from "../../../../../api/projectsApi";
import { useAuth } from "../../../../hooks/useAuth";
import { useModal } from "../../../../hooks/useModal";
import { Icon } from "../../../../ui/Icon";
import { IconButton } from "../../../../ui/IconButton";
import { ProjectForm, type ProjectFormData } from "../../../../ui/ProjectForm";
import { useProjects } from "../projects/hooks/useProjects";
import { useTheme } from "../../../../hooks/useTheme";

export const Sidebar = () => {
	const { logout, user } = useAuth();
	const { openModal, closeModal } = useModal();
	const { refetch } = useProjects();
	const { theme, toggleTheme } = useTheme();

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
		<section className="relative bg-surface rounded-b-lg shadow-md px-8 w-full h-full max-h-16 flex items-center justify-between">
			<div className="flex">
				<button
					onClick={handleNewProject}
					className="flex items-center gap-2 bg-primary-blue-sky px-4 py-1.5 rounded-md text-surface  hover:bg-primary-blue-hover transition-colors cursor-pointer shadow-sm"
				>
					<Icon type="plus" className="text-sm" />
					<span className="text-sm">Create project</span>
				</button>
				<button
					onClick={logout}
					className="flex items-center mx-2 gap-2 bg-primary-blue-sky px-4 py-1.5 rounded-md text-surface  hover:bg-primary-blue-hover transition-colors cursor-pointer shadow-sm"
				>
					<Icon type="logout" className="text-secondary-light text-sm" />
					<span className="text-sm">Logout</span>
				</button>
			</div>
			<div className="flex items-center gap-3">
				<IconButton
					icon={theme == "dark" ? "sunHigh" : "moon"}
					text="Toggle theme (dark/light)"
					className="text-lg"
					onClick={toggleTheme}
					tooltipPosition="right"
					tooltipOffsetClass="mt-3"
				/>
				<div className="bg-primary-blue-hover/10 w-10 h-10 rounded-full flex items-center justify-center">
					<p className="font-bold text-primary-blue">{user?.name.slice(0, 1)}</p>
				</div>
				<div className="flex flex-col ">
					<p className="text-sm">{user?.name}</p>
					<p className="text-xs text-gray-500">{user?.email}</p>
				</div>
			</div>
		</section>
	);
};
