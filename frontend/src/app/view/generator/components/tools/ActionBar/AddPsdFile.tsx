import { useRef, useState } from "react";
import { Dropzone } from "../../../../../ui/Dropzone";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import { usePsd } from "../../../hooks/usePsd";
import { IconButton } from "../../../../../ui/IconButton";

export const AddPsdFile = () => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const showDropDown = () => setIsOpen((prev) => !prev);

	const { onDrop } = usePsd();

	useClickOutside(ref, () => setIsOpen(false));

	return (
		<div ref={ref} className="flex items-center">
			<IconButton
				icon="psd"
				text="Upload PSD"
				className="text-lg"
				onClick={showDropDown}
				tooltipPosition="right"
				tooltipOffsetClass="mt-3"
			/>

			{isOpen && (
				<div className="px-4 py-4 bg-surface shadow rounded-sm z-1000 fixed left-100 top-22 text-tiny max-w-48 space-y-1">
					<Dropzone onFiles={onDrop} accept=".psd" multiple={false} />
				</div>
			)}
		</div>
	);
};
