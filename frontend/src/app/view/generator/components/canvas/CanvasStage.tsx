import { Stage, Layer, Rect } from "react-konva";
import Konva from "konva";
import { useMemo, useRef, useState } from "react";
import { TextCanva } from "./TextCanva";
import { TemplateCanva } from "./TemplateCanva";
import {
	moveSelectedElements,
	type Template,
	type Text,
} from "../../../../store/slices/generator";
import { getSelectionBBoxFromStage } from "../../../../utils/getBBox";
import type { RootState } from "../../../../store/store";
import { useDispatch, useSelector } from "react-redux";

type SelectionRect = {
	x: number;
	y: number;
	width: number;
	height: number;
	visible: boolean;
};

interface CanvasStageProps {
	stageRef: React.RefObject<Konva.Stage | null>;
	width: number;
	height: number;
	scale: number;
	position: { x: number; y: number };
	isSelecting: boolean;
	selectionRect: SelectionRect;
	texts: Text[];
	templates: Template[];
	onMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void;
	onMouseMove: (e: Konva.KonvaEventObject<MouseEvent>) => void;
	onMouseUp: (e: Konva.KonvaEventObject<MouseEvent>) => void;
	onDragMove: () => void;
	onDragEnd: () => void;
}

export const CanvasStage = ({
	stageRef,
	width,
	height,
	scale,
	position,
	isSelecting,
	selectionRect,
	texts,
	templates,
	onMouseDown,
	onMouseMove,
	onMouseUp,
	onDragMove,
	onDragEnd,
}: CanvasStageProps) => {
	const dispatch = useDispatch();
	const selectedIds = useSelector(
		(state: RootState) => state.generator.selectedElements
	);

	const [dragOffset, setDragOffset] = useState<{ dx: number; dy: number }>({
		dx: 0,
		dy: 0,
	});
	const bboxStartRef = useRef<{
		x: number;
		y: number;
		width: number;
		height: number;
	} | null>(null);
	const dragStartRef = useRef<{ x: number; y: number } | null>(null);
	const isMultiSelected = selectedIds.length > 1;

	const templateCanvas = useMemo(
		() =>
			templates.map((template) => (
				<TemplateCanva
					key={template.id}
					templateObj={template}
					stageRef={stageRef}
					dragOffset={dragOffset}
				/>
			)),
		[templates, stageRef, dragOffset]
	);

	const textCanvas = useMemo(
		() =>
			texts.map((text) => (
				<TextCanva
					key={text.id}
					textObj={text}
					stageRef={stageRef}
					dragOffset={dragOffset}
				/>
			)),
		[texts, stageRef, dragOffset]
	);
	const bbox = useMemo(() => {
		const stage = stageRef.current;
		if (!stage) return null;
		if (selectedIds.length < 2) return null;

		return getSelectionBBoxFromStage(stage, selectedIds);
	}, [selectedIds, stageRef, texts, templates]);

	const bboxForHandle = bboxStartRef.current ?? bbox;

	return (
		<Stage
			id="stage"
			width={width}
			height={height}
			ref={stageRef}
			draggable={!isSelecting && !isMultiSelected}
			scaleX={scale}
			scaleY={scale}
			x={position.x}
			y={position.y}
			onDragMove={onDragMove}
			onDragEnd={onDragEnd}
			onMouseDown={onMouseDown}
			onMouseMove={onMouseMove}
			onMouseUp={onMouseUp}
		>
			<Layer id="layer">
				{templateCanvas}
				{textCanvas}
				{isMultiSelected && bboxForHandle && (
					<Rect
						x={bboxForHandle.x + dragOffset.dx}
						y={bboxForHandle.y + dragOffset.dy}
						width={bboxForHandle.width}
						height={bboxForHandle.height}
						draggable
						stroke="#68b6ef"
						strokeWidth={1}
						onDragStart={(e) => {
							e.cancelBubble = true;
							bboxStartRef.current = bbox;
							e.target.position({ x: bboxForHandle.x, y: bboxForHandle.y });
							dragStartRef.current = { x: bboxForHandle.x, y: bboxForHandle.y };
							setDragOffset({ dx: 0, dy: 0 });
						}}
						onDragMove={(e) => {
							e.cancelBubble = true;

							const start = dragStartRef.current;
							if (!start) return;

							setDragOffset({
								dx: e.target.x() - start.x,
								dy: e.target.y() - start.y,
							});
						}}
						onDragEnd={(e) => {
							e.cancelBubble = true;

							const start = dragStartRef.current;
							const bboxStart = bboxStartRef.current;
							if (!start || !bboxStart) return;

							const dx = e.target.x() - start.x;
							const dy = e.target.y() - start.y;

							dispatch(moveSelectedElements({ dx, dy }));

							setDragOffset({ dx: 0, dy: 0 });
							dragStartRef.current = null;
							bboxStartRef.current = null;
						}}
					/>
				)}
			</Layer>
			<Layer listening={false}>
				{selectionRect.visible && (
					<Rect
						x={selectionRect.x}
						y={selectionRect.y}
						width={selectionRect.width}
						height={selectionRect.height}
						stroke="dodgerblue"
						dash={[2, 2]}
					/>
				)}
			</Layer>
		</Stage>
	);
};
