import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
	deleteProjectItemsApi,
	updateProjectApi,
} from "../../../api/projectsApi";
import { v4 as uuidv4 } from "uuid";

type Position = {
	x: number;
	y: number;
};

type Size = {
	width: number;
	height: number;
};

type Typography = {
	align: string;
	fontFamily: string;
	fontSize: number;
	fontStyle: string;
	fontWeight: { key: string; label: string; value: string };
	lineHeight: number;
	letterSpacing: number;
};

type TextValue = {
	name: string;
	size: Size;
	position: Position;
	text: string;
	typography: Typography;
	color: string;
	rotation: number;
	vertical: number;
	horizontal: number;
	underline: boolean;
};

type TemplateValue = {
	name: string;
	size: Size;
	position: Position;
	scale: number;
};

export interface Text {
	id: string;
	type: string;
	locked: boolean;
	display: boolean;
	value: TextValue;
}

export interface Template {
	id: string;
	type: string;
	locked: boolean;
	display: boolean;
	value: TemplateValue;
}

export interface State {
	texts: Text[];
	templates: Template[];
	activeElement: string | null;
	scale: number;
	stagePosition: { x: number; y: number };
	selectedElements: string[];
	copiedElements: string[];
}

const initialState: State = {
	texts: [],
	templates: [],
	activeElement: null,
	scale: 1,
	stagePosition: { x: 0, y: 0 },
	selectedElements: [],
	copiedElements: [],
};

