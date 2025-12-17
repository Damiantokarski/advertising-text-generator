import { Link } from "react-router-dom";
import { AddPsdFile } from "./AddPsdFile";
import { CanvaIndex } from "./CanvaIndex";
import { CreateNewText } from "./CreateNewText";
import { DeleteElement } from "./DeleteElement";
import { Headers } from "./Headers";
import { CreateNewTemplate } from "./NewTemplate/CreateNewTemplate";
import { SaveProject } from "./SaveProject";
import { StageScale } from "./StageScale";
import { Underline } from "./Underline";
import { Icon } from "../../../../../ui/Icon";
import { useAuth } from "../../../../../hooks/useAuth";

export interface ToolsProps {
	scale: number;
	onChange: (newScale: number) => void;
	barsState: {
		isSettingsBarOpen: boolean;
		isItemsBarOpen: boolean;
	};
}

export const ActionBar = ({ scale, onChange, barsState }: ToolsProps) => {
	const { isItemsBarOpen, isSettingsBarOpen } = barsState;
	const { logout } = useAuth();

	let maxWidth = "max-w-[calc(100%-113px)]";

	if (
		(isItemsBarOpen && !isSettingsBarOpen) ||
		(!isItemsBarOpen && isSettingsBarOpen)
	) {
		maxWidth = "max-w-[calc(100%-377px)]";
	} else if (isItemsBarOpen && isSettingsBarOpen) {
		maxWidth = "max-w-[calc(100%-640px)]";
	}

	const left = isItemsBarOpen ? "left-76" : "left-10";

	return (
		<section
			className={`fixed top-0 flex  items-center justify-between gap-4 p-4 shadow  bg-surface m-4 rounded-sm w-full  transition-all ${left} ${maxWidth}`}
		>
			<div className="flex items-center gap-10 justify-center">
				<Link to="/" className="cursor-pointer">
					<Icon type="homeMove" className="text-lg " />
				</Link>
				<button onClick={logout} className="cursor-pointer">
					<Icon type="logout" className="text-secondary-light text-lg" />
				</button>
				<div className="flex gap-4 items-center">
					<CreateNewText />
					<Underline />
				</div>
				<Headers />
				<CreateNewTemplate />
				<CanvaIndex />
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
