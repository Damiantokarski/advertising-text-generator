import { readPsd, type Psd, type Layer, type Color } from "ag-psd";
import { useCallback, useState } from "react";

import { useCreateTemplate } from "./useCreateTemplate";
import { useCreateText, type TextLayerData } from "./useCreateText";
import { FONT_WEIGHT } from "../../../const/font-weight";

export const parseArtboardSize = (layer: Layer) => {
	if (!layer.artboard) return null;
	const { left, top, right, bottom } = layer.artboard.rect;
	return { width: right - left, height: bottom - top };
};

export const collectTextLayers = (layers: Layer[]): TextLayerData[] => {
	const result: TextLayerData[] = [];

	const traverse = (nodes: Layer[]) => {
		nodes.forEach((node) => {
			const data = refactorTextLayer(node);
			if (data) result.push(data);
			if (node.children) traverse(node.children);
		});
	};
	traverse(layers);
	return result;
};

export const refactorTextLayer = (layer: Layer): TextLayerData | null => {
	const text = layer.text;

	if (!text || typeof text.text !== "string") return null;

	const { style, paragraphStyle, transform } = text;

	if (
		!style ||
		!style.fillColor ||
		!style.font ||
		layer.left == null ||
		layer.right == null ||
		layer.top == null ||
		layer.bottom == null ||
		!transform ||
		!paragraphStyle?.autoLeading
	) {
		return null;
	}

	const fill = style?.fillColor as Color;
	const [left, right, top, bottom] = [
		layer.left,
		layer.right,
		layer.top,
		layer.bottom,
	];

	const [r, g, b] = getRgb(fill);
	const hex = rgbToHex(r, g, b);

	const rawSize = style!.fontSize!;
	const rawLeading = style!.leading!;
	const tracking = style!.tracking!;

	const scaleY = transform[3] < 0.01 ? 0.01 : transform[3];
	const fontSize = Math.round(rawSize * scaleY);
	const letterSpacingPx = (tracking / 1000) * fontSize;
	const leading = Math.round(rawLeading * scaleY);

	let lineHeightRatio;

	if (rawLeading <= 0 || style.autoLeading) {
		lineHeightRatio = paragraphStyle?.autoLeading;
	} else {
		lineHeightRatio = leading / fontSize;
	}

	const lineHeight = lineHeightRatio * fontSize;
	const frameHeight = Math.ceil(
		Math.ceil(Math.abs(bottom - top) / lineHeight) * Math.ceil(lineHeight)
	);
	const [family, weight] = style!.font.name.split("-");

	const fallbackWeight = Object.values(FONT_WEIGHT)[0];

	const weightObj =
		Object.values(FONT_WEIGHT).find((w) => w.label === weight) || fallbackWeight;

	return {
		type: "text",
		locked: false,
		display: true,
		value: {
			text: text.text,
			size: {
				width: Math.round(Math.abs(right - left)) + 25,
				height: Math.round(frameHeight * 1.05),
			},
			typography: {
				align: paragraphStyle?.justification || "left",
				fontFamily: family,
				fontSize: fontSize,
				fontStyle: "normal",
				fontWeight: weightObj,
				lineHeight: lineHeightRatio,
				letterSpacing: letterSpacingPx,
			},
			color: hex,
			rotation: 0,
			vertical: style.verticalScale || 100,
			horizontal: style.horizontalScale || 100,
		},
	} as TextLayerData;
};

export const getRgb = (fillColor: Color): [number, number, number] => {
	if ("r" in fillColor && "g" in fillColor && "b" in fillColor) {
		return [fillColor.r!, fillColor.g!, fillColor.b!];
	}

	if ("channels" in fillColor && Array.isArray(fillColor.channels)) {
		const [r = 0, g = 0, b = 0] = fillColor.channels;
		return [r, g, b];
	}
	return [0, 0, 0];
};

export const rgbToHex = (r: number, g: number, b: number): string => {
	const toHex = (comps: number) => {
		const v = Math.round(comps <= 1 ? comps * 255 : comps);
		const clamped = Math.max(0, Math.min(255, v));
		return clamped.toString(16).padStart(2, "0");
	};
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const checkPsdFile = (file?: File | null) => {
	if (!file) return false;
	const name = file.name.toLowerCase();
	return file.type === "image/vnd.adobe.photoshop" || name.endsWith(".psd");
};

export function usePsd() {
	const createText = useCreateText();
	const createTemplate = useCreateTemplate();

	const [size, setSize] = useState<{ width: number; height: number } | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);
	const [parsing, setParsing] = useState(false);

	const onDrop = useCallback(
		async (incoming: File[]) => {
			setError(null);
			if (!incoming || incoming.length === 0) {
				setError("Nie wybrano pliku.");
				return;
			}
			const file = incoming[0];

			if (!checkPsdFile(file)) {
				setError("Nieprawidłowy format pliku. Wymagany .psd");
				return;
			}

			try {
				setParsing(true);
				const buffer = await file.arrayBuffer();
				const psd: Psd = readPsd(new Uint8Array(buffer));

				const layers = psd.children ?? [];

				const width = psd.width;
				const height = psd.height;

				if (!width || !height) {
					setError("Brak artboardu w PSD, nie można określić rozmiaru trmplatki");
					return;
				}

				const texts = collectTextLayers(layers);
				const templateData: { width: number; height: number } = {
					width,
					height,
				};

				createTemplate({
					id: `${templateData.width}x${templateData.height}`,
					name: `${templateData.width}x${templateData.height}`,
					...templateData,
				});
				texts.forEach(createText);

				setSize(templateData);
			} catch (err) {
				console.error("Błąd parsowania PSD:", err);
				setError("Błąd parsowania PSD");
			} finally {
				setParsing(false);
			}
		},
		[createText, createTemplate]
	);

	return { onDrop, size, error, parsing };
}
