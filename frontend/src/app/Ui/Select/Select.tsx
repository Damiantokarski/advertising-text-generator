import { useState, useRef, useEffect } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { SelectButton } from "./SelectButton";
import { SelectOptionList } from "./SelectOptionsList";
import { InputLabel } from "../Input/InputLabel";


interface SelectProps {
	optionsList: string[];
	defaultValue?: string;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	label?: string;
	onChange?: (option: string) => void;
	error?: string;
}

export const Select = ({
	optionsList,
	defaultValue,
	onChange,
	placeholder = "Wybierz…",
	disabled = false,
	label,
	className = "",
	error,
}: SelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState<string | undefined>(defaultValue);

	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setSelected(defaultValue);
	}, [defaultValue]);

	const toggleDropdown = () => {
		if (!disabled) setIsOpen((prev) => !prev);
	};

	const closeDropdown = () => setIsOpen(false);

	const shouldShowOptions = isOpen && !disabled && optionsList.length > 0;

	useClickOutside(ref, closeDropdown);

	const handleSelect = (option: string) => {
		setSelected(option);
		onChange?.(option);
		closeDropdown();
	};

	return (
		<div ref={ref} className={`relative w-full ${className}`}>
				{label && <InputLabel>{label}</InputLabel>}
			<SelectButton
				onClick={toggleDropdown}
				value={selected}
				placeholder={placeholder}
				disabled={disabled}
			/>

			{error && <p className="text-red-500 text-tiny mt-1">{error}</p>}

			{shouldShowOptions && (
				<SelectOptionList
					options={optionsList}
					selected={selected}
					onSelect={handleSelect}
				/>
			)}
		</div>
	);
};
