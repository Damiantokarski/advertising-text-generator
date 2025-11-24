import List from "../List/List";
import ListItem from "../List/ListItem";
import { SelectOption } from "./SelectOption";


interface SelectOptionListProps {
	options: string[];
	selected?: string;
	onSelect: (option: string) => void;
}

export const SelectOptionList = ({
	options,
	selected,
	onSelect,
}: SelectOptionListProps) => {
	return (
		<div className="absolute left-0 mt-1 w-full bg-surface shadow rounded-sm z-50 text-tiny max-h-64 border border-primary-blue-sky">
			<List className="w-full max-h-64 overflow-auto hidden-scrollbar flex flex-col items-start">
				{options.map((option) => (
					<ListItem key={option} className="w-full">
						<SelectOption
							onClick={() => onSelect(option)}
							isSelected={option === selected}
							value={option}
						/>
					</ListItem>
				))}
			</List>
		</div>
	);
};
