interface SelectOptionProps {
	value: string;
	isSelected: boolean;
	onClick: () => void;
}

export const SelectOption = ({
	value,
	isSelected,
	onClick,
}: SelectOptionProps) => {
	return (
		<div
			onClick={onClick}
			className={`
        px-3 py-1 cursor-pointer w-full  
        ${isSelected ? "bg-primary-blue-sky text-white dark:bg-primary-blue-hover" : "hover:bg-primary-blue-sky/20"}
      `}
		>
			{value}
		</div>
	);
};
