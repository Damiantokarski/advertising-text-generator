import { useCallback, useEffect, useRef, useState } from "react";
import { compressImages } from "../../api/compressImage";


export type UseCompressImageOptions = {
	outputName?: string;
	autoDownload?: boolean;
	onSuccess?: (result: { blob: Blob; filename?: string }) => void;
	onError?: (e: unknown) => void;
};

const downloadBlob = (blob: Blob, filename: string) => {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 0);
};

export const useCompressImage = (opts: UseCompressImageOptions = {}) => {
	const {
		outputName = "compressed.zip",
		autoDownload = true,
		onSuccess,
		onError,
	} = opts;

	const [files, setFiles] = useState<File[]>([]);
	const [isAbleCompressing, setIsAbleCompressing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [progress, setProgress] = useState<number>(0);

	const mountedRef = useRef(true);
	const runRef = useRef(0);
	const finishTimeoutRef = useRef<number | null>(null);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
			if (finishTimeoutRef.current) {
				clearTimeout(finishTimeoutRef.current);
				finishTimeoutRef.current = null;
			}
		};
	}, []);

	const onDrop = useCallback((incoming: File[]) => {
		setFiles(incoming);
		setError(null);
		setProgress(0);
	}, []);

	const removeFile = useCallback((indexToRemove: number) => {
		setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
	}, []);

	const clear = useCallback(() => {
		setFiles([]);
		setProgress(0);
	}, []);

	useEffect(() => {
		if (files.length > 0) setIsAbleCompressing(true);
		else setIsAbleCompressing(false);
	}, [files]);

	const compress = useCallback(async () => {
		if (files.length === 0 || !isAbleCompressing) return;

		if (finishTimeoutRef.current) {
			clearTimeout(finishTimeoutRef.current);
			finishTimeoutRef.current = null;
		}

		setIsAbleCompressing(true);
		setError(null);
		setProgress(0);

		const myRun = ++runRef.current;

		let retBlob: Blob | undefined;

		try {
			const { blob, filename } = await compressImages(files, undefined, (p) => {
				if (!mountedRef.current || runRef.current !== myRun) return;

				const pct = Math.max(0, Math.min(100, Math.floor(p)));

				if (pct >= 100) {
					setProgress(100);
					if (finishTimeoutRef.current) {
						clearTimeout(finishTimeoutRef.current);
						finishTimeoutRef.current = null;
					}
					finishTimeoutRef.current = window.setTimeout(() => {
						if (!mountedRef.current || runRef.current !== myRun) return;
						setIsAbleCompressing(false);
						setProgress(0);
						finishTimeoutRef.current = null;
					}, 300);
				} else {
					setProgress(pct);
				}
			});
			if (autoDownload) downloadBlob(blob, filename ?? outputName);
			onSuccess?.({ blob, filename });
			setFiles([]);
			retBlob = blob;
		} catch (e: any) {
			const msg = e?.message ?? "Wystąpił błąd podczas kompresji.";
			setError(msg);
			onError?.(e);
			if (finishTimeoutRef.current) {
				clearTimeout(finishTimeoutRef.current);
				finishTimeoutRef.current = null;
			}
			setIsAbleCompressing(false);
			setProgress(0);
			throw e;
		} finally {
			setTimeout(() => {
				if (!mountedRef.current || runRef.current !== myRun) return;
				if (retBlob === undefined) {
					if (finishTimeoutRef.current) {
						clearTimeout(finishTimeoutRef.current);
						finishTimeoutRef.current = null;
					}
					setIsAbleCompressing(false);
					setProgress(0);
				}
			}, 0);
		}

		return retBlob;
	}, [files, isAbleCompressing, autoDownload, outputName, onSuccess, onError]);

	return {
		files,
		onDrop,
		removeFile,
		clear,
		compress,
		isAbleCompressing,
		error,
		progress,
	};
};
