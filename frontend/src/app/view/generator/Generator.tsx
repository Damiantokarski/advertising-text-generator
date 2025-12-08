import { useCallback, useEffect, useMemo, useRef } from "react";
import { useWindowSize } from "./hooks/useWindowSize";
import { Stage, Layer } from "react-konva";
import Konva from "konva";
import { ActionBar } from "./components/tools/ActionBar/ActionBar";
import { useWheelZoom } from "./hooks/useWeelZoom";
import { SettingsBar } from "./components/tools/SettingsBar/SettingsBar";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { TextCanva } from "./components/canvas/TextCanva";
import { TemplateCanva } from "./components/canvas/TemplateCanva";
import {
	moveCanvas,
	setActiveElement,
	setStagePosition,
} from "../../store/slices/generator";
import { ItemsBar } from "./components/tools/ItemsBar/ItemsBar";
import { useParams } from "react-router-dom";
import { useOnLoadProject } from "./hooks/useOnLoadProject";

export const Generator = () => {
	const stageRef = useRef<Konva.Stage | null>(null);
	const dragTimerRef = useRef<number | null>(null);
	const { width, height } = useWindowSize();
	const { stageScale, setStageScale } = useWheelZoom(stageRef);
	const dispatch = useDispatch();
	const { projectId } = useParams<{ projectId: string }>();
	const { projectJob, projectTitle } = useOnLoadProject(projectId || "");

	const activeElementId = useSelector(
		(state: RootState) => state.generator.activeElement
	);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!activeElementId) return;

			let dx = 0;
			let dy = 0;
			const step = e.shiftKey ? 10 : 1;

			switch (e.key) {
				case "ArrowUp":
					dy = -step;
					break;
				case "ArrowDown":
					dy = step;
					break;
				case "ArrowLeft":
					dx = -step;
					break;
				case "ArrowRight":
					dx = step;
					break;
				default:
					return;
			}

			e.preventDefault(); // żeby strona się nie przewijała
			dispatch(moveCanvas({ id: activeElementId, dx, dy }));
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [activeElementId, dispatch]);

	const texts = useSelector(
		(state: RootState) => state.generator.texts,
		shallowEqual
	);
	const templates = useSelector(
		(state: RootState) => state.generator.templates,
		shallowEqual
	);
	const position = useSelector(
		(state: RootState) => state.generator.stagePosition,
		shallowEqual
	);

	const stageDragEnd = useCallback(() => {
		const pos = stageRef.current?.position();
		if (pos) dispatch(setStagePosition({ x: pos.x, y: pos.y }));
	}, [dispatch]);

	const stageDragMove = useCallback(() => {
		if (dragTimerRef.current) window.clearTimeout(dragTimerRef.current);
		dragTimerRef.current = window.setTimeout(() => {
			const pos = stageRef.current?.position();
			if (pos) dispatch(setStagePosition({ x: pos.x, y: pos.y }));
			dragTimerRef.current = null;
		}, 200);
	}, [dispatch]);

	const stageMouseDown = useCallback(
		(e: Konva.KonvaEventObject<MouseEvent>) => {
			if (e.target === e.target.getStage()) {
				dispatch(setActiveElement(""));
			}
		},
		[dispatch]
	);
	
	// generowanie elementów na canvasie
	const templateCanvas = useMemo(
		() =>
			templates.map((template) => (
				<TemplateCanva id={template.id} key={template.id} templateObj={template} />
			)),
		[templates]
	);

	const textCanvas = useMemo(
		() =>
			texts.map((text) => (
				<TextCanva id={text.id} key={text.id} textObj={text} stageRef={stageRef} />
			)),
		[texts]
	);

	return (
		<div
			className="workspace-canvas"
			style={{ position: "relative", width: "100%", height: "100%" }}
		>
			<Stage
				id="stage"
				width={width}
				height={height}
				ref={stageRef}
				draggable
				scaleX={stageScale}
				scaleY={stageScale}
				x={position.x}
				y={position.y}
				onDragMove={stageDragMove}
				onDragEnd={stageDragEnd}
				onMouseDown={stageMouseDown}
			>
				<Layer id="layer">
					{templateCanvas}
					{textCanvas}
				</Layer>
			</Stage>
			<div>
				<SettingsBar />
				<ActionBar scale={stageScale} onChange={setStageScale} />
			</div>
			<ItemsBar title={projectId ? `${projectJob} ${projectTitle}` : ""} />
		</div>
	);
};
