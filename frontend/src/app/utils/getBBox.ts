import Konva from "konva";

export function getSelectionBBoxFromStage(stage: Konva.Stage, ids: string[]) {
  const layer = stage.findOne("#layer") as Konva.Layer | null;
  if (!layer) return null;

  const rects = ids
    .map((id) => stage.findOne(`#${id}`) as Konva.Node | null)
    .filter(Boolean)
    .map((node) => node!.getClientRect({ relativeTo: layer }));

  if (!rects.length) return null;

  const minX = Math.min(...rects.map((r) => r.x));
  const minY = Math.min(...rects.map((r) => r.y));
  const maxX = Math.max(...rects.map((r) => r.x + r.width));
  const maxY = Math.max(...rects.map((r) => r.y + r.height));

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
