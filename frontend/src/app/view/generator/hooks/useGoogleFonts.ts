import Konva from "konva";
import { useEffect, useState } from "react";
import { googleFontsApi } from "../../../../api/googleFontsApi";


export interface FontItem {
	family: string;
	category: string;
	variants: string[];
	subsets: string[];
	files: { [variant: string]: string };
}


export async function registerFontFace(font: FontItem): Promise<void> {
	const fontPromises = font.variants.map(async (variant) => {
		const url = font.files?.[variant];
		if (!url) {
			console.warn(`No URL for ${font.family} ${variant}`);
			return Promise.resolve();
		}

		const isItalic = variant.toLowerCase().includes("italic");
		const weight =
			parseInt(
				variant === "regular" ? "400" : variant.replace("italic", ""),
				10
			) || 400;

		const style = isItalic ? "italic" : "normal";

		const face = new FontFace(font.family, `url(${url}) format('woff2')`, {
			weight: String(weight),
			style,
		});

		return face
			.load()
			.then((loaded) => {
				document.fonts.add(loaded);
			})
			.catch((e) => {
				console.error(`Failed to load ${font.family} ${variant}:`, e);
			});
	});

	await Promise.all(fontPromises);

	await document.fonts.ready;
	Konva.stages.forEach((stage) => stage.batchDraw());
}

export function useGoogleFonts() {
	const [fonts, setFonts] = useState<FontItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const controller = new AbortController();

		async function fetchFonts() {
			setLoading(true);
			try {
				const data = await googleFontsApi();
				setFonts(data);
				setError(null);
			} catch (error) {
				if (controller.signal.aborted) return;
				console.error("useGoogleFonts error:", error);
				setError(error instanceof Error ? error.message : "Error fetching fonts");
			} finally {
				if (!controller.signal.aborted) {
					setLoading(false);
				}
			}
		}

		fetchFonts();

		return () => controller.abort();
	}, []);

	return { fonts, loading, error } as const;
}
