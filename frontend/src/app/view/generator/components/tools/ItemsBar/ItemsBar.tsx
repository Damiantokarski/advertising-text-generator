import { shallowEqual, useSelector } from "react-redux";
import { ElementsList } from "./ElementsList";
import { FieldWrapper } from "../../../../../ui/FieldWrapper";
import { Title } from "../../../../../ui/Title";
import type { RootState } from "../../../../../store/store";
import { type Dispatch, type SetStateAction } from "react";
import { Icon } from "../../../../../ui/Icon";

interface ItemsBarProps {
	title: string;
	setBarsState: Dispatch<
		SetStateAction<{
			isSettingsBarOpen: boolean;
			isItemsBarOpen: boolean;
		}>
	>;
	isOpen?: boolean;
}

export const ItemsBar = ({ title, setBarsState, isOpen }: ItemsBarProps) => {
	const templateIds = useSelector(
		(state: RootState) => state.generator.templates.map((tmpl) => tmpl.id),
		shallowEqual
	);
	const textIds = useSelector(
		(state: RootState) => state.generator.texts.map((txt) => txt.id),
		shallowEqual
	);
	const isTemplates = templateIds.length > 0;
	const isTexts = textIds.length > 0;

	return (
		<FieldWrapper
			title={title ? title + ":" : ""}
			wrapperClass={`fixed z-30  top-0 shadow w-2xs px-8 py-7 flex flex-col bg-surface m-4 rounded-sm h-[calc(100vh-32px)] transition-all ${isOpen ? "left-0" : "-left-66"}`}
		>
			<button
				className={`absolute top-3 right-3 cursor-pointer transition-transform ${isOpen ? "" : "rotate-180"}`}
				onClick={() =>
					setBarsState((prev) => ({ ...prev, isItemsBarOpen: !prev.isItemsBarOpen }))
				}
			>
				<Icon type="arrowLeft" />
			</button>
			<Title
				as="h3"
				title="Layers"
				className="text-xs text-secondary-light font-bold mb-2"
			/>
			{isTemplates && <ElementsList ids={templateIds} type="template" />}
			{isTexts && <ElementsList ids={textIds} type="text" />}
		</FieldWrapper>
	);
};
