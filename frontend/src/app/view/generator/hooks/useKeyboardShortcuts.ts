// hooks/useKeyboardShortcuts.ts
import { useEffect, useRef } from "react";

export type ShortcutHandlerContext = {
	event: KeyboardEvent;
};

export type ShortcutHandler = (ctx: ShortcutHandlerContext) => void;

export type ShortcutMap = Record<string, ShortcutHandler>;

const getShortcutKey = (e: KeyboardEvent): string => {
	const parts: string[] = [];

	if (e.ctrlKey) parts.push("Ctrl");
	if (e.metaKey) parts.push("Meta");
	if (e.altKey) parts.push("Alt");
	if (e.shiftKey) parts.push("Shift");

	const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
	parts.push(key);

	return parts.join("+");
};

export const useKeyboardShortcuts = (shortcuts: ShortcutMap) => {
	const shortcutsRef = useRef<ShortcutMap>(shortcuts);

	useEffect(() => {
		shortcutsRef.current = shortcuts;
	}, [shortcuts]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const key = getShortcutKey(e);
			const handler = shortcutsRef.current[key];

			if (!handler) return;

			e.preventDefault();

			handler({ event: e });
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
};
