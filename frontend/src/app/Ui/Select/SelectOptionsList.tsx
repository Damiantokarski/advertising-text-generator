import List from "../List/List";
import ListItem from "../List/ListItem";
import { SelectOption } from "./SelectOption";

interface SelectOptionListProps<T> {
	options: T[];
	selected?: T;
	onSelect: (option: T) => void;
	getOptionLabel: (option: T) => string;
	getOptionValue: (option: T) => string | number;
}

export function SelectOptionList<T>({
	options,
	selected,
	onSelect,
	getOptionLabel,
	getOptionValue,
}: SelectOptionListProps<T>) {
	return (
		<div className="px-4 py-4 bg-surface shadow rounded-lg z-1000 fixed right-80 -mt-7 text-tiny max-w-48 space-y-1 border-2 border-primary-blue-sky">
			<List className="w-full max-h-64 overflow-auto hidden-scrollbar flex flex-col items-start">
				{options.map((option) => (
					<ListItem key={getOptionValue(option)}>
						<SelectOption
							isSelected={
								!!(
									selected &&
									getOptionValue(option) === getOptionValue(selected)
								)
							}
							onClick={() => onSelect(option)}
							label={getOptionLabel(option)}
							value={getOptionValue(option)}
						/>
					</ListItem>
				))}
			</List>
		</div>
	);
}
