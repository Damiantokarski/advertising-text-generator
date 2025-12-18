function parseFilenameFromContentDisposition(
	cd: string | null
): string | undefined {
	if (!cd) return;
	const star = cd.match(/filename\*\s*=\s*([^;]+)/i);
	if (star) {
		let v = star[1].trim();
		v = v.replace(/^"|"$/g, "");
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

/**
 * compressImages - now accepts optional onProgress callback
 * onProgress(percent: number) -> percent 0..100
 */
export async function compressImages(
	files: File[],
	fileName?: string,
	onProgress?: (percent: number) => void
): Promise<{ blob: Blob; filename?: string }> {
	if (!files?.length) throw new Error("Brak plików do kompresji.");

	const form = new FormData();
	for (const file of files) form.append("files", file, file.name);

	const qs = new URLSearchParams({ format: "original" });
	if (fileName && fileName.trim()) qs.set("downloadName", fileName.trim());

	const url = `http://localhost:4000/api/compress-download?${qs.toString()}`;

	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", url);
		xhr.responseType = "blob";

		// upload progress -> mapped to 0..50%
		xhr.upload.onprogress = (ev) => {
			if (!onProgress) return;
			if (ev.lengthComputable && ev.total > 0) {
				const uploadPct = (ev.loaded / ev.total) * 50;
				onProgress(Math.min(100, Math.floor(uploadPct)));
			} else {
				// fallback: small heuristic progress during upload
				const heuristic = Math.min(
					45,
					Math.floor((ev.loaded / (1024 * 1024)) * 5)
				);
				onProgress(heuristic);
			}
		};

		// download progress -> mapped to 50..100%
		xhr.onprogress = (ev) => {
			if (!onProgress) return;
			if (ev.lengthComputable && ev.total > 0) {
				const downloadPct = 50 + (ev.loaded / ev.total) * 50;
				onProgress(Math.min(100, Math.floor(downloadPct)));
			} else {
				// when total unknown, slowly advance from 50 -> 95
				const approx = Math.min(95, 50 + Math.floor(ev.loaded / (256 * 1024)));
				onProgress(approx);
			}
		};

		xhr.onload = async () => {
			// final progress
			onProgress?.(100);

			if (xhr.status < 200 || xhr.status >= 300) {
				// try to read text for error
				const reader = new FileReader();
				reader.onload = () => {
					const txt = String(reader.result ?? "");
					reject(
						new Error(
							`Compression failed: ${xhr.status} ${xhr.statusText} ${txt}`
						)
					);
				};
				reader.onerror = () =>
					reject(
						new Error(`Compression failed: ${xhr.status} ${xhr.statusText}`)
					);
				reader.readAsText(xhr.response);
				return;
			}

			const cd = xhr.getResponseHeader("content-disposition");
			const ct = xhr.getResponseHeader("content-type");

			let filename = parseFilenameFromContentDisposition(cd);

			if (fileName && fileName.trim()) {
				if ((ct || "").toLowerCase().includes("zip")) {
					filename = ensureExtension(fileName.trim(), "zip");
				} else {
					const inferred = inferFilename(ct);
					const fallbackExt = inferred.split(".").pop() || "bin";
					filename = ensureExtension(fileName.trim(), fallbackExt);
				}
			}

			if (!filename) {
				if (files.length === 1) {
					filename = files[0].name;
				} else {
					filename = "compressed.zip";
				}
			}

			const blob = xhr.response as Blob;
			resolve({ blob, filename });
		};

		xhr.onerror = () => {
			reject(new Error("Network error during compression request."));
		};

		xhr.send(form);
	});
}
