import { useDispatch } from "react-redux";
import { setCanvaIndex } from "../../../../../store/slices/generator";
import { IconButton } from "../../../../../ui/IconButton";

export const CanvaIndex = () => {
	const dispatch = useDispatch();

	const handleCanvaIndex = (index: number) => {
		dispatch(setCanvaIndex(index));
	};

	return (
		<div className="flex gap-4 items-center">
			<IconButton
				icon="stackPop"
				text="Move Up"
				className="text-lg dark:text-white"
				onClick={() => handleCanvaIndex(1)}
				tooltipPosition="right"
				tooltipOffsetClass="mt-3"
			/>
			<IconButton
				icon="stackPush"
				text="Move Down"
				className="text-lg dark:text-white"
				onClick={() => handleCanvaIndex(-1)}
				tooltipPosition="right"
				tooltipOffsetClass="mt-3"
			/>
		</div>
	);
};
