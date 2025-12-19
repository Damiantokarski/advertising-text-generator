import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
	compressImagesApi,
	type CompressionSummary,
} from "../../../../../../api/compressImage";

export type UseCompressImageOptions = {
	outputName?: string;
	autoDownload?: boolean;
	onSuccess?: (result: {
		blob: Blob;
		filename?: string;
		summary?: CompressionSummary;
	}) => void;
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

const isProbablyImage = (file: File) => {
	const type = (file.type || "").toLowerCase();
	if (type.startsWith("image/")) return true;
	const fileName = file.name.toLowerCase();
	return (
		fileName.endsWith(".svg") ||
		fileName.endsWith(".svgz") ||
		fileName.endsWith(".jpg") ||
		fileName.endsWith(".jpeg") ||
		fileName.endsWith(".png") ||
		fileName.endsWith(".webp") ||
		fileName.endsWith(".avif")
	);
};

export const useCompressImage = (opts: UseCompressImageOptions = {}) => {
	const {
		outputName = "compressed",
		autoDownload = true,
		onSuccess,
		onError,
	} = opts;

	const [files, setFiles] = useState<File[]>([]);
	const [rejected, setRejected] = useState<
		Array<{ file: File; reason: string }>
	>([]);
	const [error, setError] = useState<string | null>(null);
	const [progress, setProgress] = useState<number>(0);
	const [isCompressing, setIsCompressing] = useState(false);
	const [summary, setSummary] = useState<CompressionSummary | undefined>(
		undefined
	);

	const mountedRef = useRef(true);
	const runRef = useRef(0);

	useEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	const canCompress = useMemo(
		() => files.length > 0 && !isCompressing,
		[files.length, isCompressing]
	);

	const onDrop = useCallback((incoming: File[]) => {
		const ok: File[] = [];
		const bad: Array<{ file: File; reason: string }> = [];

		for (const file of incoming) {
			if (!file || file.size === 0) {
				bad.push({ file: file, reason: "Empty file" });
				continue;
			}
			if (!isProbablyImage(file)) {
				bad.push({
					file: file,
					reason: "This does not appear to be an image (wrong type/extension)",
				});
				continue;
			}
			ok.push(file);
		}

		setFiles(ok);
		setRejected(bad);
		setError(null);
		setProgress(0);
		setSummary(undefined);

		if (bad.length) {
			toast.error(
				`File(s)  ${bad.length} rejected – these are not supported image formats.`
			);
		}
	}, []);

	const removeFile = useCallback((indexToRemove: number) => {
		setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
	}, []);

	const clear = useCallback(() => {
		setFiles([]);
		setRejected([]);
		setProgress(0);
		setError(null);
		setSummary(undefined);
	}, []);

	const compress = useCallback(async () => {
		if (!canCompress) return;

		setIsCompressing(true);
		setError(null);
		setProgress(0);
		setSummary(undefined);

		const myRun = ++runRef.current;

		try {
			const result = await compressImagesApi(files, outputName, (p) => {
				if (!mountedRef.current || runRef.current !== myRun) return;
				const pct = Math.max(0, Math.min(100, Math.floor(p)));
				setProgress(pct);
			});

			if (!mountedRef.current || runRef.current !== myRun) return;

			setSummary(result.summary);

			// UI feedback
			if (result.summary) {
				const summary = result.summary;
				if (summary.ok) {
					toast.success(
						`Copressed: ${summary.processed}/${summary.accepted} (rejected: ${summary.rejected}).`
					);
				} else {
					toast.success(
						`Ready, but there are warnings (rejected/errors: ${summary.rejected + summary.errorCount}).`
					);
				}
			} else {
				toast.success("Successfully compressed.");
			}

			if (autoDownload)
				downloadBlob(result.blob, result.filename ?? `${outputName}.zip`);

			onSuccess?.({
				blob: result.blob,
				filename: result.filename,
				summary: result.summary,
			});

			// po sukcesie czyścimy
			setFiles([]);
			setRejected([]);
			setProgress(0);
			setIsCompressing(false);

			return result.blob;
		} catch (error) {
			console.error(error);

			if (!mountedRef.current || runRef.current !== myRun) return;

			toast.error("Something went wrong with compression.");
			onError?.(error);

			setProgress(0);
			setIsCompressing(false);
			throw error;
		}
	}, [autoDownload, canCompress, files, onError, onSuccess, outputName]);

	return {
		files,
		rejected,
		summary,
		onDrop,
		removeFile,
		clear,
		compress,
		canCompress,
		isCompressing,
		error,
		progress,
	};
};
