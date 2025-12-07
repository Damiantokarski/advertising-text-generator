import { useForm } from "react-hook-form";
import { Input } from "../../../../../../ui/Input/Input";
import { useCreateTemplate } from "../../../../hooks/useCreateTemplate";

export interface NewTemplateFormProps {
	onHideForm: () => void;
}

export interface TemplateLayerData {
	name: string;
	width: number;
	height: number;
}

export const NewTemplateForm = ({ onHideForm }: NewTemplateFormProps) => {
	const createTemplate = useCreateTemplate();

	const { register, handleSubmit, reset } = useForm<TemplateLayerData>({
		defaultValues: {
			name: "",
			width: 0,
			height: 0,
		},
		mode: "onBlur",
	});

	const onSubmit = (data: TemplateLayerData) => {
		createTemplate(data);
		onHideForm();
		reset();
	};

	return (
		<div className="px-4 py-4 bg-surface shadow rounded-lg z-1000 fixed left-100 top-4 text-tiny max-w-48 space-y-1 border-2 border-primary-blue-sky">
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
				<Input type="string" label="Name" {...register("name")} />
				<Input type="number" label="Width" {...register("width")} />
				<Input type="number" label="Height" {...register("height")} />
				<button
					type="submit"
					className="cursor-pointer bg-primary-blue text-white px-4 py-2 rounded-sm text-sm hover:bg-primary-blue-sky transition-colors"
				>
					Create
				</button>
			</form>
		</div>
	);
};
