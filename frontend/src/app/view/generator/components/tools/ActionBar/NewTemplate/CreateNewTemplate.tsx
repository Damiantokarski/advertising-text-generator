import { useRef, useState } from "react";

import { TemplateList } from "./TemplateList";
import { useClickOutside } from "../../../../../../hooks/useClickOutside";
import { Icon } from "../../../../../../ui/Icon";

export const CreateNewTemplate = () => {
	const ref = useRef<HTMLDivElement | null>(null);

	const [isOpen, setIsOpen] = useState(false);

	const showDropDown = () => setIsOpen((prev) => !prev);

	useClickOutside(ref, () => setIsOpen(false));

	return (
		<div ref={ref} className="flex items-center">
			<button onClick={showDropDown} className="cursor-pointer">
				<Icon type="rectangle" className="text-secondary-light" />
			</button>

			{isOpen && <TemplateList onChooseElement={showDropDown} />}
		</div>
	);
};
