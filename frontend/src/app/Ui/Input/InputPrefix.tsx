import { type ReactNode } from "react";

interface InputPrefixProps {
  children: ReactNode;
}
export const InputPrefix = ({ children }: InputPrefixProps) => (
  <span className="flex items-center dark:text-white">{children}</span>
);
