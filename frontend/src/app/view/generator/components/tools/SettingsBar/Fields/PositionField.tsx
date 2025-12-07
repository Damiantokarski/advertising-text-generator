import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Input } from "../../../../../../ui/Input/Input";
import { useUpdateText } from "../../../../hooks/useActiveCanvas";

export const PositionField = () => {
	const { value, updateValue, disabled } = useUpdateText();
	const posX = value?.position.x ?? 0;
	const posY = value?.position.y ?? 0;

	const onChangeX = (e: React.ChangeEvent<HTMLInputElement>) =>
		updateValue({
			position: { ...value!.position, x: Number(e.target.value) },
		});

	const onChangeY = (e: React.ChangeEvent<HTMLInputElement>) =>
		updateValue({
			position: { ...value!.position, y: Number(e.target.value) },
		});

	return (
		<FieldWrapper title="Position" className="flex gap-3">
			<Input
				type="number"
				inputPrefix={<span>X:</span>}
				value={Math.floor(posX)}
				onChange={onChangeX}
				disabled={disabled}
				inputSize="small"
			/>
			<Input
				type="number"
				inputPrefix={<span>Y:</span>}
				value={Math.floor(posY)}
				onChange={onChangeY}
				disabled={disabled}
				inputSize="small"
			/>
		</FieldWrapper>
	);
};
