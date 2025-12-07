import { memo } from "react";
import { ElementItem } from "./ElementItem";
import List from "../../../../../ui/List/List";
import ListItem from "../../../../../ui/List/ListItem";



export interface ElementsListProps {
	ids: string[];
	type: string;
}

export const ElementsList = memo(({ ids, type }: ElementsListProps) => {
	return (
		<List className="flex flex-col gap-1 overflow-auto hidden-scrollbar">
			{ids.map((id) => (
				<ListItem key={id}>
					<ElementItem id={id} type={type} />
				</ListItem>
			))}
		</List>
	);
});
ElementsList.displayName = "ElementsList";
