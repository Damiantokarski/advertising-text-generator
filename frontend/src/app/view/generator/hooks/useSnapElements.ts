// selectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../store/store";
import type { SnapElement } from "../../../utils/snapLines";

const selectGenerator = (state: RootState) => state.generator;

const selectSnapElements = createSelector(
	[selectGenerator],
	({ texts, templates }) => {
		const textElements: SnapElement[] = texts.map((t) => ({
			id: t.id,
			x: t.value.position.x,
			y: t.value.position.y,
			width: t.value.size.width,
			height: t.value.size.height,
		}));

		const templateElements: SnapElement[] = templates.map((t) => ({
			id: t.id,
			x: t.value.position.x,
			y: t.value.position.y,
			width: t.value.size.width * t.value.scale,
			height: t.value.size.height * t.value.scale,
		}));

		return [...textElements, ...templateElements];
	}
);

import { useSelector } from "react-redux";

export const useSnapElements = () => {
	return useSelector(selectSnapElements);
};
