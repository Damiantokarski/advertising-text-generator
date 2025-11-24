import { Controller, useForm, type SubmitHandler } from "react-hook-form";

import { Input } from "./Input/Input";
import { Select } from "./Select/Select";

const STATUS_OPTIONS = ["LOW", "MEDIUM", "HIGH"];

export interface ProjectFormData {
	name: string;
	task: string;
	title: string;
	priority: string;
}

export interface ProjectFormProps {
	onSubmit: SubmitHandler<ProjectFormData>;
}

export const ProjectForm = ({ onSubmit }: ProjectFormProps) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
		control,
	} = useForm<ProjectFormData>({
		defaultValues: {
			name: "",
			task: "",
			title: "",
			priority: "LOW",
		},
		mode: "onBlur",
	});

	const submit = handleSubmit(async (data) => {
		await onSubmit(data);
		reset();
	});

	return (
		<form onSubmit={submit} className="flex flex-col gap-4">
			<div className="grid grid-cols-3 gap-4">
				<Input
					id="name"
					label="Project name"
					placeholder="Google Adds - Summer Campaign"
					register={register("name")}
					error={errors.name?.message}
					required
				/>

				<Input
					id="task"
					label="Task number"
					placeholder="PG-12345"
					register={register("task")}
					error={errors.task?.message}
					required
				/>
				<Controller
					name="priority"
					control={control}
					defaultValue="LOW"
					render={({ field, fieldState }) => (
						<Select
							optionsList={STATUS_OPTIONS}
							label="Priority"
							defaultValue={field.value}
							onChange={(val) => field.onChange(val)}
							error={fieldState.error?.message}
						/>
					)}
				/>
			</div>
			<Input
				id="title"
				label="Task title"
				placeholder="Google Adds - Summer Campaign - Design"
				register={register("title")}
				error={errors.title?.message}
				required
			/>

			<button
				type="submit"
				disabled={isSubmitting}
				className="max-w-2xs text-secondary-light text-sm bg-primary-blue-sky hover:bg-primary-blue-hover text-surface px-4 py-2 rounded  transition-colors cursor-pointer"
			>
				{isSubmitting ? "Saving" : "Save"}
			</button>
		</form>
	);
};
