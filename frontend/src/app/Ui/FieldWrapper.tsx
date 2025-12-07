import type { ReactNode, Ref } from "react";

interface FieldWrapperProps {
	children: ReactNode;
	title?: string;
	className?: string;
	wrapperClass?: string;
	ref?: Ref<HTMLDivElement> | undefined;
}

export const FieldWrapper = ({
	children,
	title,
	className,
	wrapperClass,
	ref,
}: FieldWrapperProps) => {
	return (
		<div className={`space-y-1 ${wrapperClass}`} ref={ref}>
			<span className="text-tiny font-semibold text-secondary-light">{title}</span>
			{className ? <div className={className}>{children}</div> : children}
		</div>
	);
};
