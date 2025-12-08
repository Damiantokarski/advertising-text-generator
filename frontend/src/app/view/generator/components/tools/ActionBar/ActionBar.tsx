import { AddPsdFile } from "./AddPsdFile";
import { CreateNewText } from "./CreateNewText";
import { DeleteElement } from "./DeleteElement";
import { CreateNewTemplate } from "./NewTemplate/CreateNewTemplate";
import { SaveProject } from "./SaveProject";
import { StageScale } from "./StageScale";

export interface ToolsProps {
	scale: number;
	onChange: (newScale: number) => void;
}

export const ActionBar = ({ scale, onChange }: ToolsProps) => {
	return (
		<section className="fixed top-0 left-76 flex  items-center justify-between gap-4 p-4 shadow  bg-surface m-4 rounded-sm  w-full max-w-[calc(100%-640px)]">
			<div className="flex items-center gap-4 justify-center">
				<CreateNewText />
				<CreateNewTemplate />
				<AddPsdFile />
				<div className="flex gap-4 items-center justify-center">
					<SaveProject />
					<DeleteElement />
				</div>
			</div>

			<StageScale
				scale={scale}
				onChange={onChange}
				minScale={0.1}
				maxScale={10}
				step={0.1}
			/>
		</section>
	);
};
