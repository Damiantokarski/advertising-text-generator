// utils/snapLines.ts
type Position = { x: number; y: number };

export type SnapElement = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const SNAP_THRESHOLD = 5;

const getLines = (el: SnapElement) => {
  const left = el.x;
  const centerX = el.x + el.width / 2;
  const right = el.x + el.width;

  const top = el.y;
  const centerY = el.y + el.height / 2;
  const bottom = el.y + el.height;

  return {
    vertical: [left, centerX, right],
    horizontal: [top, centerY, bottom],
  };
};

// pomocnicze: znajdujemy wartość z najbliższą linią + zwracamy "value po snapie"
const findSnapped = (value: number, lines: number[]): number => {
  let snapped = value;
  let minDiff = SNAP_THRESHOLD + 1;

  for (const line of lines) {
    const diff = Math.abs(value - line);
    if (diff <= SNAP_THRESHOLD && diff < minDiff) {
      minDiff = diff;
      snapped = line;
    }
  }

  return snapped;
};

export const snapLinesPosition = (
  activeId: string,
  elements: SnapElement[],
  nextPos: Position
): Position => {
  const active = elements.find((e) => e.id === activeId);
  if (!active) return nextPos;

  const others = elements.filter((e) => e.id !== activeId);

  const verticalLines: number[] = [];
  const horizontalLines: number[] = [];

  others.forEach((el) => {
    const { vertical, horizontal } = getLines(el);
    verticalLines.push(...vertical);
    horizontalLines.push(...horizontal);
  });

  // Pozycje krawędzi aktywnego elementu przy nextPos
  const nextLeft = nextPos.x;
  const nextCenterX = nextPos.x + active.width / 2;
  const nextRight = nextPos.x + active.width;

  const nextTop = nextPos.y;
  const nextCenterY = nextPos.y + active.height / 2;
  const nextBottom = nextPos.y + active.height;

  // Liczymy, jaką pozycję każda z krawędzi dostałaby po snapie
  const snappedLeft = findSnapped(nextLeft, verticalLines);
  const snappedCenterX = findSnapped(nextCenterX, verticalLines);
  const snappedRight = findSnapped(nextRight, verticalLines);

  const snappedTop = findSnapped(nextTop, horizontalLines);
  const snappedCenterY = findSnapped(nextCenterY, horizontalLines);
  const snappedBottom = findSnapped(nextBottom, horizontalLines);

  // Wybieramy "najlepszy" snap w osi X (ten z najmniejszym ruchem)
  const candidatesX = [
    { pos: snappedLeft, offset: 0 }, // lewa krawędź
    { pos: snappedCenterX - active.width / 2, offset: active.width / 2 }, // środek
    { pos: snappedRight - active.width, offset: active.width }, // prawa
  ];
  let finalX = nextPos.x;
  let bestDiffX = SNAP_THRESHOLD + 1;
  for (const c of candidatesX) {
    const diff = Math.abs(c.pos - nextPos.x);
    if (diff <= SNAP_THRESHOLD && diff < bestDiffX) {
      bestDiffX = diff;
      finalX = c.pos;
    }
  }

  // To samo w osi Y
  const candidatesY = [
    { pos: snappedTop, offset: 0 },
    { pos: snappedCenterY - active.height / 2, offset: active.height / 2 },
    { pos: snappedBottom - active.height, offset: active.height },
  ];
  let finalY = nextPos.y;
  let bestDiffY = SNAP_THRESHOLD + 1;
  for (const c of candidatesY) {
    const diff = Math.abs(c.pos - nextPos.y);
    if (diff <= SNAP_THRESHOLD && diff < bestDiffY) {
      bestDiffY = diff;
      finalY = c.pos;
    }
  }

  return {
    x: finalX,
    y: finalY,
  };
};
