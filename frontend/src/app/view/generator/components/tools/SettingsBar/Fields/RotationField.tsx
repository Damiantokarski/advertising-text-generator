import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Icon } from "../../../../../../ui/Icon";
import { Input } from "../../../../../../ui/Input/Input";
import { useUpdateText } from "../../../../hooks/useActiveCanvas";

export const RotationField = () => {
	const { value, updateValue, disabled } = useUpdateText();
	const rotation = value?.rotation ?? 0;
	const horizontal = value?.horizontal ?? 1;
	const vertical = value?.vertical ?? 1;

	const onChangeRotation = (e: React.ChangeEvent<HTMLInputElement>) => {
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
				inputPrefix={<Icon type="angle" />}
				onChange={onChangeRotation}
				disabled={disabled}
				inputSize="small"
			/>
			<div className="w-full flex gap-1 text-xs">
				<button
					onClick={onRightRotate}
					className=" border border-primary-blue w-full flex justify-center items-center rounded-tl rounded-bl cursor-pointer hover:bg-primary-blue-sky/20 transition-colors"
				>
					<Icon type="rotate" className="text-sm" />
				</button>
				<button
					onClick={onHorizontal}
					className=" border border-primary-blue w-full flex justify-center items-center cursor-pointer hover:bg-primary-blue-sky/20 transition-colors"
				>
					<Icon type="flipHorizontal" className="text-sm" />
				</button>
				<button
					onClick={onVertical}
					className=" border border-primary-blue w-full flex justify-center items-center rounded-tr rounded-br cursor-pointer hover:bg-primary-blue-sky/20 transition-colors"
				>
					<Icon type="flipVertical" className="text-sm" />
				</button>
			</div>
		</FieldWrapper>
	);
};
