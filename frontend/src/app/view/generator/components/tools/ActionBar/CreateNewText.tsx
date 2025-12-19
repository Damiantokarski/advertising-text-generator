import { IconButton } from "../../../../../ui/IconButton";
import { useCreateText } from "../../../hooks/useCreateText";

export const CreateNewText = () => {
	const addText = useCreateText();

	const handleNewText = () => addText();

	return (
		<IconButton
			icon="text"
			text="Add Text"
			className="text-lg"
			onClick={handleNewText}
			tooltipPosition="right"
			tooltipOffsetClass="mt-3"
		/>
	);
};
