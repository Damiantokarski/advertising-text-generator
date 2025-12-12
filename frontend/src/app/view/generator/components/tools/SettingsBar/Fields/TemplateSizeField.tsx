import type { ChangeEvent } from "react";
import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Icon } from "../../../../../../ui/Icon";
import { Input } from "../../../../../../ui/Input/Input";

import { useUpdateTemplate } from "../../../../hooks/useActiveCanvas";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../../store/store";

export const TemplateSizeField = () => {
	const { value, updateValue, disabled } = useUpdateTemplate();
	const width = value?.size.width ?? 0;
	const height = value?.size.height ?? 0;
	
	const selectedElements = useSelector(
		(state: RootState) => state.generator.selectedElements
	);

	const onChangeWidth = (e: ChangeEvent<HTMLInputElement>) =>
		updateValue({
			size: {
				width: Number(e.target.value),
				height: Number(height),
			},
		});

	const onChangeHeight = (e: ChangeEvent<HTMLInputElement>) => {
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
				inputPrefix={<Icon type="width" className="text-xs" />}
				value={Math.floor(width)}
				onChange={onChangeWidth}
				disabled={disabled || selectedElements.length > 1}
				inputSize="small"
			/>
			<Input
				type="number"
				inputPrefix={<Icon type="height" className="text-xs" />}
				value={Math.floor(height)}
				onChange={onChangeHeight}
				disabled={disabled || selectedElements.length > 1}
				inputSize="small"
			/>
		</FieldWrapper>
	);
};
