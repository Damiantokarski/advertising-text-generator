import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { setProjectScale, setStagePosition, setTemplates, setTexts, type Template, type Text } from "../../../store/slices/generator";
import { getProjectApi } from "../../../../api/projectsApi";

export const useOnLoadProject = (projectId: string) => {
	const [projectJob, setProjectJob] = useState<string>("");
	const [projectName, setProjectName] = useState<string>("");
	const [projectTitle, setProjectTitle] = useState<string>("");

	const dispatch = useDispatch();

	useEffect(() => {
		if (!projectId) return;
		const load = async () => {
			try {
				const { project } = await getProjectApi(projectId);

				setProjectJob(project.job);
				setProjectName(project.name);
				setProjectTitle(project.title);

				dispatch(setProjectScale(project.projectSettings[0]?.scale / 100 || 1));

				dispatch(
					setStagePosition({
						x: project.projectSettings[0]?.positionX || 0,
						y: project.projectSettings[0]?.positionY || 0,
					})
				);

				dispatch(
					setTexts(
						project.texts.map((txt: Text ) => ({
							id: txt.id,
							name: txt.name,
							type: txt.type,
							locked: txt.locked,
							display: txt.display,
							value: {
								text: txt.value.text,
								position: txt.value.position,
								size: txt.value.size,
								typography: txt.value.typography,
								color: txt.value.color ?? "#b1b1b1",
								rotation: txt.value.rotation ?? 0,
								vertical: txt.value.vertical ?? 0,
								horizontal: txt.value.horizontal ?? 0,
							},
						}))
					)
				);

				dispatch(
					setTemplates(
						project.banners.map((tmpl: Template) => ({
							id: tmpl.id,
							name: tmpl.name,
							type: tmpl.type,
							locked: tmpl.locked,
							display: tmpl.display,
							value: {
								position: tmpl.value.position,
								size: tmpl.value.size,
								scale: tmpl.value.scale ?? 1,
							},
						}))
					)
				);
			} catch (error) {
				console.error("Error loading project:", error);
			}
		};

		load();
	}, [projectId, dispatch]);
	return { projectJob, projectName, projectTitle };
};
