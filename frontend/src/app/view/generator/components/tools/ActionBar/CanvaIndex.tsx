import { useDispatch } from "react-redux";
import { Icon } from "../../../../../ui/Icon";
import { setCanvaIndex } from "../../../../../store/slices/generator";

export const CanvaIndex = () => {
	const dispatch = useDispatch();

	const handleCanvaIndex = (index: number) => {
		dispatch(setCanvaIndex(index));
	};

	return (
		<div className="flex gap-4 items-center">
			<button className="cursor-pointer" onClick={() => handleCanvaIndex(1)}>
				<Icon type="stackPop" className="text-lg" />
			</button>
			<button className="cursor-pointer" onClick={() => handleCanvaIndex(-1)}>
				<Icon type="stackPush" className="text-lg" />
			</button>
		</div>
	);
};
