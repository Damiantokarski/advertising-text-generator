import { useCallback, useEffect, useState } from "react";
import Konva from "konva";
import type { Text } from "../../../store/slices/generator";

export function useTextEditing(
	textObj: Text,
	textNode: Konva.Text | null,
	stageNode: Konva.Stage | null
) {
	const [isEditing, setIsEditing] = useState(false);

	const finishEditing = useCallback(() => {
		setIsEditing(false);
		textNode?.show();
		stageNode?.batchDraw();
	}, [textNode, stageNode]);

	const handleDblClick = useCallback(() => {
		if (isEditing || textObj.locked || !textNode) return;
		textNode.hide();
		setIsEditing(true);
	}, [isEditing, textObj.locked, textNode]);

	useEffect(() => {
		if (!stageNode) return;
		const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
			e.evt.preventDefault();
			finishEditing();
		};
		stageNode.on("wheel", handleWheel);
		return () => {
			stageNode.off("wheel", handleWheel);
		};
	}, [stageNode, finishEditing]);

	return { isEditing, setIsEditing, finishEditing, handleDblClick };
}
