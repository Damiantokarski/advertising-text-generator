import { useDispatch } from "react-redux";
import { Icon } from "../../../../../ui/Icon";
import { setUnderline } from "../../../../../store/slices/generator";

export const Underline = () => {
	const dispatch = useDispatch();

	const handleUnderline = () => {
		dispatch(setUnderline());
	};
	return (
		<button className="cursor-pointer" onClick={handleUnderline}>
			<Icon type="textUnderline" className="text-lg" />
		</button>
	);
};
