import { shallowEqual, useSelector } from "react-redux";
import { ElementsList } from "./ElementsList";
import { FieldWrapper } from "../../../../../ui/FieldWrapper";
import { Title } from "../../../../../ui/Title";
import type { RootState } from "../../../../../store/store";

interface ItemsBarProps {
	title: string;
}

export const ItemsBar = ({ title }: ItemsBarProps) => {
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
			wrapperClass="fixed z-30 left-20 top-0  shadow w-2xs px-8 py-7 flex flex-col bg-surface m-4 rounded-lg h-[calc(100vh-32px)] border-2 border-primary-blue-sky"
		>
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
