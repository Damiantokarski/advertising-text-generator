import { useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import { Icon } from "../../../../../ui/Icon";
import type { RootState } from "../../../../../store/store";
import { updateProjectApi } from "../../../../../../api/projectsApi";

export const SaveProject = () => {
	const { id } = useParams();
	const texts = useSelector((state: RootState) => state.generator.texts);
	const templates = useSelector((state: RootState) => state.generator.templates);

	const handleSaveProjectElements = async () => {
		if (!id) return;
		await updateProjectApi(id, texts, templates);
	};

	return (
		<button onClick={handleSaveProjectElements} className="cursor-pointer">
			<Icon
				type="floppyDisk"
				className="text-secondary-light text-lg text-primary-blue"
			/>
		</button>
	);
};
