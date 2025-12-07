import { useEffect } from "react";
import Konva from "konva";

export function useTextTransformer(
  textRef: React.RefObject<Konva.Text | null>,
  trRef: React.RefObject<Konva.Transformer | null>,
  isSelected: boolean,
  isEditing: boolean
) {
  useEffect(() => {
    const transformer = trRef.current;
    const textNode = textRef.current;
    if (!transformer || !textNode) return;

    if (isSelected && !isEditing) {
      transformer.nodes([textNode]);
      transformer.show();
    } else {
      transformer.hide();
    }
    transformer.getLayer()?.batchDraw();

    return () => {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
    };
  }, [textRef, trRef, isSelected, isEditing]);
}
