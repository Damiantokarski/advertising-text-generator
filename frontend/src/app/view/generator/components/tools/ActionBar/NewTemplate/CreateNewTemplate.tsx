import { useRef, useState } from "react";
import { useClickOutside } from "../../../../../../hooks/useClickOutside";
import { NewTemplateForm } from "./NewTemplateForm";
import { IconButton } from "../../../../../../ui/IconButton";

export const CreateNewTemplate = () => {
	const ref = useRef<HTMLDivElement | null>(null);

	const [isOpen, setIsOpen] = useState(false);

	const showDropDown = () => setIsOpen((prev) => !prev);

	useClickOutside(ref, () => setIsOpen(false));

	return (
		<div ref={ref} className="flex items-center">
			<IconButton
				icon="rectangle"
				text="Add Template"
				className="text-lg dark:text-white"
				onClick={showDropDown}
				tooltipPosition="right"
				tooltipOffsetClass="mt-3"
			/>

			{isOpen && <NewTemplateForm onHideForm={showDropDown} />}
		</div>
	);
};
