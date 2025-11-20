import { type InputHTMLAttributes } from "react";

interface InputFieldProps {
	props: InputHTMLAttributes<HTMLInputElement>;
}

export const InputField = ({ props }: InputFieldProps) => (
	<input {...props} className="outline-none w-full bg-transparent " />
);
