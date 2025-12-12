import type { Color } from "ag-psd";

export const getRgb = (fillColor: Color): [number, number, number] => {
  if ("r" in fillColor && "g" in fillColor && "b" in fillColor) {
    return [fillColor.r!, fillColor.g!, fillColor.b!];
  }

  if ("channels" in fillColor && Array.isArray(fillColor.channels)) {
    const [r = 0, g = 0, b = 0] = fillColor.channels;
    return [r, g, b];
  }
  return [0, 0, 0];
};