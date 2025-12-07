import React, { useRef, useCallback, memo } from "react";
import Konva from "konva";
import { Group, Text as KonvaText, Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../store/store";
import {
	setActiveElement,
	updateTextContainerSize,
	updateTextPosition,
	updateTextRotation,
	type Text,
} from "../../../../store/slices/generator";
import type { KonvaEventObject } from "konva/lib/Node";
import { TextEditor } from "./TextEditor";
import { useTextEditing } from "../../hooks/useTextEditing";
import { useTextTransformer } from "../../hooks/useTextTransformer";

interface TextCanvaProps {
	id: string;
	textObj: Text;
	stageRef: React.RefObject<Konva.Stage | null>;
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

export const TextCanva = memo(({ id, textObj, stageRef }: TextCanvaProps) => {
	const dispatch = useDispatch<AppDispatch>();

	const activeElement = useSelector(
		(state: RootState) => state.generator.activeElement
	);
	const isSelected = activeElement === textObj.id;
	const textRef = useRef<Konva.Text>(null);
	const groupRef = useRef<Konva.Group>(null);
	const trRef = useRef<Konva.Transformer>(null);
	const sizeRef = useRef({
		width: textObj.value.size.width,
		height: textObj.value.size.height,
	});

	const {
		value: {
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

	const textNode = textRef.current;
	const stageNode = stageRef.current;

	const { isEditing, finishEditing, handleDblClick } = useTextEditing(
		textObj,
		textNode,
		stageNode
	);

	useTextTransformer(textRef, trRef, isSelected, isEditing);

	const handleActiveText = useCallback(() => {
		if (textObj.locked) return;

		dispatch(setActiveElement(textObj.id));
	}, [dispatch, isEditing, textObj]);

	const handleDragEnd = useCallback(
		(e: KonvaEventObject<DragEvent>) => {
			dispatch(
				updateTextPosition({
					id: textObj.id,
					x: e.target.x(),
					y: e.target.y(),
				})
			);
		},
		[dispatch, textObj.id]
	);

	const handleTransform = useCallback(() => {
		if (!textNode) return;
		const scaleX = textNode.scaleX();
		const scaleY = textNode.scaleY();
		const newWidth = Math.max(20, textNode.width() * scaleX);
		const newHeight = Math.max(20, textNode.height() * scaleY);
		textNode.width(newWidth);
		textNode.height(newHeight);
		textNode.scale({ x: 1, y: 1 });
		textNode.offset({ x: newWidth / 2, y: newHeight / 2 });
		sizeRef.current = { width: newWidth, height: newHeight };
		textNode.getLayer()?.batchDraw();
	}, [textNode]);

	const handleTransformEnd = useCallback(() => {
		if (!textNode) return;
		dispatch(updateTextContainerSize({ id: textObj.id, ...sizeRef.current }));
		dispatch(
			updateTextRotation({ id: textObj.id, rotation: textNode.rotation() })
		);
	}, [dispatch, textObj.id, textNode]);

	return (
		<>
			<Group
				id={id}
				ref={groupRef}
				x={x}
				y={y}
				scaleX={horizontal}
				scaleY={vertical}
				draggable={!textObj.locked}
				visible={textObj.display}
				onClick={handleActiveText}
				onDblClick={handleDblClick}
				onDragEnd={handleDragEnd}
			>
				<KonvaText
					ref={textRef}
					text={text}
					fill={color}
					width={size.width}
					height={size.height}
					rotation={rotation}
					offsetX={sizeRef.current.width / 2}
					offsetY={sizeRef.current.height / 2}
					padding={3}
					fontSize={typography.fontSize}
					fontFamily={typography.fontFamily}
					fontStyle={typography.fontWeight.value}
					lineHeight={typography.lineHeight}
					letterSpacing={typography.letterSpacing}
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

			{isSelected && !isEditing && !textObj.locked && (
				<Transformer
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
});
