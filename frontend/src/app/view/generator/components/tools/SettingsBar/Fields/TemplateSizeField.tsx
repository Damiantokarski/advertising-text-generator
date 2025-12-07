import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Input } from "../../../../../../ui/Input/Input";

import { useUpdateTemplate } from "../../../../hooks/useActiveCanvas";

export const TemplateSizeField = () => {
	const { value, updateValue, disabled } = useUpdateTemplate();
	const width = value?.size.width ?? 0;
	const height = value?.size.height ?? 0;

	const onChangeWidth = (e: React.ChangeEvent<HTMLInputElement>) =>
		updateValue({
			size: {
				width: Number(e.target.value),
				height: Number(height),
			},
		});

	const onChangeHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
		updateValue({
			size: {
				width: Number(width),
				height: Number(e.target.value),
			},
		});
	};

	return (
		<FieldWrapper title="Size" className="flex gap-4 items-center">
			<Input
				type="number"
				inputPrefix={<span>W:</span>}
				value={Math.floor(width)}
				onChange={onChangeWidth}
				disabled={disabled}
				inputSize="small"
			/>
			<Input
				type="number"
				inputPrefix={<span>H:</span>}
				value={Math.floor(height)}
				onChange={onChangeHeight}
				disabled={disabled}
				inputSize="small"
			/>
		</FieldWrapper>
	);
};
