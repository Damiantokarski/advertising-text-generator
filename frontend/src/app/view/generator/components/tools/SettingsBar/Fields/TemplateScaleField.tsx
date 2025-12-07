import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Select } from "../../../../../../ui/Select/Select";
import { useUpdateTemplate } from "../../../../hooks/useActiveCanvas";

const scales = [
	{ key: "1-xs", label: "0.5x", value: 0.5 },
	{ key: "2-sm", label: "0.75x", value: 0.75 },
	{ key: "3-base", label: "1x", value: 1 },
	{ key: "4-md", label: "1.5x", value: 1.5 },
	{ key: "5-lg", label: "2x", value: 2 },
	{ key: "6-xl", label: "3x", value: 3 },
	{ key: "7-2xl", label: "4x", value: 4 },
	{ key: "8-3xl", label: "5x", value: 5 },
];

export const TemplateScaleField = () => {
	const { value, updateValue, disabled } = useUpdateTemplate();

	const currentScaleValue = value?.scale || 1;

	const selectedLabel = scales.find(
		(scale) => scale.value === currentScaleValue
	)?.label;

	const optionsList = scales.map((scale) => scale.label);

	const handleChange = (selectedLabel: string) => {
		const selectedScale = scales.find((scale) => scale.label === selectedLabel);
		if (!selectedScale) return;

		updateValue({ scale: selectedScale.value });
	};

	return (
		<FieldWrapper title="Scale" className="flex flex-col gap-4 items-center">
			<Select
				optionsList={optionsList}
				defaultValue={selectedLabel}
				onChange={handleChange}
				disabled={disabled}
				small
			/>
		</FieldWrapper>
	);
};
