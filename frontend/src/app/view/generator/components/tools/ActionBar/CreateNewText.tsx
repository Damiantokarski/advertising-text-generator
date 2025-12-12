import { Icon } from "../../../../../ui/Icon";
import { useCreateText } from "../../../hooks/useCreateText";

export const CreateNewText = () => {
	const addText = useCreateText();

	return (
		<button onClick={() => addText()} className="cursor-pointer">
			<Icon type="text" className="text-lg" />
		</button>
	);
};
