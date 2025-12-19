import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import type { RootState } from "../../../../../store/store";
import { deleteElement } from "../../../../../store/slices/generator";
import { deleteProjectItemsApi } from "../../../../../../api/projectsApi";
import { useParams } from "react-router-dom";
import { IconButton } from "../../../../../ui/IconButton";

export const DeleteElement = () => {
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>();

	const selectedElements = useSelector(
		(state: RootState) => state.generator.selectedElements
	);

	const handleDelete = useCallback(() => {
		if (id && selectedElements.length > 0) {
			deleteProjectItemsApi(id, selectedElements);
			dispatch(deleteElement(selectedElements));
		}
	}, [selectedElements, id, dispatch]);

	return (
		<IconButton
			icon="trash"
			text="Delete"
			className="text-lg text-fire"
			onClick={handleDelete}
			tooltipPosition="right"
			tooltipOffsetClass="mt-3"
		/>
	);
};