const generator = createSlice({
	name: "generator",
	initialState,
	reducers: {
		setTexts: (state, action: PayloadAction<Text[]>) => {
			state.texts = action.payload;
		},
		setTemplates: (state, action: PayloadAction<Template[]>) => {
			state.templates = action.payload;
		},

		setNewTemplateObject: (state, action: PayloadAction<Template>) => {
			state.templates.push(action.payload);
		},

		setNewTextObject: (state, action: PayloadAction<Text>) => {
			state.texts.push(action.payload);
		},

		updateTextValue: (
			state,
			action: PayloadAction<{ id: string; value: Text["value"] }>
		) => {
			const { id, value } = action.payload;

			const allowed: Partial<Text["value"]> = {
				typography: value.typography,
				color: value.color,
				underline: value.underline,

				vertical: value.vertical,
				horizontal: value.horizontal,

				rotation: value.rotation,
				size: value.size,
			};

			if (state.selectedElements.length > 1) {
				state.selectedElements.forEach((elementId) => {
					const txt = state.texts.find((t) => t.id === elementId);
					if (!txt) return;

					txt.value = {
						...txt.value,
						...allowed,
						typography: allowed.typography
							? { ...txt.value.typography, ...allowed.typography }
							: txt.value.typography,
					};
				});
				return;
			}

			const txt = state.texts.find((t) => t.id === id);
			if (txt) {
				txt.value = {
					...txt.value,
					...allowed,
					typography: allowed.typography
						? { ...txt.value.typography, ...allowed.typography }
						: txt.value.typography,
				};
			}
		},

		setSelectedElements: (state, action: PayloadAction<string[]>) => {
			state.selectedElements = action.payload;
		},

		updateTemplateValue: (
			state,
			action: PayloadAction<{ id: string; value: Template["value"] }>
		) => {
			const { id, value } = action.payload;
			const tmpl = state.templates.find((t) => t.id === id);
			if (tmpl) {
				tmpl.value = value;
			}
		},

		updateTextPosition: (
			state,
			action: PayloadAction<{ id: string; x: number; y: number }>
		) => {
			const { id, x, y } = action.payload;
			const txt = state.texts.find((t) => t.id === id);
			if (txt) {
				txt.value.position = { x, y };
			}
		},

		updateTemplatePosition: (
			state,
			action: PayloadAction<{ id: string; x: number; y: number }>
		) => {
			const { id, x, y } = action.payload;
			const tmpl = state.templates.find((t) => t.id === id);
			if (tmpl) {
				tmpl.value.position = { x, y };
			}
		},
		updateTextRotation: (
			state,
			action: PayloadAction<{ id: string; rotation: number }>
		) => {
			const { id, rotation } = action.payload;
			const txt = state.texts.find((t) => t.id === id);
			if (txt) {
				if (rotation < 0) {
					txt.value.rotation = parseFloat((360 + rotation).toFixed(2));
				} else {
					txt.value.rotation = parseFloat(rotation.toFixed(2));
				}
			}
		},

		updateTextContainerSize: (
			state,
			action: PayloadAction<{ id: string; width: number; height: number }>
		) => {
			const { id, width, height } = action.payload;
			const txt = state.texts.find((t) => t.id === id);
			if (txt) {
				txt.value.size = { width, height };
			}
		},

		deleteElement: (state, action: PayloadAction<string[]>) => {
			const selectedElements = action.payload;

			state.texts = state.texts.filter(
				(item) => !selectedElements.includes(item.id)
			);

			state.templates = state.templates.filter(
				(item) => !selectedElements.includes(item.id)
			);

			state.selectedElements = [];
		},
		updateElementName: (
			state,
			action: PayloadAction<{
				id: string;
				type: string;
				name: string;
			}>
		) => {
			const { id, type, name } = action.payload;

			if (type === "template") {
				const idx = state.templates.findIndex((item) => item.id === id);
				if (idx !== -1) {
					state.templates[idx].value.name = name;
				}
			} else {
				const idx = state.texts.findIndex((item) => item.id === id);
				if (idx !== -1) {
					state.texts[idx].value.name = name;
				}
			}
		},

		toogleBlockElement: (
			state,
			action: PayloadAction<{
				id: string;
				type: string;
			}>
		) => {
			const { id, type } = action.payload;
			if (type === "template") {
				const idx = state.templates.findIndex((item) => item.id === id);
				if (idx !== -1) {
					state.templates[idx].locked = !state.templates[idx].locked;
				}
			} else {
				const idx = state.texts.findIndex((item) => item.id === id);
				if (idx !== -1) {
					state.texts[idx].locked = !state.texts[idx].locked;
				}
			}
		},

		toogleHideElement: (
			state,
			action: PayloadAction<{
				id: string;
				type: string;
			}>
		) => {
			const { id, type } = action.payload;
			if (type === "template") {
				const idx = state.templates.findIndex((item) => item.id === id);
				if (idx !== -1) {
					state.templates[idx].display = !state.templates[idx].display;
				}
			} else {
				const idx = state.texts.findIndex((item) => item.id === id);
				if (idx !== -1) {
					state.texts[idx].display = !state.texts[idx].display;
				}
			}
		},
		setActiveElement: (state, action: PayloadAction<string | null>) => {
			state.activeElement = action.payload;
		},
		setProjectScale: (state, action: PayloadAction<number>) => {
			state.scale = action.payload;
		},
		setStagePosition: (
			state,
			action: PayloadAction<{ x: number; y: number }>
		) => {
			state.stagePosition = action.payload;
		},

		moveCanvas(
			state,
			action: PayloadAction<{ id: string; dx: number; dy: number }>
		) {
			const { id, dx, dy } = action.payload;

			const text = state.texts.find((t) => t.id === id);
			if (text) {
				text.value.position.x += dx;
				text.value.position.y += dy;
				return;
			}

			const template = state.templates.find((t) => t.id === id);
			if (template) {
				template.value.position.x += dx;
				template.value.position.y += dy;
			}
		},
		saveProject: (state, action: PayloadAction<{ id: string }>) => {
			const { id } = action.payload;
			updateProjectApi(id, state.texts, state.templates);
		},

		deleteProjectItems: (state, action: PayloadAction<{ id: string }>) => {
			const { id } = action.payload;
			deleteProjectItemsApi(id, state.selectedElements);
			state.texts = state.texts.filter(
				(item) => !state.selectedElements.includes(item.id)
			);

			state.templates = state.templates.filter(
				(item) => !state.selectedElements.includes(item.id)
			);

			state.selectedElements = [];
		},
		selectAllElements: (state) => {
			const allElementIds = [
				...state.texts.map((text) => text.id),
				...state.templates.map((template) => template.id),
			];
			state.selectedElements = allElementIds;
		},
		lockElements: (state) => {
			state.selectedElements.forEach((id) => {
				const text = state.texts.find((t) => t.id === id);
				if (text) {
					text.locked = true;
					return;
				}
				const template = state.templates.find((t) => t.id === id);
				if (template) {
					template.locked = true;
				}
			});
		},
		updateActiveTextStyle: (state, action: PayloadAction<number>) => {
			const fontSize = action.payload;

			state.texts.forEach((text) => {
				if (state.selectedElements.includes(text.id)) {
					text.value.typography.fontSize = fontSize;
				}
			});
		},
		setCanvaIndex(state, action: PayloadAction<number>) {
			const dir = Math.sign(action.payload);
			if (!dir) return;

			const selected = new Set(state.selectedElements);

			if (dir > 0) {
				// move "down" in array (index + 1) — iteruj od końca
				for (let i = state.texts.length - 2; i >= 0; i--) {
					if (
						selected.has(state.texts[i].id) &&
						!selected.has(state.texts[i + 1].id)
					) {
						[state.texts[i], state.texts[i + 1]] = [
							state.texts[i + 1],
							state.texts[i],
						];
					}
				}
			} else {
				for (let i = 1; i < state.texts.length; i++) {
					if (
						selected.has(state.texts[i].id) &&
						!selected.has(state.texts[i - 1].id)
					) {
						[state.texts[i], state.texts[i - 1]] = [
							state.texts[i - 1],
							state.texts[i],
						];
					}
				}
			}
		},

		copyElements: (state) => {
			state.copiedElements = [...state.selectedElements];
		},

		pasteElements: (state) => {
			const newTexts: Text[] = [];
			const newTemplates: Template[] = [];
			const idMap: Record<string, string> = {};

			state.copiedElements.forEach((id) => {
				const text = state.texts.find((t) => t.id === id);
				if (text) {
					const newId = `Text-${uuidv4()}`;
					idMap[id] = newId;
					newTexts.push({
						...text,
						id: newId,
						value: {
							...text.value,
							position: {
								x: text.value.position.x + 10,
								y: text.value.position.y + 10,
							},
						},
					});
					return;
				}
				const template = state.templates.find((t) => t.id === id);
				if (template) {
					const newId = `Template-${uuidv4()}`;
					idMap[id] = newId;
					newTemplates.push({
						...template,
						id: newId,
						value: {
							...template.value,
							position: {
								x: template.value.position.x + 10,
								y: template.value.position.y + 10,
							},
						},
					});
				}
			});

			state.texts.push(...newTexts);
			state.templates.push(...newTemplates);
			state.selectedElements = Object.values(idMap);
		},

		setUnderline: (state) => {
			state.texts.forEach((text) => {
				if (state.selectedElements.includes(text.id)) {
					text.value.underline = !text.value.underline;
				}
			});
		},

		moveSelectedElements: (
			state,
			action: PayloadAction<{ dx: number; dy: number }>
		) => {
			const { dx, dy } = action.payload;

			state.selectedElements.forEach((id) => {
				const txt = state.texts.find((x) => x.id === id);
				if (txt) {
					txt.value.position.x += dx;
					txt.value.position.y += dy;
					return;
				}

				const tpl = state.templates.find((t) => t.id === id);
				if (tpl) {
					tpl.value.position.x += dx;
					tpl.value.position.y += dy;
				}
			});
		},
	},
});

export const {
	setTexts,
	setTemplates,
	setNewTextObject,
	setNewTemplateObject,
	updateTextValue,
	updateTemplateValue,
	updateTextPosition,
	updateTemplatePosition,
	updateTextRotation,
	updateTextContainerSize,
	deleteElement,
	updateElementName,
	toogleBlockElement,
	toogleHideElement,
	setActiveElement,
	setProjectScale,
	setStagePosition,
	moveCanvas,
	setSelectedElements,
	saveProject,
	deleteProjectItems,
	selectAllElements,
	lockElements,
	updateActiveTextStyle,
	setCanvaIndex,
	copyElements,
	pasteElements,
	setUnderline,
	moveSelectedElements,
} = generator.actions;
export default generator.reducer;
