import { type ReactNode } from "react";

interface InputLabelProps {
  children: ReactNode;
}
export const InputLabel = ({ children }: InputLabelProps) => (
  <span className="text-extralight text-xs mb-1 block">{children}</span>
);
