import { useCallback, useMemo, useRef, useState } from "react";

export interface DropzoneOptions {
	onFiles: (files: File[]) => void;
	onError?: (messages: string[]) => void;
	accept?: string | string[];
	multiple?: boolean;
	maxSizeMB?: number;
	disabled?: boolean;
}

function normalizeAccept(accept?: string | string[]) {
	if (!accept) return undefined;
	if (Array.isArray(accept)) return accept.join(",");
	return accept;
}

function fileMatchesAccept(file: File, accept?: string) {
	if (!accept) return true;
	const tokens = accept
		.split(",")
		.map((t) => t.trim().toLowerCase())
		.filter(Boolean);
	const mime = (file.type || "").toLowerCase();
	const name = file.name.toLowerCase();

	const isPsd = name.endsWith(".psd");

	return tokens.some((rule) => {
		if (
			isPsd &&
			(rule === ".psd" ||
				rule === "image/vnd.adobe.photoshop" ||
				rule.startsWith("image/"))
		) {
			return true;
		}
		if (rule.endsWith("/*"))
			return mime && mime.startsWith(rule.replace("/*", "/"));
		if (rule.startsWith(".")) return name.endsWith(rule);
		return mime && mime === rule;
	});
}

export function useDropzone({
	onFiles,
	onError,
	accept,
	multiple = true,
	maxSizeMB,
	disabled = false,
}: DropzoneOptions) {
	const [isDragOver, setIsDragOver] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const acceptAttr = useMemo(() => normalizeAccept(accept), [accept]);

	const emitError = useCallback(
		(messages: string[]) => onError?.(messages),
		[onError]
	);

	const validateAndSubmit = useCallback(
		(list: FileList | File[]) => {
			const files = Array.from(list);
			const errors: string[] = [];

			const filtered = files.filter((f) => {
				if (maxSizeMB && f.size > maxSizeMB * 1024 * 1024) {
					errors.push(`${f.name} przekracza ${maxSizeMB} MB`);
					return false;
				}
				if (acceptAttr && !fileMatchesAccept(f, acceptAttr)) {
					errors.push(`${f.name} ma niedozwolony typ`);
					return false;
				}
				return true;
			});

			if (!filtered.length) {
				emitError(errors.length ? errors : ["Nie wybrano żadnych plików."]);
				return;
			}

			if (!multiple && filtered.length > 1) {
				emitError(["Wybrano więcej niż jeden plik."]);
				onFiles([filtered[0]]);
				return;
			}

			if (errors.length) emitError(errors);
			onFiles(filtered);
		},
		[acceptAttr, emitError, maxSizeMB, multiple, onFiles]
	);

	const openDialog = useCallback(() => {
		if (!disabled) inputRef.current?.click();
	}, [disabled]);

	const onDragOver = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			if (!disabled) {
				e.dataTransfer.dropEffect = "copy";
				setIsDragOver(true);
			}
		},
		[disabled]
	);

	const onDragLeave = useCallback(() => setIsDragOver(false), []);
	const onDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			if (!disabled) {
				setIsDragOver(false);
				validateAndSubmit(e.dataTransfer.files);
			}
		},
		[disabled, validateAndSubmit]
	);

	const onPaste = useCallback(
		(e: React.ClipboardEvent) => {
			if (disabled) return;
			const files: File[] = [];
			for (const item of e.clipboardData.items) {
				const f = item.getAsFile();
				if (f) files.push(f);
			}
			if (files.length) validateAndSubmit(files);
		},
		[disabled, validateAndSubmit]
	);

	return {
		inputRef,
		isDragOver,
		openDialog,
		onDragOver,
		onDragLeave,
		onDrop,
		onPaste,
		validateAndSubmit,
	};
}
