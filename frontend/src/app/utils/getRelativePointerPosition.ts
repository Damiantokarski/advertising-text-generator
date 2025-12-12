import Konva from "konva";

export const getRelativePointerPosition = (stage: Konva.Stage | null) => {
	if (!stage) return null;
	const pointer = stage.getPointerPosition();
	if (!pointer) return null;

	const scale = stage.scaleX();
	const stagePos = stage.position();

	return {
		x: (pointer.x - stagePos.x) / scale,
		y: (pointer.y - stagePos.y) / scale,
	};
};
