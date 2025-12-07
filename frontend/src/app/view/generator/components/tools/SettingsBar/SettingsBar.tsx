import type { RootState } from "../../../../../store/store";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { TemplateScaleField } from "./Fields/TemplateScaleField";
import { SizeField } from "./Fields/SizeField";
import { PositionField } from "./Fields/PositionField";
import { RotationField } from "./Fields/RotationField";
import { SpaceField } from "./Fields/SpaceField";
import { AlignField } from "./Fields/AlignField";
import { ColorField } from "./Fields/ColorField";
import { TextField } from "./Fields/TextField";
import { FontFields } from "./Fields/FontFields";

export const SettingsBar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const activeElement = useSelector(
		(state: RootState) => state.generator.activeElement
	);

	const isTemplate = useMemo(
		() => activeElement?.includes("Template"),
		[activeElement]
	);
	const isText = useMemo(() => activeElement?.includes("Text"), [activeElement]);

	useEffect(() => {
		if (isText || isTemplate) setIsOpen(true);
		else setIsOpen(false);
	}, [isText, isTemplate]);

	return (
		<section
			id="properties-panel"
			className={`fixed top-0 w-2xs bg-secondary-black shadow p-8 space-y-4 z-10 overflow-auto hidden-scrollbar transition-all bg-surface m-4 h-[calc(100vh-32px)] rounded-lg border-2 border-primary-blue-sky
         ${isOpen ? "right-0" : "-right-76"} `}
		>
			{isTemplate && <TemplateScaleField />}

			{isText && (
				<>
					<TextField />
					<SizeField />
					<PositionField />
					<RotationField />
					<SpaceField />
					<AlignField />
					<ColorField />
					<FontFields/>
          {/* EXPORT */}
         
				</>
			)}
		</section>
	);
};
