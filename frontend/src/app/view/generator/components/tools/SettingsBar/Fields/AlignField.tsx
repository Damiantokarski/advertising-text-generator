import { useCallback } from "react";
import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Icon } from "../../../../../../ui/Icon";
import { useUpdateText } from "../../../../hooks/useActiveCanvas";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../../../store/store";

const ALIGN_OPTIONS = [
	{ icon: "textLeft", value: "left" },
	{ icon: "textCenter", value: "center" },
	{ icon: "textJustify", value: "justify" },
	{ icon: "textRight", value: "right" },
];

export const AlignField = () => {
	const { value, updateValue, disabled } = useUpdateText();
	const current = value?.typography.align ?? "";
	const selectedElements = useSelector(
		(state: RootState) => state.generator.selectedElements
	);
	const onSelect = useCallback(
		(align: string) => {
			updateValue({ typography: { ...value!.typography, align } });
		},
		[updateValue, value]
	);

	return (
		<FieldWrapper title="Align">
			<ul className="flex gap-2">
				{ALIGN_OPTIONS.map(({ icon, value }) => (
					<li key={value}>
						<button
							className={`p-1.5 rounded-xs  border border-primary-blue-sky cursor-pointer transition-colors disabled:border-gray-200 disabled:text-gray-200 ${current === value ? "bg-primary-blue-sky text-surface" : " hover:bg-primary-blue-sky/20 bg-surface"}`}
							onClick={() => onSelect(value)}
							disabled={disabled || selectedElements.length === 0}
						>
							<Icon type={icon} />
						</button>
					</li>
				))}
			</ul>
		</FieldWrapper>
	);
};
