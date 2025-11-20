interface SelectOptionProps {
  label: string;
  value: string | number;
  isSelected: boolean;
  onClick: () => void;
}

export function SelectOption({
  label,
  value,
  isSelected,
  onClick,
}: SelectOptionProps) {
  return (
    <div
      onClick={onClick}
      className={`
        px-3 py-1 cursor-pointer w-full rounded 
        ${isSelected ? " bg-primary-blue-sky text-surface" : "hover:bg-primary-blue-sky/20"}
      `}
      data-value={value}
    >
      {label}
    </div>
  );
}
