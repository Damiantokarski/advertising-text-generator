import { memo, useCallback, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import {
	setSelectedElements,
	toogleBlockElement,
	toogleHideElement,
	updateElementName,
} from "../../../../../store/slices/generator";
import type { AppDispatch, RootState } from "../../../../../store/store";
import { Icon } from "../../../../../ui/Icon";

export interface ElementItemProps {
	id: string;
	type: string;
}

export const ElementItem = memo(({ id, type }: ElementItemProps) => {
	const { value, locked, display } = useSelector(
		(s: RootState) =>
			s.generator[type === "text" ? "texts" : "templates"].find(
				(el) => el.id === id
			)!,
		shallowEqual
	);

	const [editing, setEditing] = useState(false);
	const [val, setVal] = useState(value.name);

	const selectedElements = useSelector(
		(state: RootState) => state.generator.selectedElements
	);

	const dispatch = useDispatch<AppDispatch>();

	const onFocus = useCallback(() => {
		dispatch(setSelectedElements([id]));
	}, [dispatch, id]);

	const onDouble = useCallback(() => {
		setVal(value.name);
		setEditing(true);
	}, [value.name]);

	const onBlur = useCallback(() => {
		if (val.trim()) {
			dispatch(updateElementName({ id, type, name: val }));
		}
		setEditing(false);
	}, [dispatch, id, type, val]);

	const blockElement = useCallback(() => {
		dispatch(toogleBlockElement({ id, type }));
	}, [dispatch, id, type]);

	const hideElement = useCallback(() => {
		dispatch(toogleHideElement({ id, type }));
	}, [dispatch, id, type]);

	return (
		<div
			className={`relative flex justify-between items-center border px-2 rounded py-1 ${
				editing || selectedElements.includes(id)
					? "border-primary-blue"
					: "border-transparent"
			}`}
		>
			<button
				onClick={onFocus}
				onDoubleClick={onDouble}
				className="flex gap-2 justify-center items-center"
			>
				<Icon
					type={type === "template" ? "rectangle" : "text"}
					className="text-xs text-secondary-light"
				/>
				<input
					type="text"
					className="text-tiny outline-none bg-transparent max-w-32 cursor-pointer text-secondary-light truncate"
					value={editing ? val : value.name}
					readOnly={!editing}
					onChange={(e) => setVal(e.target.value)}
					onBlur={onBlur}
				/>
			</button>

			<div className="flex gap-1">
				<button onClick={blockElement}>
					<Icon
						type={locked ? "lockClosed" : "lockOpen"}
						className="text-xs text-secondary-light"
					/>
				</button>
				<button onClick={hideElement}>
					<Icon
						type={display ? "eye" : "eyeClosed"}
						className="text-xs text-secondary-light"
					/>
				</button>
			</div>
		</div>
	);
});

ElementItem.displayName = "ElementItem";
