import { TEMPLATES } from "../../../../../../const/templates";
import List from "../../../../../../ui/List/List";
import ListItem from "../../../../../../ui/List/ListItem";
import { useCreateTemplate } from "../../../../hooks/useCreateTemplate";


export interface TemplateListProps {
	onChooseElement: () => void;
}

export interface TemplateLayerData {
	id: string;
	name: string;
	width: number;
	height: number;
}

export const TemplateList = ({ onChooseElement }: TemplateListProps) => {
	const createTemplate = useCreateTemplate();

	const handleAddTemplate = (template: TemplateLayerData) => {
		createTemplate(template);
		onChooseElement();
	};

	return (
		<div className="px-4 py-4 bg-surface shadow rounded-lg z-1000 fixed left-100 top-4 text-tiny max-w-48 space-y-1 border-2 border-primary-blue-sky">
			<List className="w-full max-h-64 overflow-auto hidden-scrollbar flex flex-col items-start">
				{TEMPLATES.map((template: TemplateLayerData) => (
					<ListItem key={template.id}>
						<button
							onClick={() => handleAddTemplate(template)}
							className="text-xs py-1 rounded-sm  flex justify-start p-2 w-full cursor-pointer"
						>
							{template.name}
						</button>
					</ListItem>
				))}
			</List>
		</div>
	);
};
