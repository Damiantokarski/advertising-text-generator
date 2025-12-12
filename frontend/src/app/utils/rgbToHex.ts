export const rgbToHex = (r: number, g: number, b: number): string => {
	const toHex = (comps: number) => {
		const v = Math.round(comps <= 1 ? comps * 255 : comps);
		const clamped = Math.max(0, Math.min(255, v));
		return clamped.toString(16).padStart(2, "0");
	};
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};