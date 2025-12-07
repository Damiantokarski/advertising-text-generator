import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { Icon } from "../../../../../ui/Icon";
import type { RootState } from "../../../../../store/store";
import { deleteElement } from "../../../../../store/slices/generator";


export const DeleteElement = () => {
	const dispatch = useDispatch();
	
	const activeElementId = useSelector(
		(state: RootState) => state.generator.activeElement
	);

	const handleDelete = useCallback(() => {
		if (activeElementId) dispatch(deleteElement({ id: activeElementId }));
	}, [activeElementId, dispatch]);

	return (
		<button onClick={handleDelete} className="cursor-pointer">
			<Icon type="trash" className="text-secondary-light text-lg text-fire"  />
		</button>
	);
};
