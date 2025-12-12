import type { ChangeEvent } from "react";
import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { useUpdateText } from "../../../../hooks/useActiveCanvas";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../../store/store";

export const TextField = () => {
	const { value, updateValue, disabled } = useUpdateText();
	const text = value?.text ?? "";
	const selectedElements = useSelector(
		(state: RootState) => state.generator.selectedElements
	);
	const onChangeText = (e: ChangeEvent<HTMLTextAreaElement>) =>
		updateValue({ text: e.target.value });

	return (
		<FieldWrapper title="Text">
			<textarea
				className="w-full rounded border border-primary-blue  p-2 text-tiny outline-none min-h-24 max-h-24 disabled:border-gray-200 disabled:text-gray-200"
				placeholder={disabled ? "Select text to edit" : undefined}
				value={text}
				onChange={onChangeText}
				disabled={disabled || selectedElements.length > 1}
			/>
		</FieldWrapper>
	);
};
