import { useCallback, useRef } from "react";
import Konva from "konva";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import {
	updateTextContainerSize,
	updateTextRotation,
} from "../../../store/slices/generator";

export const useTextTransformHandlers = (
	id: string,
	textRef: React.RefObject<Konva.Text | null>
) => {
	const dispatch = useDispatch<AppDispatch>();

	const sizeRef = useRef({
		width: 0,
		height: 0,
	});

	const handleTransform = useCallback(() => {
		const node = textRef.current;
		if (!node) return;

		const scaleX = node.scaleX();
		const scaleY = node.scaleY();

		const newWidth = Math.max(20, node.width() * scaleX);
		const newHeight = Math.max(20, node.height() * scaleY);

		node.width(newWidth);
		node.height(newHeight);
		node.scale({ x: 1, y: 1 });

		sizeRef.current = { width: newWidth, height: newHeight };
		node.getLayer()?.batchDraw();
	}, [textRef]);

	const handleTransformEnd = useCallback(() => {
		const node = textRef.current;
		if (!node) return;

		dispatch(updateTextContainerSize({ id, ...sizeRef.current }));
		dispatch(updateTextRotation({ id, rotation: node.rotation() }));
	}, [dispatch, id, textRef]);

	return { handleTransform, handleTransformEnd };
};
