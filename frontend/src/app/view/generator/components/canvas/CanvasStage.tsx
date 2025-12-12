import { Stage, Layer, Rect } from "react-konva";
import Konva from "konva";
import { useMemo } from "react";
import { TextCanva } from "./TextCanva";
import { TemplateCanva } from "./TemplateCanva";
import type { Template, Text } from "../../../../store/slices/generator";

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
	const templateCanvas = useMemo(
		() =>
			templates.map((template) => (
				<TemplateCanva key={template.id} templateObj={template} stageRef={stageRef} />
			)),
		[templates, stageRef]
	);

	const textCanvas = useMemo(
		() =>
			texts.map((text) => (
				<TextCanva key={text.id} textObj={text} stageRef={stageRef} />
			)),
		[texts, stageRef]
	);

	return (
		<Stage
			id="stage"
			width={width}
			height={height}
			ref={stageRef}
			draggable={!isSelecting}
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
