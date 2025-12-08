import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Input } from "../../../../../../ui/Input/Input";
import { useUpdateTemplate } from "../../../../hooks/useActiveCanvas";

export const TemplateNameField = () => {
	const { value, updateValue, disabled } = useUpdateTemplate();

	const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
		updateValue({
			name: e.target.value,
		});
	};
	return (
		<FieldWrapper title="Name" className="flex flex-col gap-4 items-center">
			<Input
				type="text"
				value={value?.name ?? ""}
				onChange={onChangeName}
				disabled={disabled}
				inputSize="small"
			/>
		</FieldWrapper>
	);
};
