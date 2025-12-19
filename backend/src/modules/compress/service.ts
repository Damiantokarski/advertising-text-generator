import sharp from "sharp";
import { Request, Response } from "express";
import archiver from "archiver";
import { optimize as svgoOptimize } from "svgo";

/**  Typy i utilsy  */
type UploadFile = {
	buffer: Buffer;
	filename: string;
	contentType: string;
};

type TargetFmt = "original" | "webp" | "avif" | "jpeg" | "png";

function sanitizeName(name: string) {
	return name.replace(/[/\\?%*:|"<>]/g, "_");
}

function isSvg(mime: string, filename: string) {
	return (
		mime.toLowerCase().includes("image/svg+xml") ||
		filename.toLowerCase().endsWith(".svg")
	);
}

function extFromMime(mime: string): "jpeg" | "png" | "webp" | "avif" {
	const m = mime.toLowerCase();
	if (m.includes("jpeg") || m.includes("jpg")) return "jpeg";
	if (m.includes("png")) return "png";
	if (m.includes("webp")) return "webp";
	if (m.includes("avif")) return "avif";
	return "jpeg";
}

function pickTargetFormat(
	inputMime: string,
	hasAlpha: boolean,
	prefer: TargetFmt
): "webp" | "avif" | "jpeg" | "png" {
	if (prefer && prefer !== "original") return prefer;
	return extFromMime(inputMime);
}

function toUploadFiles(req: Request): UploadFile[] {
	const anyReq = req as any;

	if (Array.isArray(anyReq.files)) {
		return anyReq.files.map((f: Express.Multer.File) => ({
			buffer: f.buffer,
			filename: f.originalname,
			contentType: f.mimetype,
		}));
	}

	if (anyReq.file) {
		const f = anyReq.file as Express.Multer.File;
		return [
			{ buffer: f.buffer, filename: f.originalname, contentType: f.mimetype },
		];
	}

	if (anyReq.files && typeof anyReq.files === "object") {
		const dict = anyReq.files as Record<string, Express.Multer.File[]>;
		const all: UploadFile[] = [];
		for (const key of Object.keys(dict)) {
			for (const f of dict[key]) {
				all.push({
					buffer: f.buffer,
					filename: f.originalname,
					contentType: f.mimetype,
				});
			}
		}
		return all;
	}

	return [];
}

/**  Kompresja SVG (SVGO v3)  */
function optimizeSvgBuffer(
	buf: Buffer,
	filename: string,
	opts: {
		multipass?: boolean;
		pretty?: boolean;
		skipIfBigger?: boolean;
		enableRemoveViewBox?: boolean;
		enableRemoveDimensions?: boolean;
		floatPrecision?: number;
	} = {}
) {
	const {
		multipass = true,
		pretty = false,
		skipIfBigger = true,
		enableRemoveViewBox = false,
		enableRemoveDimensions = false,
		floatPrecision = 3,
	} = opts;

	const svgString = buf.toString("utf-8");

	const plugins: any[] = [
		{
			name: "preset-default",
			params: {
				overrides: {
					cleanupNumericValues: { floatPrecision },
				},
			},
		},
		"convertStyleToAttrs",
	];

	if (enableRemoveViewBox) plugins.push("removeViewBox");
	if (enableRemoveDimensions) plugins.push("removeDimensions");

	const { data } = svgoOptimize(svgString, {
		multipass,
		js2svg: { pretty },
		plugins,
	});

	const out = Buffer.from(data, "utf-8");
	if (skipIfBigger && out.length >= buf.length) {
		return {
			buffer: buf,
			filename,
			contentType: "image/svg+xml",
			originalBytes: buf.length,
			outputBytes: buf.length,
		};
	}

	const base = sanitizeName(filename.replace(/\.[^/.]+$/, ""));
	return {
		buffer: out,
		filename: `${base}.svg`,
		contentType: "image/svg+xml",
		originalBytes: buf.length,
		outputBytes: out.length,
	};
}

/**  Kompresja rastrów (sharp)  */
async function compressRasterBuffer(
	buf: Buffer,
	filename: string,
	contentType: string,
	opts: {
		maxWidth?: number;
		quality?: number;
		lossless?: boolean;
		preferFormat?: TargetFmt;
		keepMetadata?: boolean;
		skipIfBigger?: boolean;
	} = {}
) {
	const {
		maxWidth,
		quality = 85,
		lossless = false,
		preferFormat = "original",
		keepMetadata = false,
		skipIfBigger = true,
	} = opts;

	let img = sharp(buf, { failOn: "warning" }).rotate();
	if (!keepMetadata) img = img.withMetadata({ orientation: undefined });

	const meta = await img.metadata();
	const hasAlpha = Boolean(meta.hasAlpha);

	const width = meta.width || undefined;
	if (width && maxWidth && width > maxWidth) {
		img = img.resize({ width: maxWidth, withoutEnlargement: true });
	}

	const target = pickTargetFormat(contentType, hasAlpha, preferFormat);

	let out: sharp.Sharp;
	let outExt = target;

	switch (target) {
		case "png":
			out = img.png({
				compressionLevel: 9,
				palette: true,
				effort: 10,
			});
			outExt = "png";
			break;

		case "jpeg":
			out = img.jpeg({
				quality,
				mozjpeg: true,
				progressive: true,
			});
			outExt = "jpeg";
			break;

		case "webp":
			out = img.webp({
				quality,
				lossless: lossless || contentType.toLowerCase().includes("png"),
				effort: 4,
				nearLossless:
					contentType.toLowerCase().includes("png") && !lossless
						? true
						: undefined,
				alphaQuality: hasAlpha ? 100 : undefined,
			});
			outExt = "webp";
			break;

		case "avif":
			out = img.avif({
				quality,
				lossless,
				effort: 4,
				chromaSubsampling: lossless ? "4:4:4" : "4:2:0",
			});
			outExt = "avif";
			break;
	}

	const data = await out.toBuffer();

	if (skipIfBigger && data.length >= buf.length) {
		return {
			buffer: buf,
			filename,
			contentType,
			originalBytes: buf.length,
			outputBytes: buf.length,
			meta,
		};
	}

	const base = sanitizeName(filename.replace(/\.[^/.]+$/, ""));
	const chosenExt =
		preferFormat === "original" ? filename.split(".").pop() || outExt : outExt;
	const outName = `${base}.${chosenExt}`;

	const outType =
		chosenExt === "webp"
			? "image/webp"
			: chosenExt === "avif"
				? "image/avif"
				: chosenExt === "jpeg" || chosenExt === "jpg"
					? "image/jpeg"
					: "image/png";

	return {
		buffer: data,
		filename: outName,
		contentType: outType,
		originalBytes: buf.length,
		outputBytes: data.length,
		meta,
	};
}

/**  Dispatcher: SVG lub rastry  */
async function compressAnyBuffer(
	buf: Buffer,
	filename: string,
	contentType: string,
	commonOpts: {
		maxWidth?: number;
		quality?: number;
		lossless?: boolean;
		preferFormat?: TargetFmt;
		keepMetadata?: boolean;
		skipIfBigger?: boolean;
	}
) {
	if (isSvg(contentType, filename)) {
		return optimizeSvgBuffer(buf, filename, {
			multipass: true,
			pretty: false,
			skipIfBigger: commonOpts.skipIfBigger ?? true,
			enableRemoveViewBox: false,
			enableRemoveDimensions: false,
			floatPrecision: 3,
		});
	}
	return compressRasterBuffer(buf, filename, contentType, commonOpts);
}

/** Pomocnik nazw do pobrania */
function buildDownloadNameSingle(
	requested: string | undefined,
	producedFilename: string,
	producedContentType: string
) {
	const safeRequested = requested ? sanitizeName(requested.trim()) : "";
	if (!safeRequested) return producedFilename;

	const hasExt = /\.[a-z0-9]+$/i.test(safeRequested);
	if (hasExt) return safeRequested;

	const ct = (producedContentType || "").toLowerCase();
	const ext = ct.includes("webp")
		? "webp"
		: ct.includes("avif")
			? "avif"
			: ct.includes("jpeg")
				? "jpg"
				: ct.includes("png")
					? "png"
					: ct.includes("svg")
						? "svg"
						: producedFilename.split(".").pop() || "bin";

	return `${safeRequested}.${ext}`;
}

function buildDownloadNameZip(requested: string | undefined) {
	const base = requested ? sanitizeName(requested.trim()) : "images-compressed";
	return /\.[a-z0-9]+$/i.test(base) ? base : `${base}.zip`;
}

function setContentDisposition(res: Response, filename: string) {
	res.setHeader(
		"Content-Disposition",
		`attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`
	);
}

/**  Handler HTTP  */
export async function compressImage(req: Request, res: Response) {
	try {
		const files = toUploadFiles(req);

		if (!files || files.length === 0) {
			res
				.status(400)
				.send(
					"No files uploaded. Make sure field name matches your multer middleware."
				);
			return;
		}

		const preferFormat = String(
			req.query.format || "original"
		).toLowerCase() as TargetFmt;
		const maxWidth = req.query.maxWidth
			? Number(req.query.maxWidth)
			: undefined;
		const quality = req.query.quality
			? Math.max(1, Math.min(100, Number(req.query.quality)))
			: 85;
		const lossless = String(req.query.lossless || "false") === "true";
		const keepMetadata = String(req.query.keepMetadata || "false") === "true";
		const downloadName =
			typeof req.query.downloadName === "string"
				? req.query.downloadName
				: undefined;

		const common = {
			maxWidth,
			quality,
			lossless,
			preferFormat,
			keepMetadata,
			skipIfBigger: true,
		};

		if (files.length === 1) {
			const f = files[0];
			const out = await compressAnyBuffer(
				f.buffer,
				f.filename,
				f.contentType,
				common
			);

			const finalName = buildDownloadNameSingle(
				downloadName,
				out.filename,
				out.contentType
			);

			res.setHeader("Content-Type", out.contentType);
			setContentDisposition(res, finalName);
			res.send(out.buffer);
			return;
		}

		res.setHeader("Content-Type", "application/zip");
		setContentDisposition(res, "compressed.zip");

		const archive = archiver("zip", { zlib: { level: 9 } });
		archive.on("error", () => {
			res.status(500);
			res.end();
		});
		archive.pipe(res);

		for (const f of files) {
			try {
				const out = await compressAnyBuffer(
					f.buffer,
					f.filename,
					f.contentType,
					common
				);
				archive.append(out.buffer, { name: out.filename });
			} catch (e) {
				const msg = `Failed to process ${f.filename}: ${(e as Error).message}\n`;
				archive.append(Buffer.from(msg, "utf-8"), {
					name: `${sanitizeName(f.filename)}.error.txt`,
				});
			}
		}

		await archive.finalize();
	} catch (err: any) {
		console.error(err);
		res
			.status(500)
			.json({ error: "Image compression failed", details: err?.message });
	}
}
