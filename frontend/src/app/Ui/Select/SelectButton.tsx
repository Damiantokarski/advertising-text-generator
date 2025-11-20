import { Icon } from "../Icon";

interface SelectButtonProps<T> {
	selected?: T;
	placeholder: string;
	disabled: boolean;
	onClick: () => void;
	getOptionLabel: (option: T) => string;
}

export function SelectButton<T>({
	onClick,
	selected,
	getOptionLabel,
	placeholder,
	disabled,
}: SelectButtonProps<T>) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className="flex justify-start px-3 py-1 min-h-7 rounded w-full bg-surface border border-primary-blue-sky text-black text-tiny cursor-pointer"

		>
			<div className="flex justify-between w-full items-center">
				{selected ? (
					getOptionLabel(selected)
				) : (
					<span className="text-gray-400">{placeholder}</span>
				)}
				<Icon type="arrowDown" className="text-tiny text-black" />
			</div>
		</button>
	);
}
