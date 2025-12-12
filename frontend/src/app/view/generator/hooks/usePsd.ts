import { readPsd, type Psd } from "ag-psd";
import { useCallback, useState } from "react";
import { useCreateTemplate } from "./useCreateTemplate";
import { useCreateText } from "./useCreateText";
import { collectTextLayers } from "../../../utils/collectTextLayers";
import { checkPsdFile } from "../../../utils/checkPsdFile";

export const usePsd = () => {
	const createText = useCreateText();
	const createTemplate = useCreateTemplate();

	const [size, setSize] = useState<{ width: number; height: number } | null>(
		null
	);
	const [error, setError] = useState<string | null>(null);
	const [parsing, setParsing] = useState(false);

	const onDrop = useCallback(
		async (incoming: File[]) => {
			setError(null);
			if (!incoming || incoming.length === 0) {
				setError("Nie wybrano pliku.");
				return;
			}
			const file = incoming[0];

			if (!checkPsdFile(file)) {
				setError("Nieprawidłowy format pliku. Wymagany .psd");
				return;
			}

			try {
				setParsing(true);
				const buffer = await file.arrayBuffer();
				const psd: Psd = readPsd(new Uint8Array(buffer));

				const layers = psd.children ?? [];

				const width = psd.width;
				const height = psd.height;

				if (!width || !height) {
					setError("Brak artboardu w PSD, nie można określić rozmiaru trmplatki");
					return;
				}

				const texts = collectTextLayers(layers);
				const templateData: { width: number; height: number } = {
					width,
					height,
				};

				createTemplate({
					id: `${templateData.width}x${templateData.height}`,
					name: `${templateData.width}x${templateData.height}`,
					...templateData,
				});
				texts.forEach(createText);

				setSize(templateData);
			} catch (err) {
				console.error("Błąd parsowania PSD:", err);
				setError("Błąd parsowania PSD");
			} finally {
				setParsing(false);
			}
		},
		[createText, createTemplate]
	);

	return { onDrop, size, error, parsing };
};
