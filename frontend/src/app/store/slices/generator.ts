import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { deleteProjectApi, updateProjectApi } from "../../../api/projectsApi";

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
}

const initialState: State = {
	texts: [],
	templates: [],
	activeElement: null,
	scale: 1,
	stagePosition: { x: 0, y: 0 },
	selectedElements: [],
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
			const txt = state.texts.find((t) => t.id === id);
			if (txt) {
				txt.value = value;
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
			deleteProjectApi(id, state.selectedElements);
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
} = generator.actions;
export default generator.reducer;
