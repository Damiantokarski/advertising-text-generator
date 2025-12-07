import { memo, useCallback } from "react";
import { Group, Rect, Text } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import type Konva from "konva";
import {
	setActiveElement,
	updateTemplatePosition,
	type Template,
} from "../../../../store/slices/generator";
import type { AppDispatch, RootState } from "../../../../store/store";

interface TemplateCanvaProps {
	id: string;
	templateObj: Template;
}

export const TemplateCanva = memo(({ id, templateObj }: TemplateCanvaProps) => {
	const dispatch = useDispatch<AppDispatch>();
	const activeElement = useSelector(
		(state: RootState) => state.generator.activeElement
	);

	const setActiveBanner = useCallback(() => {
		dispatch(setActiveElement(templateObj.id));
	}, [templateObj.id, dispatch]);

	const dragEnd = useCallback(
		(e: Konva.KonvaEventObject<DragEvent>) => {
			const data = {
				id: templateObj.id,
				x: e.target.x(),
				y: e.target.y(),
			};
			dispatch(updateTemplatePosition(data));
		},
		[templateObj.id, dispatch]
	);

	const { value, name, locked, display } = templateObj;

	const stroke = activeElement === templateObj.id ? "#0c8ce9" : "#b1b1b1";
	const scale = value.scale;
	const width = value.size.width * scale;
	const positionX = value.position.x;
	const positionY = value.position.y;
	const height = value.size.height * scale;
	const textY = -16 * scale;
	const fontSize = 12 * scale;

	return (
		<Group
			id={id}
			x={positionX}
			y={positionY}
			draggable={!locked}
			onClick={setActiveBanner}
			onDragEnd={dragEnd}
			visible={display}
		>
			<Rect
				width={width}
				height={height}
				stroke={stroke}
				strokeWidth={1}
				fill="#ffffff"
			/>

			<Text text={name} x={0} y={textY} fontSize={fontSize} fill="#a1a1a1" />
		</Group>
	);
});
