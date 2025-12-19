import type { ChangeEvent } from "react";
import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Input } from "../../../../../../ui/Input/Input";
import { useUpdateText } from "../../../../hooks/useActiveCanvas";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../../store/store";

export const PositionField = () => {
	const { value, updateValue, disabled } = useUpdateText();
	const posX = value?.position.x ?? 0;
	const posY = value?.position.y ?? 0;

	const selectedElements = useSelector(
		(state: RootState) => state.generator.selectedElements
	);

	const onChangeX = (e: ChangeEvent<HTMLInputElement>) =>
		updateValue({
			position: { ...value!.position, x: Number(e.target.value) },
		});

	const onChangeY = (e: ChangeEvent<HTMLInputElement>) =>
		updateValue({
			position: { ...value!.position, y: Number(e.target.value) },
		});

	return (
		<FieldWrapper title="Position" className="flex gap-3">
			<Input
				type="number"
				inputPrefix={<p>X:</p>}
				value={Math.floor(posX)}
				onChange={onChangeX}
				disabled={disabled || selectedElements.length > 1}
				inputSize="small"
			/>
			<Input
				type="number"
				inputPrefix={<p>Y:</p>}
				value={Math.floor(posY)}
				onChange={onChangeY}
				disabled={disabled || selectedElements.length > 1}
				inputSize="small"
			/>
		</FieldWrapper>
	);
};
