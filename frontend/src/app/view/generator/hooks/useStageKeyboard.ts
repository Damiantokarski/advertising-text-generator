// hooks/useStageKeyboardMove.ts
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import {
	deleteProjectItems,
	moveCanvas,
	saveProject,
	selectAllElements,
} from "../../../store/slices/generator";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";

export const useStageKeyboard = (
	activeElementId?: string,
	projectId?: string
) => {
	const dispatch = useDispatch<AppDispatch>();

	useKeyboardShortcuts({
		ArrowUp: () => {
			if (!activeElementId) return;
			dispatch(moveCanvas({ id: activeElementId, dx: 0, dy: -1 }));
		},
		"Shift+ArrowUp": () => {
			if (!activeElementId) return;
			dispatch(moveCanvas({ id: activeElementId, dx: 0, dy: -10 }));
		},

		ArrowDown: () => {
			if (!activeElementId) return;
			dispatch(moveCanvas({ id: activeElementId, dx: 0, dy: 1 }));
		},
		"Shift+ArrowDown": () => {
			if (!activeElementId) return;
			dispatch(moveCanvas({ id: activeElementId, dx: 0, dy: 10 }));
		},

		ArrowLeft: () => {
			if (!activeElementId) return;
			dispatch(moveCanvas({ id: activeElementId, dx: -1, dy: 0 }));
		},
		"Shift+ArrowLeft": () => {
			if (!activeElementId) return;
			dispatch(moveCanvas({ id: activeElementId, dx: -10, dy: 0 }));
		},

		ArrowRight: () => {
			if (!activeElementId) return;
			dispatch(moveCanvas({ id: activeElementId, dx: 1, dy: 0 }));
		},
		"Shift+ArrowRight": () => {
			if (!activeElementId) return;
			dispatch(moveCanvas({ id: activeElementId, dx: 10, dy: 0 }));
		},
		"Ctrl+S": () => {
			dispatch(saveProject({ id: projectId! }));
		},
		"Ctrl+Delete": () => {
			dispatch(deleteProjectItems({ id: projectId! }));
		},
		"Ctrl+A": () => {
			dispatch(selectAllElements());
		},
	});
};
