import { memo, useCallback, type RefObject } from "react";
import { Group, Rect, Text as KonvaText } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import type Konva from "konva";
import {
	setSelectedElements,
	updateTemplatePosition,
	type Template,
} from "../../../../store/slices/generator";
import type { AppDispatch, RootState } from "../../../../store/store";
import { snapLinesPosition } from "../../../../utils/snapLines";
import { useSnapElements } from "../../hooks/useSnapElements";

interface TemplateCanvaProps {
	templateObj: Template;
	stageRef: RefObject<Konva.Stage | null>;
}

export const TemplateCanva = memo(({ templateObj, stageRef }: TemplateCanvaProps) => {
	const dispatch = useDispatch<AppDispatch>();

	const { value, locked, display } = templateObj;

	const selectedElements = useSelector(
		(state: RootState) => state.generator.selectedElements
	);

	const snapElements = useSnapElements();

	const isSelected = selectedElements.includes(templateObj.id);
	const stroke = isSelected ? "#0c8ce9" : "#b1b1b1";

	const { scale, size, position, name } = value;
	const width = size.width * scale;
	const height = size.height * scale;
	const positionX = position.x;
	const positionY = position.y;
	const textY = -16 * scale;
	const fontSize = 12 * scale;

	const setActiveBanner = useCallback(() => {
		if (locked) return;
		dispatch(setSelectedElements([templateObj.id]));
	}, [templateObj.id, dispatch, locked]);

	const dragEnd = useCallback(
		(e: Konva.KonvaEventObject<DragEvent>) => {
			if (locked) return;

			dispatch(
				updateTemplatePosition({
					id: templateObj.id,
					x: e.target.x(),
					y: e.target.y(),
				})
			);
		},
		[templateObj.id, dispatch, locked]
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
					templateObj.id,
					snapElements,
					logicalPos
				);
	
				return {
					x: snappedLogical.x * scale + stagePos.x,
					y: snappedLogical.y * scale + stagePos.y,
				};
			},
			[snapElements, templateObj.id, stageRef]
		);

	return (
		<Group
			id={templateObj.id}
			name="selectable"
			x={positionX}
			y={positionY}
			draggable={!locked}
			onClick={setActiveBanner}
			onDragEnd={dragEnd}
			visible={display}
			dragBoundFunc={dragBoundFunc}
		>
			<Rect
				width={width}
				height={height}
				stroke={stroke}
				strokeWidth={1}
				fill="#ffffff"
			/>

			<KonvaText text={name} x={0} y={textY} fontSize={fontSize} fill="#a1a1a1" />
		</Group>
	);
});
