// components/FormField.tsx
// components/FormField.tsx
import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { FormLabel } from "../FormLabel";
import { FormError } from "../FormError";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
	className?: string
	register: UseFormRegisterReturn;
	id: string;
	required?: boolean;
}

export const FormInput = ({
	label,
	error,
	register,
	className,
	id,
	required = false,
	...inputProps
}: FormInputProps) => (
	<div className={`flex flex-col space-y-1  ${className}`}>
		<FormLabel id={id} label={label} required={required} />
		<input
			id={id}
			aria-invalid={!!error}
			aria-describedby={error ? `${id}-error` : undefined}
			{...register}
			{...inputProps}
			className={[
				"px-3 py-2 rounded focus:outline-none text-primary-text text-sm border border-primary-blue-sky",
				error ? "border-fire" : "",
				"focus:border-info",
			].join(" ")}
		/>
		{error && <FormError id={id} error={error} />}
	</div>
);
