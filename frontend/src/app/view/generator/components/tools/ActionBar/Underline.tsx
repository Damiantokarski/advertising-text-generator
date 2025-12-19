import { useDispatch } from "react-redux";
import { setUnderline } from "../../../../../store/slices/generator";
import { IconButton } from "../../../../../ui/IconButton";

export const Underline = () => {
	const dispatch = useDispatch();

	const handleUnderline = () => dispatch(setUnderline());

	return (
		<IconButton
			icon="textUnderline"
			text="Underline"
			className="text-lg"
			onClick={handleUnderline}
			tooltipPosition="right"
			tooltipOffsetClass="mt-3"
		/>
	);
};
