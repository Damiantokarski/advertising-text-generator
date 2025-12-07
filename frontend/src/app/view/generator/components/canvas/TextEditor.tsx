import React from "react";
import Konva from "konva";
import type { Text } from "../../../../store/slices/generator";
import { useTextEditor } from "../../hooks/useTextEditor";

interface TextEditorProps {
	textObj: Text;
	stageRef: React.RefObject<Konva.Stage | null>;
	onFinish: () => void;
	node: Konva.Text | null;
}

export const TextEditor = ({
	textObj,
	stageRef,
	onFinish,
	node,
}: TextEditorProps) => {
	useTextEditor(textObj, node, stageRef, onFinish);
	return null;
};
