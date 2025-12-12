import type { RootState } from "../../../../../store/store";
import { useSelector } from "react-redux";
import {
	useMemo,
	type Dispatch,
	type RefObject,
	type SetStateAction,
} from "react";
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
import { Icon } from "../../../../../ui/Icon";

interface SettingsBarProps {
	stageRef: RefObject<Konva.Stage | null>;
	setBarsState: Dispatch<
		SetStateAction<{
			isSettingsBarOpen: boolean;
			isItemsBarOpen: boolean;
		}>
	>;
	isOpen?: boolean;
}

export const SettingsBar = ({
	stageRef,
	setBarsState,
	isOpen,
}: SettingsBarProps) => {
	const selectedElement = useSelector(
		(state: RootState) => state.generator.selectedElements[0]
	);

	const isTemplate = useMemo(
		() => selectedElement?.includes("Template"),
		[selectedElement]
	);
	const isText = useMemo(
		() => selectedElement?.includes("Text"),
		[selectedElement]
	);

	const handleSettingBarToggle = () => {
		setBarsState((prev) => ({
			...prev,
			isSettingsBarOpen: !prev.isSettingsBarOpen,
		}));
	};

	return (
		<FieldWrapper
			wrapperClass={`fixed z-30  top-0 shadow w-2xs px-8 py-7 flex flex-col bg-surface m-4 rounded-sm h-[calc(100vh-32px)] transition-all ${isOpen ? "right-0" : "-right-66"}`}
		>
			<button
				className={`absolute top-3 left-3 cursor-pointer transition-transform ${isOpen ? "" : "rotate-180"}`}
				disabled={!isTemplate && !isText}
				onClick={handleSettingBarToggle}
			>
				<Icon type="arrowRight" />
			</button>
			{isTemplate && (
				<>
					<TemplateNameField />
					<TemplateScaleField />
					<TemplateSizeField />
				</>
			)}

			{isText && (
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
