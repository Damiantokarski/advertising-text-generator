import { useEffect } from "react";
import Konva from "konva";
import { useDispatch } from "react-redux";
import { updateTextValue, type Text } from "../../../store/slices/generator";

const eventsToBlock = [
	"mousedown",
	"mouseup",
	"click",
	"dblclick",
	"contextmenu",
	"touchstart",
	"keydown",
	"keyup",
];

export function useTextEditor(
	textObj: Text,
	node: Konva.Text | null,
	stageRef: React.RefObject<Konva.Stage | null>,
	onFinish: () => void
) {
	const dispatch = useDispatch();

	useEffect(() => {
		const stage = stageRef.current;
		if (!stage || !node || typeof window === "undefined") return;

		const {
			value: { text, typography, color, rotation, horizontal, vertical },
		} = textObj;

		const absPos = node.getAbsolutePosition();
		const scale = stage.scaleX();
		const width = node.width() * scale;
		const height = node.height() * scale;
		const padding = node.padding() * scale;

		const x = absPos.x - node.offsetX() * scale - padding;
		const y = absPos.y - node.offsetY() * scale - padding;

		const textarea = document.createElement("textarea");
		textarea.classList.add("hidden-scrollbar");
		textarea.tabIndex = -1;
		textarea.value = text;

		const getTextareaStyles = (): Partial<CSSStyleDeclaration> => ({
			position: "absolute",
			top: `${y + 3 * scale}px`,
			left: `${x + 3 * scale}px`,
			width: `${width}px`,
			height: `${height}px`,
			fontSize: `${typography.fontSize * scale}px`,
			fontWeight: typography.fontWeight.value,
			fontStyle: typography.fontStyle,
			border: "1px solid #2b7fff",
			margin: "0",
			padding: `${2.4 * scale}px 0 0 ${2.9 * scale}px`,
			overflow: "auto",
			boxSizing: "border-box",
			background: "transparent",
			outline: "none",
			resize: "none",
			color,
			lineHeight: typography.lineHeight.toString(),
			letterSpacing: `${typography.letterSpacing}px`,
			fontFamily: typography.fontFamily,
			transform: `rotate(${rotation}deg) scaleX(${horizontal}) scaleY(${vertical})`,
			transformOrigin: "center",
			textAlign: typography.align,
			zIndex: "20",
		});

		Object.assign(textarea.style, getTextareaStyles());

		document.body.appendChild(textarea);
		textarea.focus();

		const stopPropagation = (e: Event) => e.stopPropagation();
		eventsToBlock.forEach((event) =>
			textarea.addEventListener(event, stopPropagation)
		);

		const handleInput = () => {
			dispatch(
				updateTextValue({
					id: textObj.id,
					value: { ...textObj.value, text: textarea.value },
				})
			);
		};

		const handleBlur = () => {
			handleInput();
			onFinish();
		};

		textarea.addEventListener("input", handleInput);
		textarea.addEventListener("blur", handleBlur);

		return () => {
			textarea.removeEventListener("input", handleInput);
			textarea.removeEventListener("blur", handleBlur);
			eventsToBlock.forEach((event) =>
				textarea.removeEventListener(event, stopPropagation)
			);
			if (document.body.contains(textarea)) {
				document.body.removeChild(textarea);
			}
		};
	}, [textObj, node, stageRef, onFinish, dispatch]);
}
