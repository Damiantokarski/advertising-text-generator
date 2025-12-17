
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isSubmitting?: boolean;
    type?: "button" | "submit" | "reset";
    children?: ReactNode;
}

export const AuthButton = ({
    isSubmitting,
    type,
    children,
    ...props
}: ButtonProps) => {

    return (
        <button
            type={type}
            className="bg-primary-blue text-surface w-full py-2 px-8 shadow rounded-sm cursor-pointer hover:bg-primary-blue-hover transition-colors mt-4"
            {...props}
        >
            {isSubmitting ? "Loading..." : children ?? "Log in"}
        </button>
    )
}
