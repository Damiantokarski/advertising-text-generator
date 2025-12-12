import Konva from "konva";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useDispatch } from "react-redux";
import { setSelectedElements } from "../../../store/slices/generator";
import type { AppDispatch } from "../../../store/store";

type SelectionRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
};

const getRelativePointerPosition = (stage: Konva.Stage | null) => {
  if (!stage) return null;
  const pointer = stage.getPointerPosition();
  if (!pointer) return null;

  const scale = stage.scaleX();
  const stagePos = stage.position();

  return {
    x: (pointer.x - stagePos.x) / scale,
    y: (pointer.y - stagePos.y) / scale,
  };
};

export const useStageSelection = (
  stageRef: RefObject<Konva.Stage | null>
) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState<SelectionRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });

  const selectionStartRef = useRef<{ x: number; y: number } | null>(null);
  const selectionRectRef = useRef(selectionRect);

  useEffect(() => {
    selectionRectRef.current = selectionRect;
  }, [selectionRect]);

  const stageMouseDown = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage();
      const isLeftClick = e.evt.button === 0;

      if (e.evt.shiftKey && isLeftClick && stage) {
        const pointerPos = getRelativePointerPosition(stage);
        if (!pointerPos) return;

        selectionStartRef.current = { x: pointerPos.x, y: pointerPos.y };
        setSelectionRect({
          x: pointerPos.x,
          y: pointerPos.y,
          width: 0,
          height: 0,
          visible: true,
        });
        setIsSelecting(true);
        dispatch(setSelectedElements([]));
        return;
      }

      if (e.target === stage) {
        dispatch(setSelectedElements([]));
      }
    },
    [dispatch]
  );

  const stageMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selectionStartRef.current) return;

    const stage = e.target.getStage();
    const pointerPos = getRelativePointerPosition(stage);
    if (!pointerPos) return;

    const sx = selectionStartRef.current.x;
    const sy = selectionStartRef.current.y;

    const x = Math.min(sx, pointerPos.x);
    const y = Math.min(sy, pointerPos.y);
    const width = Math.abs(pointerPos.x - sx);
    const height = Math.abs(pointerPos.y - sy);

    setSelectionRect((prev) => ({
      ...prev,
      x,
      y,
      width,
      height,
    }));
  }, []);

  const stageMouseUp = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      if (!selectionStartRef.current) return;

      const stage = e.target.getStage();
      if (!stage) return;

      const { x, y, width, height } = selectionRectRef.current;
      const selectionBox = { x, y, width, height };

      const selectedIds: string[] = [];

      stage.find(".selectable").forEach((node) => {
        const box = node.getClientRect({ relativeTo: stage });

        if (Konva.Util.haveIntersection(selectionBox, box)) {
          const id = node.id();
          if (id) selectedIds.push(id);
        }
      });

      dispatch(setSelectedElements(selectedIds));

      selectionStartRef.current = null;
      setSelectionRect((prev) => ({
        ...prev,
        visible: false,
        width: 0,
        height: 0,
      }));
      setIsSelecting(false);
    },
    [dispatch]
  );

  return {
    isSelecting,
    selectionRect,
    stageMouseDown,
    stageMouseMove,
    stageMouseUp,
  };
};
