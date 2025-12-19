export type CompressionSummary = {
	ok: boolean;
	received: number;
	accepted: number;
	rejected: number;
	processed: number;
	errorCount: number;
	totalInputBytes: number;
	totalOutputBytes: number;
	totalSavedBytes: number;
	outputKind: "single" | "zip";
	outputFilename: string;
	errors: Array<{ filename: string; reason: string }>;
};

function parseFilenameFromContentDisposition(
	cd: string | null
): string | undefined {
	if (!cd) return;

	const star = cd.match(/filename\*\s*=\s*([^;]+)/i);
	if (star) {
		let v = star[1].trim().replace(/^"|"$/g, "");
		const parts = v.split("''");
		if (parts.length === 2) v = parts[1];
		try {
			return decodeURIComponent(v);
		} catch {
			return v;
		}
	}

	const plain = cd.match(/filename\s*=\s*("?)([^";]+)\1/i);
	if (plain) return plain[2];
}

function inferFilename(contentType: string | null | undefined): string {
	const ct = (contentType || "").toLowerCase();
	const ext = ct.includes("zip")
		? "zip"
		: ct.includes("webp")
			? "webp"
			: ct.includes("avif")
				? "avif"
				: ct.includes("jpeg")
					? "jpg"
					: ct.includes("png")
						? "png"
						: ct.includes("svg")
							? "svg"
							: "bin";
	return `compressed.${ext}`;
}

function ensureExtension(name: string, fallbackExt: string): string {
	const hasExt = /\.[a-z0-9]+$/i.test(name);
	return hasExt ? name : `${name}.${fallbackExt}`;
}

async function readBlobAsText(blob: Blob): Promise<string> {
	return await new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => resolve(String(r.result ?? ""));
		r.onerror = () => reject(new Error("Failed to read error body"));
		r.readAsText(blob);
	});
}

function safeJsonParse<T>(txt: string): T | undefined {
	try {
		return JSON.parse(txt) as T;
	} catch {
		return undefined;
	}
}

export type CompressImagesApiResult = {
	blob: Blob;
	filename?: string;
	summary?: CompressionSummary;
};

export const compressImagesApi = async (
	files: File[],
	downloadName?: string,
	onProgress?: (percent: number) => void
): Promise<CompressImagesApiResult> => {
	if (!files?.length) {
		throw new Error("No files to compress.");
	}

	const form = new FormData();
	for (const file of files) form.append("files", file, file.name);

	const qs = new URLSearchParams({ format: "original" });
	if (downloadName && downloadName.trim())
		qs.set("downloadName", downloadName.trim());

	const url = `http://localhost:4000/api/compress-download?${qs.toString()}`;

	return await new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", url);
		xhr.responseType = "blob";

		// upload progress -> 0..50
		xhr.upload.onprogress = (ev) => {
			if (!onProgress) return;
			if (ev.lengthComputable && ev.total > 0) {
				const uploadPct = (ev.loaded / ev.total) * 50;
				onProgress(Math.max(0, Math.min(100, Math.floor(uploadPct))));
			} else {
				// heuristic
				const heuristic = Math.min(45, Math.floor((ev.loaded / (1024 * 1024)) * 5));
				onProgress(heuristic);
			}
		};

		// download progress -> 50..100
		xhr.onprogress = (ev) => {
			if (!onProgress) return;
			if (ev.lengthComputable && ev.total > 0) {
				const downloadPct = 50 + (ev.loaded / ev.total) * 50;
				onProgress(Math.max(0, Math.min(100, Math.floor(downloadPct))));
			} else {
				const approx = Math.min(95, 50 + Math.floor(ev.loaded / (256 * 1024)));
				onProgress(approx);
			}
		};

		xhr.onload = async () => {
			onProgress?.(100);

			const blob = xhr.response as Blob;

			// błąd HTTP → spróbuj wyciągnąć JSON/text
			if (xhr.status < 200 || xhr.status >= 300) {
				const txt = await readBlobAsText(blob).catch(() => "");
				const maybeJson = safeJsonParse<{ error: string; message: string }>(txt);
				const msg =
					maybeJson?.error ||
					maybeJson?.message ||
					txt ||
					`Compression failed: ${xhr.status} ${xhr.statusText}`;
				reject(new Error(msg));
				return;
			}

			const cd = xhr.getResponseHeader("content-disposition");
			const ct = xhr.getResponseHeader("content-type");
			const summaryHeader = xhr.getResponseHeader("x-compression-summary");

			const summary = summaryHeader
				? safeJsonParse<CompressionSummary>(summaryHeader)
				: undefined;

			let filename = parseFilenameFromContentDisposition(cd);

			if (downloadName && downloadName.trim()) {
				if ((ct || "").toLowerCase().includes("zip")) {
					filename = ensureExtension(downloadName.trim(), "zip");
				} else {
					const inferred = inferFilename(ct);
					const fallbackExt = inferred.split(".").pop() || "bin";
					filename = ensureExtension(downloadName.trim(), fallbackExt);
				}
			}

			if (!filename) {
				filename = files.length === 1 ? files[0].name : "compressed.zip";
			}

			resolve({ blob, filename, summary });
		};

		xhr.onerror = () =>
			reject(new Error("Network error during compression request."));
		xhr.send(form);
	});
};
