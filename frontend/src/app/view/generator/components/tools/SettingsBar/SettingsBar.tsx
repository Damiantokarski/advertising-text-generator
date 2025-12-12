import type { RootState } from "../../../../../store/store";
import { useSelector } from "react-redux";
import { useMemo, type RefObject } from "react";
import { TemplateScaleField } from "./Fields/TemplateScaleField";
import { SizeField } from "./Fields/SizeField";
import { PositionField } from "./Fields/PositionField";
import { RotationField } from "./Fields/RotationField";
import { SpaceField } from "./Fields/SpaceField";
import { AlignField } from "./Fields/AlignField";
import { ColorField } from "./Fields/ColorField";
import { TextField } from "./Fields/TextField";
import { FontFields } from "./Fields/FontFields";
import { TemplateSizeField } from "./Fields/TemplateSizeField";
import { TemplateNameField } from "./Fields/TemplateNameField";
import { ExportField } from "./Fields/ExportField";
import Konva from "konva";
import { FieldWrapper } from "../../../../../ui/FieldWrapper";

interface SettingsBarProps {
	stageRef: RefObject<Konva.Stage | null>;

	isOpen?: boolean;
}

export const SettingsBar = ({
	stageRef,

	isOpen,
}: SettingsBarProps) => {
	const selectedElement = useSelector(
		(state: RootState) => state.generator.selectedElements
	);

	const isMixed = useMemo(
		() =>
			selectedElement.length > 1 &&
			new Set(
				selectedElement.map((id) => (id.includes("Template") ? "Template" : "Text"))
			).size > 1,
		[selectedElement]
	);

	const isTemplate = useMemo(
		() => selectedElement[0]?.includes("Template"),
		[selectedElement]
	);
	const isText = useMemo(
		() => selectedElement[0]?.includes("Text"),
		[selectedElement]
	);

	return (
		<FieldWrapper
			wrapperClass={`fixed z-30  top-0 shadow w-2xs px-8 py-7 flex flex-col bg-surface m-4 rounded-sm h-[calc(100vh-32px)] transition-all ${isOpen ? "right-0" : "-right-66"}`}
		>
			{isMixed && (
				<>
					<TemplateNameField />
					<TemplateScaleField />
					<TemplateSizeField />
					<br />
					<TextField />
					<SizeField />
					<PositionField />
					<RotationField />
					<FontFields />
					<SpaceField />
					<AlignField />
					<ColorField />
					<ExportField stageRef={stageRef} />
				</>
			)}
			{isTemplate && !isMixed && (
				<>
					<TemplateNameField />
					<TemplateScaleField />
					<TemplateSizeField />
				</>
			)}

			{isText && !isMixed && (
				<>
					<TextField />
					<SizeField />
					<PositionField />
					<RotationField />
					<FontFields />
					<SpaceField />
					<AlignField />
					<ColorField />
					<ExportField stageRef={stageRef} />
				</>
			)}
		</FieldWrapper>
	);
};
