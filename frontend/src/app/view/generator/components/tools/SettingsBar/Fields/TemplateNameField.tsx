import type { ChangeEvent } from "react";
import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Input } from "../../../../../../ui/Input/Input";
import { useUpdateTemplate } from "../../../../hooks/useActiveCanvas";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../../store/store";

export const TemplateNameField = () => {
	const { value, updateValue, disabled } = useUpdateTemplate();

	const selectedElements = useSelector(
		(state: RootState) => state.generator.selectedElements
	);

	const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
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
				disabled={disabled || selectedElements.length > 1}
				inputSize="small"
			/>
		</FieldWrapper>
	);
};
