import type { Layer } from "ag-psd";

export const parseArtboardSize = (layer: Layer) => {
	if (!layer.artboard) return null;
	const { left, top, right, bottom } = layer.artboard.rect;
	return { width: right - left, height: bottom - top };
};
