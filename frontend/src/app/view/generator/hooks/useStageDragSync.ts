import { useCallback, useRef } from "react";
import Konva from "konva";
import { useDispatch } from "react-redux";
import { setStagePosition } from "../../../store/slices/generator";
import type { AppDispatch } from "../../../store/store";

export const useStageDragSync = (
	stageRef: React.RefObject<Konva.Stage | null>
) => {
	const dispatch = useDispatch<AppDispatch>();
	const dragTimerRef = useRef<number | null>(null);

	const stageDragEnd = useCallback(() => {
		const pos = stageRef.current?.position();
		if (pos) dispatch(setStagePosition({ x: pos.x, y: pos.y }));
	}, [dispatch, stageRef]);

	const stageDragMove = useCallback(() => {
		if (dragTimerRef.current) window.clearTimeout(dragTimerRef.current);
		dragTimerRef.current = window.setTimeout(() => {
			const pos = stageRef.current?.position();
			if (pos) dispatch(setStagePosition({ x: pos.x, y: pos.y }));
			dragTimerRef.current = null;
		}, 200);
	}, [dispatch, stageRef]);

	return { stageDragMove, stageDragEnd };
};
