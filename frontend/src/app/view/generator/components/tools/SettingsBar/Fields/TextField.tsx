import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { useUpdateText } from "../../../../hooks/useActiveCanvas";

export const TextField = () => {
	const { value, updateValue, disabled } = useUpdateText();
	const text = value?.text ?? "";

	const onChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
		updateValue({ text: e.target.value });

	return (
		<FieldWrapper title="Text">
			<textarea
				className="w-full rounded border border-primary-blue-sky bg-surface  p-2 text-tiny outline-none min-h-24 max-h-24"
				placeholder={disabled ? "Select text to edit" : undefined}
				value={text}
				onChange={onChangeText}
				disabled={disabled}
			/>
		</FieldWrapper>
	);
};
