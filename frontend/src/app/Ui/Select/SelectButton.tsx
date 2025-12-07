import { Icon } from "../Icon";

interface SelectButtonProps {
	value?: string;
	placeholder: string;
	disabled: boolean;
	onClick: () => void;
	small?: boolean;
}

export const SelectButton = ({
	onClick,
	value,
	placeholder,
	disabled,
	small = false,
}: SelectButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`flex justify-start px-2 py-2 rounded w-full bg-surface border border-primary-blue text-black text-tiny disabled:opacity-60 ${small ? "text-xs py-1" : "min-h-10"}`}
		>
			<div className="flex justify-between w-full items-center">
				{value ? (
					<span>{value}</span>
				) : (
					<span className="text-gray-400">{placeholder}</span>
				)}
				<Icon type="arrowDown" className="text-tiny text-black" />
			</div>
		</button>
	);
};
