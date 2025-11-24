import { type InputHTMLAttributes, type ReactNode, useState } from "react";
import { InputWrapper } from "./InputWrapper";
import { InputLabel } from "./InputLabel";
import { InputPrefix } from "./InputPrefix";
import { InputField } from "./InputField";
import { InputSuffix } from "./InputSufix";
import { cva } from "class-variance-authority";
import type {  UseFormRegisterReturn } from "react-hook-form";

type SizeVariant = "small" | "default" | "large";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	inputPrefix?: ReactNode;
	inputSuffix?: ReactNode;
	isClickable?: boolean;
	inputSize?: SizeVariant;
	error?: string;
	register?: UseFormRegisterReturn;
}

const variants = cva(
	"flex items-center gap-1 bg-surface border border-primary-blue-sky rounded px-3 w-full",
	{
		variants: {
			size: {
				small: "text-tiny py-1 px-3 min-h-7 min-w-20",
				default: "text-sm py-2 px-2 min-h-10",
				large: "text-base py-3 px-12 min-h-12",
			},
		},
		defaultVariants: {
			size: "default",
		},
	}
);

export const Input = ({
	label,
	inputPrefix,
	inputSuffix,
	isClickable = false,
	inputSize = "default",
	register,
	...props
}: InputProps) => {
	const [rotateSuffix, setRotateSuffix] = useState(false);

	const handleClick = () => {
		if (isClickable) {
			setRotateSuffix((prev) => !prev);
		}
	};

	return (
		<InputWrapper onClick={handleClick}>
			{label && <InputLabel>{label}</InputLabel>}
			<div className={variants({ size: inputSize })}>
				{inputPrefix && <InputPrefix>{inputPrefix}</InputPrefix>}
				<InputField props={props} register={register} />
				{inputSuffix && (
					<InputSuffix rotated={rotateSuffix}>{inputSuffix}</InputSuffix>
				)}
			</div>
		</InputWrapper>
	);
};
