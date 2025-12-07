import { useSelector } from "react-redux";

import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { Icon } from "../../../../../ui/Icon";
import type { RootState } from "../../../../../store/store";

export const SaveProject = () => {
	const { projectId } = useParams();
	const texts = useSelector((state: RootState) => state.generator.texts);
	const templates = useSelector((state: RootState) => state.generator.templates);

	const handleSaveProjectElements = useCallback(async () => {
		if (!projectId) {
			console.error("Brak projectId w URL");
			return;
		}
		console.log(texts, templates);
	}, [projectId, texts, templates]);

	return (
		<button onClick={handleSaveProjectElements} className="cursor-pointer">
			<Icon
				type="floppyDisk"
				className="text-secondary-light text-lg text-primary-blue"
			/>
		</button>
	);
};
