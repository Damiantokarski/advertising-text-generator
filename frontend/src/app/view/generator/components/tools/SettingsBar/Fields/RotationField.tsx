import type { ChangeEvent } from "react";
import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Icon } from "../../../../../../ui/Icon";
import { Input } from "../../../../../../ui/Input/Input";
import { useUpdateText } from "../../../../hooks/useActiveCanvas";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../../store/store";

export const RotationField = () => {
	const { value, updateValue, disabled } = useUpdateText();
	const rotation = value?.rotation ?? 0;
	const horizontal = value?.horizontal ?? 1;
	const vertical = value?.vertical ?? 1;

	const selectedElements = useSelector(
		(state: RootState) => state.generator.selectedElements
	);

	const onChangeRotation = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) >= 360) {
			updateValue({
				rotation: parseFloat((Number(e.target.value) - 360).toFixed(2)),
			});
		} else if (Number(e.target.value) < 0) {
			updateValue({
				rotation: 360 + Number(e.target.value),
			});
		} else {
			updateValue({
				rotation: Number(e.target.value),
			});
		}
	};

	const onRightRotate = () => {
		if (rotation >= 270) {
			updateValue({
				rotation: rotation - 360 + 90,
			});
		} else {
			updateValue({
				rotation: rotation + 90,
			});
		}
	};

	const onHorizontal = () =>
		updateValue({
			horizontal: horizontal * -1,
		});

	const onVertical = () =>
		updateValue({
			vertical: vertical * -1,
		});

	return (
		<FieldWrapper title="Rotation" className="flex gap-3">
			<Input
				type="number"
				value={rotation}
				inputPrefix={<Icon type="angle" className="text-xs" />}
				onChange={onChangeRotation}
				disabled={disabled || selectedElements.length === 0}
				inputSize="small"
			/>
			<div className="w-full flex gap-1 text-xs">
				<button
					onClick={onRightRotate}
					className=" border border-primary-blue w-full flex justify-center items-center rounded-tl rounded-bl cursor-pointer hover:bg-primary-blue-sky/20 transition-colors disabled:border-gray-200 disabled:text-gray-200"
					disabled={disabled || selectedElements.length === 0}
				>
					<Icon type="rotate" className="text-xs" />
				</button>
				<button
					onClick={onHorizontal}
					className=" border border-primary-blue w-full flex justify-center items-center cursor-pointer hover:bg-primary-blue-sky/20 transition-colors disabled:border-gray-200 disabled:text-gray-200"
					disabled={disabled || selectedElements.length === 0}
				>
					<Icon type="flipHorizontal" className="text-xs" />
				</button>
				<button
					onClick={onVertical}
					className=" border border-primary-blue w-full flex justify-center items-center rounded-tr rounded-br cursor-pointer hover:bg-primary-blue-sky/20 transition-colors disabled:border-gray-200 disabled:text-gray-200"
					disabled={disabled || selectedElements.length === 0}
				>
					<Icon type="flipVertical" className="text-xs" />
				</button>
			</div>
		</FieldWrapper>
	);
};
