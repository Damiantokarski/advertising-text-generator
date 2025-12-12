import Konva from "konva";
import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "../../../store/store";
import { setProjectScale } from "../../../store/slices/generator";

export const useWheelZoom = (stageRef: React.RefObject<Konva.Stage | null>) => {
	const dispatch = useDispatch();
	const stageScale = useSelector((state: RootState) => state.generator.scale);

	const timerRef = useRef<number | null>(null);

	useEffect(() => {
		const stage = stageRef.current;
		if (!stage) return;

		stage.scale({ x: stageScale, y: stageScale });
		stage.batchDraw();

		const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
			e.evt.preventDefault();
			const pointer = stage.getPointerPosition();
			if (!pointer) return;

			const oldScale = stage.scaleX();
			const step = 0.1;
			let newScale = e.evt.deltaY < 0 ? oldScale + step : oldScale - step;
			newScale = Math.max(0.1, Math.min(newScale, 10));

			const mousePointTo = {
				x: (pointer.x - stage.x()) / oldScale,
				y: (pointer.y - stage.y()) / oldScale,
			};

			stage.scale({ x: newScale, y: newScale });

			const newPos = {
				x: pointer.x - mousePointTo.x * newScale,
				y: pointer.y - mousePointTo.y * newScale,
			};

			stage.position(newPos);
			stage.batchDraw();

			if (timerRef.current) window.clearTimeout(timerRef.current);
			timerRef.current = window.setTimeout(() => {
				dispatch(setProjectScale(newScale));
				timerRef.current = null;
			}, 50);
		};

		stage.on("wheel", handleWheel);
		return () => {
			if (timerRef.current) {
				window.clearTimeout(timerRef.current);
				timerRef.current = null;
			}
			stage.off("wheel");
		};
	}, [stageRef, dispatch, stageScale]);

	const setStageScale = useCallback(
		(scale: number, center?: { x: number; y: number }) => {
			const stage = stageRef.current;
			const newScale = Math.max(0.1, Math.min(scale, 10));
			dispatch(setProjectScale(newScale));

			if (!stage) return;

			const oldScale = stage.scaleX();
			const centerPoint = center ?? {
				x: stage.width() / 2,
				y: stage.height() / 2,
			};

			const mousePointTo = {
				x: (centerPoint.x - stage.x()) / oldScale,
				y: (centerPoint.y - stage.y()) / oldScale,
			};

			stage.scale({ x: newScale, y: newScale });

			const newPos = {
				x: centerPoint.x - mousePointTo.x * newScale,
				y: centerPoint.y - mousePointTo.y * newScale,
			};

			stage.position(newPos);
			stage.batchDraw();
		},
		[stageRef, dispatch]
	);

	const getScale = useCallback(() => stageScale, [stageScale]);

	return {
		stageScale,
		setStageScale,
		getScale,
	};
};
