import React, { useRef, useCallback, memo, type RefObject } from "react";
import Konva from "konva";
import { Group, Text as KonvaText, Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../store/store";
import {
	setSelectedElements,
	updateTextPosition,
	type Text,
} from "../../../../store/slices/generator";
import type { KonvaEventObject } from "konva/lib/Node";
import { TextEditor } from "./TextEditor";
import { useTextEditing } from "../../hooks/useTextEditing";
import { useTextTransformer } from "../../hooks/useTextTransformer";
import { snapLinesPosition } from "../../../../utils/snapLines";
import { useSnapElements } from "../../hooks/useSnapElements";
import { useTextTransformHandlers } from "../../hooks/useTextTransformHandlers";

interface TextCanvaProps {
	textObj: Text;
	stageRef: RefObject<Konva.Stage | null>;
	dragOffset?: { dx: number; dy: number };
}

const ANCHORS = [
	"top-left",
	"top-center",
	"top-right",
	"middle-right",
	"bottom-right",
	"bottom-center",
	"bottom-left",
	"middle-left",
];

const TextCanvaComponent = ({
	textObj,
	stageRef,
	dragOffset,
}: TextCanvaProps) => {
	const dispatch = useDispatch<AppDispatch>();

	const selectedElements = useSelector(
		(state: RootState) => state.generator.selectedElements
	);
	const isSelected = selectedElements.includes(textObj.id);
	const dx = isSelected ? (dragOffset?.dx ?? 0) : 0;
	const dy = isSelected ? (dragOffset?.dy ?? 0) : 0;

	const textRef = useRef<Konva.Text>(null);
	const groupRef = useRef<Konva.Group>(null);
	const trRef = useRef<Konva.Transformer>(null);

	const {
		value: {
			underline,
			position: { x, y },
			horizontal,
			vertical,
			rotation,
			color,
			typography,
			size,
			text,
		},
	} = textObj;

	const snapElements = useSnapElements();

	const { isEditing, finishEditing, handleDblClick } = useTextEditing(
		textObj,
		textRef.current,
		stageRef.current
	);

	useTextTransformer(textRef, trRef, isSelected, isEditing);

	const { handleTransform, handleTransformEnd } = useTextTransformHandlers(
		textObj.id,
		textRef
	);

	const handleActiveText = useCallback(() => {
		if (textObj.locked) return;
		dispatch(setSelectedElements([textObj.id]));
	}, [dispatch, textObj]);

	const handleDragEnd = useCallback(
		(e: KonvaEventObject<DragEvent>) => {
			if (textObj.locked) return;

			dispatch(
				updateTextPosition({
					id: textObj.id,
					x: e.target.x(),
					y: e.target.y(),
				})
			);
		},
		[dispatch, textObj.id, textObj.locked]
	);

	const dragBoundFunc = useCallback(
		(pos: Konva.Vector2d) => {
			const stage = stageRef.current;
			if (!stage) return pos;

			const scale = stage.scaleX() || 1;

			const stagePos = stage.position();

			const logicalPos = {
				x: (pos.x - stagePos.x) / scale,
				y: (pos.y - stagePos.y) / scale,
			};

			const snappedLogical = snapLinesPosition(
				textObj.id,
				snapElements,
				logicalPos
			);

			return {
				x: snappedLogical.x * scale + stagePos.x,
				y: snappedLogical.y * scale + stagePos.y,
			};
		},
		[snapElements, textObj.id, stageRef]
	);

	const isMultiSelected = selectedElements.length > 1;

	return (
		<>
			<Group
				id={textObj.id}
				name="selectable"
				ref={groupRef}
				x={x + dx}
				y={y + dy}
				scaleX={horizontal}
				scaleY={vertical}
				draggable={!textObj.locked && !isMultiSelected}
				visible={textObj.display}
				onClick={handleActiveText}
				onDblClick={handleDblClick}
				onDragEnd={handleDragEnd}
				dragBoundFunc={dragBoundFunc}
			>
				<KonvaText
					ref={textRef}
					text={text}
					fill={color}
					width={size.width}
					height={size.height}
					rotation={rotation}
					padding={3}
					fontSize={typography.fontSize}
					fontFamily={typography.fontFamily}
					fontStyle={typography.fontWeight.value}
					lineHeight={typography.lineHeight}
					letterSpacing={typography.letterSpacing}
					textDecoration={underline ? "underline" : ""}
					align={typography.align}
					onTransform={handleTransform}
					onTransformEnd={handleTransformEnd}
				/>

				{isEditing && (
					<TextEditor
						stageRef={stageRef}
						textObj={textObj}
						onFinish={finishEditing}
						node={textRef.current}
					/>
				)}
			</Group>

			{isSelected && !isEditing && !textObj.locked && !isMultiSelected && (
				<Transformer
					name="Transformer"
					ref={trRef}
					anchorSize={5}
					rotateEnabled
					enabledAnchors={ANCHORS}
					boundBoxFunc={(oldBox, newBox) =>
						newBox.width < 30 || newBox.height < 20 ? oldBox : newBox
					}
				/>
			)}
		</>
	);
};

export const TextCanva = memo(TextCanvaComponent);
