import { useEffect } from "react";
import Konva from "konva";

export function useTextTransformer(
  nodeRef: React.RefObject<Konva.Node | null>,
  trRef: React.RefObject<Konva.Transformer | null>,
  isSelected: boolean,
  isEditing: boolean
) {
  useEffect(() => {
    const transformer = trRef.current;
    const node = nodeRef.current;
    if (!transformer || !node) return;

    if (isSelected && !isEditing) {
      transformer.nodes([node]); 
      transformer.show();
    } else {
      transformer.hide();
    }

    transformer.getLayer()?.batchDraw();

    return () => {
      transformer.nodes([]);
      transformer.getLayer()?.batchDraw();
    };
  }, [nodeRef, trRef, isSelected, isEditing]);
}
