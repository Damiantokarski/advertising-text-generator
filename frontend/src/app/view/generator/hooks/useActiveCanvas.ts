import { useCallback, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import type { RootState } from "../../../store/store";
import { updateTemplateValue, updateTextValue, type Template, type Text } from "../../../store/slices/generator";


export function useUpdateTemplate() {
	return useActiveCanvas<Template, Template["value"]>(
		(s) => s.generator.templates,
		updateTemplateValue
	);
}

export function useUpdateText() {
	return useActiveCanvas<Text, Text["value"]>(
		(s) => s.generator.texts,
		updateTextValue
	);
}

function useActiveCanvas<
	Item extends { id: string; value: Value },
	Value extends object
>(
	selectList: (state: RootState) => Item[],
	updateAction: ActionCreatorWithPayload<{ id: string; value: Value }>
) {
	
	const dispatch = useDispatch();

	const activeItem = useSelector((state: RootState) => {
		const list = selectList(state);
		return list.find((it) => it.id === state.generator.activeElement);
	}, shallowEqual);

	const id = activeItem?.id ?? null;
	const value = activeItem?.value ?? null;
	const disabled = !activeItem;

	const updateValue = useCallback(
		(partial: Partial<Value>) => {
			if (!id || !value) return;
			dispatch(updateAction({ id, value: { ...value, ...partial } }));
		},
		[dispatch, id, value, updateAction]
	);

	return useMemo(
		() => ({ id, value, updateValue, disabled }),
		[id, value, updateValue, disabled]
	);
}
