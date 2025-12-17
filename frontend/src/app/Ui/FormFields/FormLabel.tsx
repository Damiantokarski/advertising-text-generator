interface FormLabelProps {
	id: string;
	label?: string;
	required?: boolean;
	className?: string;
}

export const FormLabel = ({
	id,
	label,
	required,
	className,
}: FormLabelProps) => (
	<label htmlFor={id} className={`text-xs text-sec ${className}`}>
		{label}
		{required && (
			<span aria-hidden="true" className="text-fire ml-1">
				*
			</span>
		)}
	</label>
);
