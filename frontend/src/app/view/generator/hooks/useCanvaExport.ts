import { useCallback, type RefObject } from "react";
import { useSelector } from "react-redux";
import Konva from "konva";
import type { RootState } from "../../../store/store";

interface ExportOptions {
	name: string;
	format: string;
	scale: number;
}

export const useCanvaExport = (stageRef: RefObject<Konva.Stage | null>) => {
	const selectedElements = useSelector(
		(state: RootState) => state.generator.selectedElements
	) as string[];

	const exportSelection = useCallback(
		({ name, format, scale }: ExportOptions) => {
			const stage = stageRef.current;
			if (!stage) return;

			// 1. Schowaj wszystkie Transformery
			const transformers = stage.find(
				(node: Konva.Node): node is Konva.Transformer =>
					node.getClassName() === "Transformer"
			);
			const prevTransformerVisibility = new Map<Konva.Node, boolean>();

			transformers.forEach((tr) => {
				prevTransformerVisibility.set(tr, tr.visible());
				tr.visible(false);
			});

			if (!selectedElements.length) {
				// nic nie eksportujemy -> przywróć transformery i wyjdź
				transformers.forEach((tr) => {
					const prev = prevTransformerVisibility.get(tr);
					if (prev !== undefined) tr.visible(prev);
				});
				stage.batchDraw();
				return;
			}

			const exportableIds = selectedElements.filter(
				(id) => !id.startsWith("Template")
			);

			const selectedIds = new Set(exportableIds);

			// 2. Tylko Group (name="selectable", id = element id)
			const selectedGroups = stage.find(
				(node: Konva.Node) =>
					selectedIds.has(node.id()) && node.getClassName() === "Group"
			) as Konva.Group[];

			if (!selectedGroups.length) {
				transformers.forEach((tr) => {
					const prev = prevTransformerVisibility.get(tr);
					if (prev !== undefined) tr.visible(prev);
				});
				stage.batchDraw();
				return;
			}

			let minX = Infinity;
			let minY = Infinity;
			let maxX = -Infinity;
			let maxY = -Infinity;

			selectedGroups.forEach((group) => {
				const rect = group.getClientRect(); // absolutne współrzędne na canvasie

				minX = Math.min(minX, rect.x);
				minY = Math.min(minY, rect.y);
				maxX = Math.max(maxX, rect.x + rect.width);
				maxY = Math.max(maxY, rect.y + rect.height);
			});

			if (
				!isFinite(minX) ||
				!isFinite(minY) ||
				!isFinite(maxX) ||
				!isFinite(maxY)
			) {
				console.warn("Invalid bounding box", { minX, minY, maxX, maxY });

				transformers.forEach((tr) => {
					const prev = prevTransformerVisibility.get(tr);
					if (prev !== undefined) tr.visible(prev);
				});
				stage.batchDraw();
				return;
			}

			const padding = 10;

			const exportX = minX - padding;
			const exportY = minY - padding;
			const exportWidth = maxX - minX + padding * 2;
			const exportHeight = maxY - minY + padding * 2;

			// 3. Ukryj nie-zaznaczone elementy
			const allSelectable = stage.find(
				(node: Konva.Node) => node.name() === "selectable"
			) as Konva.Group[];

			const prevVisibility = new Map<string, boolean>();

			allSelectable.forEach((node) => {
				prevVisibility.set(node.id(), node.visible());
				if (!selectedIds.has(node.id())) {
					node.visible(false);
				}
			});

			const isJpeg = format === "jpeg";
			let bgRect: Konva.Rect | null = null;

			// 4. Dla JPG dokładamy białe tło
			if (isJpeg) {
				const layers = stage.getLayers();
				const bgLayer = layers[0];

				bgRect = new Konva.Rect({
					x: exportX,
					y: exportY,
					width: exportWidth,
					height: exportHeight,
					fill: "#ffffff",
					listening: false,
				});

				bgLayer.add(bgRect);
				bgRect.moveToBottom();
			}

			stage.draw();

			const dataUrl = stage.toDataURL({
				x: exportX,
				y: exportY,
				width: exportWidth,
				height: exportHeight,
				pixelRatio: scale,
				mimeType: isJpeg ? "image/jpeg" : "image/png",
			});

			// 5. Przywróć widoczność selectable
			allSelectable.forEach((node) => {
				const prev = prevVisibility.get(node.id());
				if (prev !== undefined) node.visible(prev);
			});

			// 6. Przywróć Transformery
			transformers.forEach((tr) => {
				const prev = prevTransformerVisibility.get(tr);
				if (prev !== undefined) tr.visible(prev);
			});

			// 7. Usuń tymczasowe tło
			if (bgRect) {
				bgRect.destroy();
			}

			stage.batchDraw();

			// 8. Pobierz plik
			const link = document.createElement("a");
			link.download = `${name || "export"}.${format}`;
			link.href = dataUrl;
			link.click();
		},
		[stageRef, selectedElements]
	);

	return {
		exportSelection,
		hasSelection: selectedElements.length > 0,
		selectedElements,
	};
};
