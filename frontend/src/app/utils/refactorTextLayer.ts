import type { Color, Layer } from "ag-psd";
import { getRgb } from "./getRgb";
import { rgbToHex } from "./rgbToHex";
import { FONT_WEIGHT } from "../const/font-weight";
import type { TextLayerData } from "../view/generator/hooks/useCreateText";

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
