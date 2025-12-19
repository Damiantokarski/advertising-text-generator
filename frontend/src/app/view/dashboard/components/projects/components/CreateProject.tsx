import { createProjectApi } from "../../../../../../api/projectsApi";
import { ProjectForm, type ProjectFormData } from "../../../../../ui/ProjectForm";
import { Title } from "../../../../../ui/Title";

export const CreateProject = () => {
	const handleSubmit = async (data: ProjectFormData) => {
		await createProjectApi(data);
	};

	return (
		<section
			role="dialog"
			aria-modal="true"
			aria-labelledby="create-project-heading"
			className="fixed inset-0 bg-black/50 flex items-center justify-center z-20"
		>
			<div className="relative p-8 bg-surface shadow rounded-lg">
				<div className="absolute bg-surface w-95 h-16 -top-13 left-0 rounded-lg" />
				<Title
					as="h2"
					title="Create Project"
					className="absolute -top-12 left-8 text-[42px] font-bold text-primary-blue-sky"
				/>

				<ProjectForm onSubmit={handleSubmit} />
			</div>
		</section>
	);
};
