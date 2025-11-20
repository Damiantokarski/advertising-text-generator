import { useState, useRef } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { SelectButton } from "./SelectButton";
import { SelectOptionList } from "./SelectOptionsList";

interface SelectProps<T> {
	optionsList: T[];
	selected?: T;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	onChange: (option: T) => void;
	getOptionLabel: (option: T) => string;
	getOptionValue: (option: T) => string | number;
}

export function Select<T>({
	optionsList,
	selected,
	onChange,
	getOptionLabel,
	getOptionValue,
	placeholder = "Wybierz…",
	disabled = false,
	className,
}: SelectProps<T>) {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const toggleDropdown = () => {
		if (!disabled) setIsOpen((prev) => !prev);
	};

	const closeDropdown = () => setIsOpen(false);

	const shouldShowOptions = isOpen && !disabled && optionsList.length > 0;

	useClickOutside(ref, closeDropdown);

	return (
		<div ref={ref} className={`relative w-full ${className}`}>
			<SelectButton
				onClick={toggleDropdown}
				selected={selected}
				getOptionLabel={getOptionLabel}
				placeholder={placeholder}
				disabled={disabled}
			/>

			{shouldShowOptions && (
				<SelectOptionList
					options={optionsList}
					selected={selected}
					onSelect={(option) => {
						onChange(option);
						closeDropdown();
					}}
					getOptionLabel={getOptionLabel}
					getOptionValue={getOptionValue}
				/>
			)}
		</div>
	);
}
