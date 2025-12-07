import { useCallback } from "react";
import { useDispatch } from "react-redux";
import Konva from "konva";

import { v4 as uuidv4 } from "uuid";
import { setNewTextObject } from "../../../store/slices/generator";




export interface TextLayerData {
	type: "text";
	locked: boolean;
	display: boolean;
	value: {
		text: string;
		size: { width: number; height: number };
		typography: {
			align: string;
			fontFamily: string;
			fontSize: number;
			fontStyle: string;
			fontWeight: { key: string; label: string; value: string };
			lineHeight: number;
			letterSpacing: number;
		};
		color: string;
		rotation: number;
		vertical: number;
		horizontal: number;
	};
}

export function useCreateText() {
	const dispatch = useDispatch();

	const addText = useCallback(
		(overrides?: TextLayerData) => {
			const windowWidth = window.innerWidth;
			const windowHeight = window.innerHeight;
			const stage = Konva.stages.find((s) => s.container().id === "stage");
			if (!stage) return;

			const size = {
				width: overrides?.value?.size?.width ?? 150,
				height: overrides?.value?.size?.height ?? 25,
			};

			const centerX =
				Math.floor(windowWidth / 2 - stage.x() - size.width / 2) /
				stage.scaleX();
			const centerY =
				Math.floor(windowHeight / 2 - stage.y() - size.height / 2) /
				stage.scaleX();

			const newText = {
				id: `Text-${uuidv4()}`,
				name: "Text",
				type: overrides?.type ?? "text",
				locked: overrides?.locked ?? false,
				display: overrides?.display ?? true,
				value: {
					text: overrides?.value.text ?? "Przykładowy text",
					position: {
						x: centerX,
						y: centerY,
					},
					size,
					typography: {
						align: overrides?.value?.typography?.align ?? "left",
						fontFamily: overrides?.value?.typography?.fontFamily ?? "Inter",
						fontSize: overrides?.value?.typography?.fontSize ?? 16,
						fontStyle: overrides?.value?.typography?.fontStyle ?? "normal",
						fontWeight: overrides?.value?.typography?.fontWeight ?? {
							key: "regular",
							label: "Regular",
							value: "400",
						},
						lineHeight: overrides?.value?.typography?.lineHeight ?? 1,
						letterSpacing: overrides?.value?.typography?.letterSpacing ?? 0,
					},

					color: overrides?.value?.color ?? "#000000",
					rotation: overrides?.value?.rotation ?? 0,
					vertical: overrides?.value?.vertical ?? 1,
					horizontal: overrides?.value?.horizontal ?? 1,
				},
			};

			dispatch(setNewTextObject(newText));
		},
		[dispatch]
	);

	return addText;
}
