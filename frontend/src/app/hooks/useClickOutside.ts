import { useEffect, useRef, useCallback, type RefObject } from "react";

type ElementType = HTMLElement | null;
type CallbackType = () => void;
type RefType<T> = RefObject<T> | { current: T | null };

export const useClickOutside = <T extends ElementType>(
  ref: RefType<T>,
  callback: CallbackType
): void => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!(event.target instanceof Node)) {
        return;
      }

      const element = ref.current;
      if (!element) {
        return;
      }

      if (!element.contains(event.target)) {
        callbackRef.current();
      }
    },
    [ref]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [handleClick]);
};
