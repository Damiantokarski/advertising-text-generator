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
		<section className="fixed top-0 left-0 flex flex-col items-center justify-between gap-4 p-4 shadow w-16 bg-surface m-4 rounded-lg h-[calc(100vh-32px)] border-2 border-primary-blue-sky">
			<div className="flex flex-col items-center gap-4 justify-center">
				<CreateNewText />
				<CreateNewTemplate />
				<AddPsdFile />
				<div className="mt-10 flex flex-col gap-4">
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
