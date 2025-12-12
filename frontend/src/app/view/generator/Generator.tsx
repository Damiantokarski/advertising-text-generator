import { useEffect, useRef, useState } from "react";
import Konva from "konva";
import { shallowEqual, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useWindowSize } from "./hooks/useWindowSize";
import { useWheelZoom } from "./hooks/useWeelZoom";
import { useParams } from "react-router-dom";
import { useOnLoadProject } from "./hooks/useOnLoadProject";
import { SettingsBar } from "./components/tools/SettingsBar/SettingsBar";
import { ActionBar } from "./components/tools/ActionBar/ActionBar";
import { ItemsBar } from "./components/tools/ItemsBar/ItemsBar";

import { useStageDragSync } from "./hooks/useStageDragSync";
import { useStageSelection } from "./hooks/useStageSelection";
import { useStageKeyboard } from "./hooks/useStageKeyboard";
import { CanvasStage } from "./components/canvas/CanvasStage";

export const Generator = () => {
	const stageRef = useRef<Konva.Stage | null>(null);
	const { id } = useParams<{ id: string }>();
	const { width, height } = useWindowSize();
	const { stageScale, setStageScale } = useWheelZoom(stageRef);
	const { projectJob, projectTitle } = useOnLoadProject(id || "");

	const [barsState, setBarsState] = useState({
		isSettingsBarOpen: false,
		isItemsBarOpen: false,
	});

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
	const selectedElements = useSelector(
		(state: RootState) => state.generator.selectedElements
	);

	useStageKeyboard(selectedElements[0], id || "");

	const { stageDragMove, stageDragEnd } = useStageDragSync(stageRef);

	const {
		isSelecting,
		selectionRect,
		stageMouseDown,
		stageMouseMove,
		stageMouseUp,
	} = useStageSelection(stageRef);

	useEffect(() => {
		if (selectedElements.length > 0) {
			setBarsState((prev) => ({ ...prev, isSettingsBarOpen: true }));
		} else {
			setBarsState((prev) => ({ ...prev, isSettingsBarOpen: false }));
		}
	}, [selectedElements.length]);

	return (
		<div
			className="workspace-canvas overflow-hidden"
			style={{ position: "relative", width: "100%", height: "100%" }}
		>
			<CanvasStage
				stageRef={stageRef}
				width={width}
				height={height}
				scale={stageScale}
				position={position}
				isSelecting={isSelecting}
				selectionRect={selectionRect}
				texts={texts}
				templates={templates}
				onMouseDown={stageMouseDown}
				onMouseMove={stageMouseMove}
				onMouseUp={stageMouseUp}
				onDragMove={stageDragMove}
				onDragEnd={stageDragEnd}
			/>

			<div>
				<SettingsBar stageRef={stageRef} isOpen={barsState.isSettingsBarOpen} />
				<ActionBar
					scale={stageScale}
					onChange={setStageScale}
					barsState={barsState}
				/>
			</div>

			<ItemsBar
				title={id ? `${projectJob} ${projectTitle}` : ""}
				setBarsState={setBarsState}
				isOpen={barsState.isItemsBarOpen}
			/>
		</div>
	);
};
