import { useRef, useState } from "react";
import { Icon } from "../../../../../ui/Icon";
import { useClickOutside } from "../../../../../hooks/useClickOutside";
import { useDispatch } from "react-redux";
import { updateActiveTextStyle } from "../../../../../store/slices/generator";
import { IconButton } from "../../../../../ui/IconButton";

const headers = [
	{ type: "header1", label: "Header 1", className: "text-2xl", size: 24 },
	{ type: "header2", label: "Header 2", className: "text-xl", size: 20 },
	{ type: "header3", label: "Header 3", className: "text-lg", size: 18 },
	{ type: "header4", label: "Header 4", className: "text-base", size: 16 },
	{ type: "header5", label: "Header 5", className: "text-sm", size: 14 },
	{ type: "header6", label: "Header 6", className: "text-xs", size: 12 },
];

export const Headers = () => {
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();

	const ref = useRef<HTMLDivElement | null>(null);

	const showDropDown = () => setIsOpen((prev) => !prev);

	useClickOutside(ref, () => setIsOpen(false));

	const onSelectHeader = (size: number) => {
		dispatch(updateActiveTextStyle(size));
	};

	return (
		<div className="relative flex gap-4" ref={ref}>
			<IconButton
				icon="header"
				text="Headers"
				className="text-lg dark:text-white"
				onClick={showDropDown}
				tooltipPosition="right"
				tooltipOffsetClass="mt-3"
			/>

			{isOpen && (
				<div className="shadow rounded-sm z-1000 absolute left-0 top-12 bg-surface flex flex-col gap-3 px-4 py-4 text-tiny w-42 dark:bg-dark-section ">
					{headers.map((header) => (
						<button
							key={header.type}
							className="flex items-center gap-2 cursor-pointer  border-b border-b-gray-200 pb-1 last:border-b-0 dark:text-gray-200"
							onClick={() => onSelectHeader(header.size)}
						>
							<Icon type={header.type} className="text-lg" />:
							<p className={header.className}>{header.label}</p>
						</button>
					))}
				</div>
			)}
		</div>
	);
};
