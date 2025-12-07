import { useRef, useState } from "react";
import { Dropzone } from "../../../../../ui/Dropzone";
import { Icon } from "../../../../../ui/Icon";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import { usePsd } from "../../../hooks/usePsd";

export const AddPsdFile = () => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const showDropDown = () => setIsOpen((prev) => !prev);

	const { onDrop } = usePsd();

	useClickOutside(ref, () => setIsOpen(false));

	return (
		<div ref={ref} className="flex items-center">
			<button onClick={showDropDown} className="cursor-pointer">
				<Icon type="filetypePsd" className="text-secondary-light text-lg" />
			</button>

			{isOpen && (
				<div className="px-4 py-4 bg-surface shadow rounded-lg z-1000 fixed left-100 top-4 text-tiny max-w-48 space-y-1 border-2 border-primary-blue-sky">
					<Dropzone onFiles={onDrop} accept=".psd" multiple={false} />
				</div>
			)}
		</div>
	);
};
