export const FONT_WEIGHT: Record<
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
} as const;