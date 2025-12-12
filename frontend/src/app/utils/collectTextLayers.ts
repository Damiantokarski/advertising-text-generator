import type { Layer } from "ag-psd";
import type { TextLayerData } from "../view/generator/hooks/useCreateText";
import { refactorTextLayer } from "./refactorTextLayer";

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
