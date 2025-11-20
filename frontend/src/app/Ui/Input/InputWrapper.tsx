import { type ReactNode } from "react";

interface InputWrapperProps {
  id?: string;
  onClick?: () => void;
  children: ReactNode;
}

export const InputWrapper = ({ id, onClick, children }: InputWrapperProps) => (
  <label
    htmlFor={id}
    className="w-full flex-1 cursor-pointer"
    onClick={onClick}
  >
    {children}
  </label>
);
