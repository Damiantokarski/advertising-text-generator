import { useCallback } from "react";
import { useDispatch } from "react-redux";
import Konva from "konva";

import { v4 as uuidv4 } from "uuid";
import { setNewTemplateObject } from "../../../store/slices/generator";
import type { TemplateLayerData } from "../components/tools/ActionBar/NewTemplate/NewTemplateForm";

export function useCreateTemplate() {
	const dispatch = useDispatch();

	const createTemplate = useCallback(
		(template: TemplateLayerData) => {
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;
			const stage = Konva.stages.find((s) => s.container().id === "stage");

			if (!stage) return;

			const centerX =
				Math.floor(windowWidth / 2 + -stage.x() + 40) / stage.scaleX() -
				template.width / 2;
			const centerY =
				Math.floor(windowHeight / 2 + -stage.y()) / stage.scaleX() -
				template.height / 2;

			const newTemplate = {
				id: `Template-${uuidv4()}`,
				type: "template",
				locked: false,
				display: true,
				value: {
					scale: 1,
					name: template.name,
					position: { x: centerX, y: centerY },
					size: { width: template.width, height: template.height },
				},
			};

			dispatch(setNewTemplateObject(newTemplate));
		},
		[dispatch]
	);

	return createTemplate;
}
