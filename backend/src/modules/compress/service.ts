import sharp from "sharp";
import type { Request, Response } from "express";
import archiver from "archiver";
import { optimize as svgoOptimize } from "svgo";
import path from "path";

type UploadFile = {
	buffer: Buffer;
	filename: string;
	contentType: string;
};

type TargetFmt = "original" | "webp" | "avif" | "jpeg" | "png";

type FileReport = {
	inputName: string;
	inputType: string;
	inputBytes: number;
	ok: boolean;
	outputName?: string;
	outputType?: string;
	outputBytes?: number;
	savedBytes?: number;
	reason?: string;
};

type CompressionSummary = {
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

function sanitizeName(name: string) {
	return name.replace(/[/\\?%*:|"<>]/g, "_").trim() || "file";
}

function isSvgFile(f: UploadFile) {
	const n = f.filename.toLowerCase();
	return (
		f.contentType.toLowerCase().includes("svg") ||
		n.endsWith(".svg") ||
		n.endsWith(".svgz")
	);
}

function getExtFromName(filename: string) {
	const ext = path.extname(filename).replace(".", "").toLowerCase();
	return ext || "";
}

function stripExt(filename: string) {
	const ext = path.extname(filename);
	return ext ? filename.slice(0, -ext.length) : filename;
}

function guessTargetExt(
	fmt: TargetFmt,
	originalName: string,
	originalType: string
) {
	if (fmt !== "original") {
		if (fmt === "jpeg") return "jpg";
		return fmt;
	}
	// original: spróbuj rozszerzenie, a jak nie ma to z content-type
	const ext = getExtFromName(originalName);
	if (ext) return ext;
	const ct = (originalType || "").toLowerCase();
	if (ct.includes("jpeg")) return "jpg";
	if (ct.includes("png")) return "png";
	if (ct.includes("webp")) return "webp";
	if (ct.includes("avif")) return "avif";
	if (ct.includes("svg")) return "svg";
	return "bin";
}

function buildContentDisposition(filename: string) {
	// RFC 5987 / filename*
	const safe = sanitizeName(filename);
	return `attachment; filename="${safe}"; filename*=UTF-8''${encodeURIComponent(
		safe
	)}`;
}

function toUploadFiles(req: Request): UploadFile[] {
	// multer może dać: req.file, req.files jako array lub jako mapę field->files[]
	const anyReq = req as any;

	const out: UploadFile[] = [];

	if (anyReq.file?.buffer) {
		out.push({
			buffer: anyReq.file.buffer,
			filename: anyReq.file.originalname || anyReq.file.filename || "file",
			contentType: anyReq.file.mimetype || "application/octet-stream",
		});
		return out;
	}

	const files = anyReq.files;

	if (Array.isArray(files)) {
		for (const f of files) {
			if (!f?.buffer) continue;
			out.push({
				buffer: f.buffer,
				filename: f.originalname || f.filename || "file",
				contentType: f.mimetype || "application/octet-stream",
			});
		}
		return out;
	}

	if (files && typeof files === "object") {
		for (const key of Object.keys(files)) {
			const arr = files[key];
			if (!Array.isArray(arr)) continue;
			for (const f of arr) {
				if (!f?.buffer) continue;
				out.push({
					buffer: f.buffer,
					filename: f.originalname || f.filename || "file",
					contentType: f.mimetype || "application/octet-stream",
				});
			}
		}
	}

	return out;
}

function validateFile(f: UploadFile): { ok: boolean; reason?: string } {
	if (!f.buffer || f.buffer.length === 0)
		return { ok: false, reason: "Empty file" };
	const ct = (f.contentType || "").toLowerCase();

	// SVG obsługujemy jawnie
	if (isSvgFile(f)) return { ok: true };

	// dla rastrów: typ image/*
	if (ct.startsWith("image/")) return { ok: true };

	// czasem przeglądarka daje pusty mimetype – spróbuj po rozszerzeniu
	const ext = getExtFromName(f.filename);
	if (
		[
			"png",
			"jpg",
			"jpeg",
			"webp",
			"avif",
			"gif",
			"tiff",
			"bmp",
			"heic",
			"heif",
		].includes(ext)
	) {
		return { ok: true };
	}

	return {
		ok: false,
		reason: `Unsupported content-type: ${f.contentType || "unknown"}`,
	};
}

async function compressSvg(
	buf: Buffer
): Promise<{ out: Buffer; contentType: string }> {
	const src = buf.toString("utf-8");
	const optimized = svgoOptimize(src, { multipass: true });
	if ("data" in optimized && typeof optimized.data === "string") {
		return {
			out: Buffer.from(optimized.data, "utf-8"),
			contentType: "image/svg+xml",
		};
	}
	// fallback: zwróć oryginał
	return { out: buf, contentType: "image/svg+xml" };
}

async function compressRaster(
	buf: Buffer,
	originalType: string,
	preferFormat: TargetFmt,
	opts: {
		quality: number;
		maxWidth?: number;
		keepMetadata: boolean;
		lossless: boolean;
		skipIfBigger: boolean;
	}
): Promise<{ out: Buffer; contentType: string }> {
	const { quality, maxWidth, keepMetadata, lossless, skipIfBigger } = opts;

	let img = sharp(buf, { failOn: "warning" }).rotate();

	if (!keepMetadata) {
		img = img.withMetadata({ orientation: undefined });
	} else {
		img = img.withMetadata();
	}

	const meta = await img.metadata();
	const width = meta.width || undefined;

	if (width && maxWidth && width > maxWidth) {
		img = img.resize({ width: maxWidth, withoutEnlargement: true });
	}

	// wybór formatu
	const ctLower = (originalType || "").toLowerCase();
	const origIsPng = ctLower.includes("png");
	const origIsJpeg = ctLower.includes("jpeg") || ctLower.includes("jpg");
	const origIsWebp = ctLower.includes("webp");
	const origIsAvif = ctLower.includes("avif");

	let out: Buffer;
	let outType: string;

	const target = preferFormat;

	if (target === "webp") {
		out = await img.webp({ quality, lossless }).toBuffer();
		outType = "image/webp";
	} else if (target === "avif") {
		out = await img.avif({ quality, lossless }).toBuffer();
		outType = "image/avif";
	} else if (target === "jpeg") {
		out = await img.jpeg({ quality, mozjpeg: true }).toBuffer();
		outType = "image/jpeg";
	} else if (target === "png") {
		out = await img.png({ quality, compressionLevel: 9 }).toBuffer();
		outType = "image/png";
	} else {
		// original: zachowaj możliwie to co było, ale prze-encode
		if (origIsWebp) {
			out = await img.webp({ quality, lossless }).toBuffer();
			outType = "image/webp";
		} else if (origIsAvif) {
			out = await img.avif({ quality, lossless }).toBuffer();
			outType = "image/avif";
		} else if (origIsPng) {
			out = await img.png({ quality, compressionLevel: 9 }).toBuffer();
			outType = "image/png";
		} else if (origIsJpeg) {
			out = await img.jpeg({ quality, mozjpeg: true }).toBuffer();
			outType = "image/jpeg";
		} else {
			// fallback: webp
			out = await img.webp({ quality, lossless }).toBuffer();
			outType = "image/webp";
		}
	}

	if (skipIfBigger && out.length >= buf.length) {
		return { out: buf, contentType: originalType || "application/octet-stream" };
	}

	return { out, contentType: outType };
}

export async function compressImage(req: Request, res: Response) {
	try {
		const files = toUploadFiles(req);

		if (!files.length) {
			res.status(400).json({ ok: false, error: "No files uploaded" });
			return;
		}

		const preferFormat = String(
			req.query.format || "original"
		).toLowerCase() as TargetFmt;
		const requestedName =
			typeof req.query.downloadName === "string"
				? req.query.downloadName.trim()
				: "";

		const quality = Number(req.query.quality ?? 80);
		const maxWidthRaw =
			req.query.maxWidth != null ? Number(req.query.maxWidth) : undefined;
		const maxWidth = Number.isFinite(maxWidthRaw as any)
			? (maxWidthRaw as number)
			: undefined;
		const keepMetadata =
			String(req.query.keepMetadata ?? "false").toLowerCase() === "true";
		const lossless =
			String(req.query.lossless ?? "false").toLowerCase() === "true";
		const skipIfBigger =
			String(req.query.skipIfBigger ?? "true").toLowerCase() !== "false";

		const totalInputBytes = files.reduce(
			(a, f) => a + (f.buffer?.length || 0),
			0
		);

		const reports: FileReport[] = [];
		const valid: UploadFile[] = [];
		const invalidErrors: Array<{ filename: string; reason: string }> = [];

		for (const f of files) {
			const v = validateFile(f);
			if (!v.ok) {
				invalidErrors.push({
					filename: f.filename,
					reason: v.reason || "Invalid file",
				});
				reports.push({
					inputName: f.filename,
					inputType: f.contentType,
					inputBytes: f.buffer?.length || 0,
					ok: false,
					reason: v.reason || "Invalid file",
				});
			} else {
				valid.push(f);
			}
		}

		// jeśli wszystkie złe → 400 z JSON (frontend to pokaże userowi)
		if (valid.length === 0) {
			res.status(400).json({
				ok: false,
				error: "No valid files",
				received: files.length,
				rejected: invalidErrors.length,
				errors: invalidErrors,
			});
			return;
		}

		const isMulti = valid.length > 1;

		// CORS: pozwól frontendowi czytać nasze headery
		res.setHeader(
			"Access-Control-Expose-Headers",
			"Content-Disposition,Content-Type,X-Compression-Summary"
		);

		if (!isMulti) {
			const f = valid[0];

			let outBuf: Buffer;
			let outType: string;

			if (isSvgFile(f)) {
				const r = await compressSvg(f.buffer);
				outBuf = r.out;
				outType = r.contentType;
			} else {
				const r = await compressRaster(f.buffer, f.contentType, preferFormat, {
					quality: Number.isFinite(quality)
						? Math.min(100, Math.max(1, quality))
						: 80,
					maxWidth,
					keepMetadata,
					lossless,
					skipIfBigger,
				});
				outBuf = r.out;
				outType = r.contentType;
			}

			const base = requestedName
				? sanitizeName(stripExt(requestedName))
				: sanitizeName(stripExt(f.filename));
			const ext = guessTargetExt(
				preferFormat,
				f.filename,
				outType || f.contentType
			);
			const downloadFilename = `${base}.${ext}`;

			const rep: FileReport = {
				inputName: f.filename,
				inputType: f.contentType,
				inputBytes: f.buffer.length,
				ok: true,
				outputName: downloadFilename,
				outputType: outType,
				outputBytes: outBuf.length,
				savedBytes: f.buffer.length - outBuf.length,
			};
			reports.push(rep);

			const summary: CompressionSummary = {
				ok: invalidErrors.length === 0,
				received: files.length,
				accepted: valid.length,
				rejected: invalidErrors.length,
				processed: 1,
				errorCount: invalidErrors.length,
				totalInputBytes,
				totalOutputBytes: outBuf.length,
				totalSavedBytes: totalInputBytes - outBuf.length,
				outputKind: "single",
				outputFilename: downloadFilename,
				errors: invalidErrors,
			};

			res.setHeader("X-Compression-Summary", JSON.stringify(summary));
			res.setHeader("Content-Type", outType || "application/octet-stream");
			res.setHeader(
				"Content-Disposition",
				buildContentDisposition(downloadFilename)
			);

			res.status(200).send(outBuf);
			return;
		}

		// MULTI → ZIP
		const zipNameBase = requestedName
			? sanitizeName(stripExt(requestedName))
			: "compressed";
		const zipFilename = `${zipNameBase}.zip`;

		const summaryBase: Omit<
			CompressionSummary,
			"totalOutputBytes" | "totalSavedBytes" | "ok"
		> = {
			received: files.length,
			accepted: valid.length,
			rejected: invalidErrors.length,
			processed: 0,
			errorCount: invalidErrors.length,
			totalInputBytes,
			outputKind: "zip",
			outputFilename: zipFilename,
			errors: invalidErrors,
		} as any;

		res.setHeader("Content-Type", "application/zip");
		res.setHeader("Content-Disposition", buildContentDisposition(zipFilename));

		const archive = archiver("zip", { zlib: { level: 9 } });
		archive.on("error", (e) => {
			console.error("zip error:", e);
			if (!res.headersSent) res.status(500);
			res.end();
		});
		archive.pipe(res);

		let totalOutputBytes = 0;
		let processed = 0;

		for (const f of valid) {
			try {
				let outBuf: Buffer;
				let outType: string;

				if (isSvgFile(f)) {
					const r = await compressSvg(f.buffer);
					outBuf = r.out;
					outType = r.contentType;
				} else {
					const r = await compressRaster(f.buffer, f.contentType, preferFormat, {
						quality: Number.isFinite(quality)
							? Math.min(100, Math.max(1, quality))
							: 80,
						maxWidth,
						keepMetadata,
						lossless,
						skipIfBigger,
					});
					outBuf = r.out;
					outType = r.contentType;
				}

				const base = sanitizeName(stripExt(f.filename));
				const ext = guessTargetExt(
					preferFormat,
					f.filename,
					outType || f.contentType
				);
				const outName = `${base}.${ext}`;

				archive.append(outBuf, { name: outName });

				reports.push({
					inputName: f.filename,
					inputType: f.contentType,
					inputBytes: f.buffer.length,
					ok: true,
					outputName: outName,
					outputType: outType,
					outputBytes: outBuf.length,
					savedBytes: f.buffer.length - outBuf.length,
				});

				totalOutputBytes += outBuf.length;
				processed += 1;
			} catch (e: any) {
				const reason = e?.message || "Compression failed";
				reports.push({
					inputName: f.filename,
					inputType: f.contentType,
					inputBytes: f.buffer.length,
					ok: false,
					reason,
				});

				// zachowaj też .error.txt (przydatne)
				archive.append(Buffer.from(reason, "utf-8"), {
					name: `${sanitizeName(f.filename)}.error.txt`,
				});
			}
		}

		// pełny raport w zip
		archive.append(Buffer.from(JSON.stringify(reports, null, 2), "utf-8"), {
			name: "report.json",
		});

		const summary: CompressionSummary = {
			ok: invalidErrors.length === 0 && reports.every((r) => r.ok),
			...summaryBase,
			processed,
			totalOutputBytes,
			totalSavedBytes: totalInputBytes - totalOutputBytes,
		};

		// małe podsumowanie w headerze
		res.setHeader("X-Compression-Summary", JSON.stringify(summary));

		await archive.finalize();
	} catch (err: any) {
		console.error(err);
		res
			.status(500)
			.json({
				ok: false,
				error: "Image compression failed",
				details: err?.message,
			});
	}
}
