import { useCallback, useMemo, type ChangeEvent } from "react";
import { useUpdateText } from "../../../../hooks/useActiveCanvas";
import { FieldWrapper } from "../../../../../../ui/FieldWrapper";
import { Select } from "../../../../../../ui/Select/Select";
import { Input } from "../../../../../../ui/Input/Input";
import { Icon } from "../../../../../../ui/Icon";
import {
	registerFontFace,
	useGoogleFonts,
} from "../../../../hooks/useGoogleFonts";

const WEIGHT_LABELS: Record<
	string,
	{ key: string; label: string; value: string }
> = {
	"100": { key: "100", label: "Thin", value: "100" },
	"200": { key: "200", label: "Extra Light", value: "200" },
	"300": { key: "300", label: "Light", value: "300" },
	regular: { key: "regular", label: "Regular", value: "400" },
	"500": { key: "500", label: "Medium", value: "500" },
	"600": { key: "600", label: "Semi Bold", value: "600" },
	"700": { key: "700", label: "Bold", value: "700" },
	"800": { key: "800", label: "Extra Bold", value: "800" },
	"900": { key: "900", label: "Black", value: "900" },
	"100italic": { key: "100italic", label: "Thin Italic", value: "100 italic" },
	"200italic": {
		key: "200italic",
		label: "Extra Light Italic",
		value: "200 italic",
	},
	"300italic": { key: "300italic", label: "Light Italic", value: "300 italic" },
	italic: { key: "italic", label: "Italic", value: "italic" },
	"500italic": {
		key: "500italic",
		label: "Medium Italic",
		value: "500 italic",
	},
	"600italic": {
		key: "600italic",
		label: "Semi Bold Italic",
		value: "600 italic",
	},
	"700italic": { key: "700italic", label: "Bold Italic", value: "700 italic" },
	"800italic": {
		key: "E800italic",
		label: "Extra Bold Italic",
		value: "800 italic",
	},
	"900italic": { key: "900italic", label: "Black Italic", value: "900 italic" },
};

export const FontFields = () => {
	const { fonts, loading, error } = useGoogleFonts();
	const { value, updateValue, disabled } = useUpdateText();

	const googleFonts = useMemo(() => fonts ?? [], [fonts]);

	const fontFamilies = useMemo(
		() => googleFonts.map((f) => f.family),
		[googleFonts]
	);

	const variants = useMemo(() => {
		if (!value?.typography?.fontFamily) return [];

		const meta = googleFonts.find(
			(f) => f.family === value.typography.fontFamily
		);
		if (!meta || !meta.variants) return [];

		return meta.variants
			.map((v) => WEIGHT_LABELS[v])
			.filter((v): v is { key: string; label: string; value: string } =>
				Boolean(v)
			);
	}, [googleFonts, value?.typography?.fontFamily]);

	const selectedVariant =
		variants.find((opt) => opt.key === value?.typography?.fontWeight?.key) ??
		variants[0] ??
		WEIGHT_LABELS["regular"];

	const handleFontFamilyChange = useCallback(
		async (family: string) => {
			if (!value) return;

			updateValue({
				typography: {
					...value.typography,
					fontFamily: family,
					fontWeight: { key: "regular", label: "Regular", value: "400" },
				},
			});

			const fontData = googleFonts.find((el) => el.family === family);
			if (fontData) {
				await registerFontFace(fontData);
			} else {
				console.warn(`Font ${family} not found in sourceFonts`);
			}
		},
		[updateValue, value, googleFonts]
	);

	const handleFontWeightChange = useCallback(
		(label: string) => {
			if (!value) return;

			const opt = variants.find((v) => v.label === label);
			if (!opt) return;

			updateValue({
				typography: {
					...value.typography,
					fontWeight: opt,
				},
			});
		},
		[updateValue, value, variants]
	);

	const handleFontSizeChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			if (!value) return;

			updateValue({
				typography: {
					...value.typography,
					fontSize: Number(e.target.value),
				},
			});
		},
		[updateValue, value]
	);

	return (
		<FieldWrapper title="Typography" className="flex flex-col gap-3">
			<Select
				optionsList={fontFamilies}
				defaultValue={value?.typography?.fontFamily}
				onChange={handleFontFamilyChange}
				disabled={disabled || loading || !!error}
				small
			/>

			<div className="flex gap-3">
				<Select
					optionsList={variants.map((v) => v.label)}
					defaultValue={selectedVariant?.label}
					onChange={handleFontWeightChange}
					disabled={disabled || variants.length === 0}
					small
				/>

				<Input
					type="number"
					step={0.5}
					inputPrefix={<Icon type="textSize" className="text-xs" />}
					value={value?.typography?.fontSize ?? 0}
					onChange={handleFontSizeChange}
					disabled={disabled}
					inputSize="small"
				/>
			</div>
		</FieldWrapper>
	);
};
