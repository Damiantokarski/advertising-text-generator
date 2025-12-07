import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Icon } from "../../../../../../ui/Icon";
import { Input } from "../../../../../../ui/Input/Input";
import { useUpdateText } from "../../../../hooks/useActiveCanvas";

export const SpaceField = () => {
	const { value, updateValue, disabled } = useUpdateText();
	const lineHeight = value?.typography.lineHeight ?? 0;
	const letterSpacing = value?.typography.letterSpacing ?? 0;

	const onChangeLH = (e: React.ChangeEvent<HTMLInputElement>) =>
		updateValue({
			typography: {
				...value!.typography,
				lineHeight: Number(e.target.value),
			},
		});

	const onChangeLS = (e: React.ChangeEvent<HTMLInputElement>) =>
		updateValue({
			typography: {
				...value!.typography,
				letterSpacing: Number(e.target.value),
			},
		});

	return (
		<FieldWrapper title="Spacing" className="flex gap-3">
			<Input
				type="number"
				step={0.1}
				inputPrefix={<Icon type="lineHeight" />}
				value={lineHeight.toString()}
				onChange={onChangeLH}
				disabled={disabled}
				inputSize="small"
			/>
			<Input
				type="number"
				step={0.1}
				inputPrefix={<Icon type="letterSpacing" />}
				value={letterSpacing.toString()}
				onChange={onChangeLS}
				disabled={disabled}
				inputSize="small"
			/>
		</FieldWrapper>
	);
};
