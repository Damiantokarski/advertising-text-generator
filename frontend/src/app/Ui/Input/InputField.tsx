import { type InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps {
	props: InputHTMLAttributes<HTMLInputElement>;
	register?: UseFormRegisterReturn;
}

export const InputField = ({ props, register }: InputFieldProps) => (
	<input
		{...props}
		{...register}
		className="outline-none w-full bg-transparent "
	/>
);
