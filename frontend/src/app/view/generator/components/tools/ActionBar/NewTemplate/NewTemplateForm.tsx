import { useForm } from "react-hook-form";
import { Input } from "../../../../../../ui/Input/Input";
import { useCreateTemplate } from "../../../../hooks/useCreateTemplate";
import { FieldWrapper } from "../../../../../../ui/FieldWrapper";

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
			name: "Template",
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
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-3 px-4 py-4 bg-surface shadow rounded-sm z-1000 fixed left-64 top-22 text-tiny dark:bg-dark-section"
		>
			<FieldWrapper title="Name" className="mb-2">
				<Input type="string" {...register("name")} inputSize="small" placeholder="Box123" />
			</FieldWrapper>
			<FieldWrapper title="Width" className="mb-2">
				<Input type="number" {...register("width")} inputSize="small" />
			</FieldWrapper>
			<FieldWrapper title="Height" className="mb-2">
				<Input type="number" {...register("height")} inputSize="small" />
			</FieldWrapper>
			<button
				type="submit"
				className="cursor-pointer bg-primary-blue text-white px-4 py-1 rounded-sm text-sm hover:bg-primary-blue-sky transition-colors dark:bg-primary-blue-hover dark:hover:bg-primary-blue"
			>
				Create
			</button>
		</form>
	);
};
