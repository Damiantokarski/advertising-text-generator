import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../../../../../store/store";
import { updateProjectApi } from "../../../../../../api/projectsApi";
import { IconButton } from "../../../../../ui/IconButton";

export const SaveProject = () => {
	const { id } = useParams();
	const texts = useSelector((state: RootState) => state.generator.texts);
	const templates = useSelector((state: RootState) => state.generator.templates);

	const handleSaveProjectElements = async () => {
		if (!id) return;
		await updateProjectApi(id, texts, templates);
	};

	return (
		<IconButton
			icon="save"
			text="Save"
			className="text-lg text-primary-blue"
			onClick={handleSaveProjectElements}
			tooltipPosition="right"
			tooltipOffsetClass="mt-3"
		/>
	);
};
