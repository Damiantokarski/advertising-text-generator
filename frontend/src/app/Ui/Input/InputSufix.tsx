import clsx from "clsx";
import { type ReactNode } from "react";

interface InputSuffixProps {
  children: ReactNode;
  rotated?: boolean;
}

export const InputSuffix = ({
  children,
  rotated = false,
}: InputSuffixProps) => (
  <span
    className={clsx(
      "text-xs flex items-center ml-auto transition-transform duration-200",
      rotated ? "rotate-180" : "rotate-0"
    )}
  >
    {children}
  </span>
);
