import { Icon } from "./Icon";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface IconButtonProps {
	icon: string;
	text: string;
	className?: string;
	onClick: () => void;

	tooltipPosition?: TooltipPosition;
	tooltipOffsetClass?: string;
	tooltipClassName?: string;
}

const tooltipPosClasses: Record<TooltipPosition, string> = {
	top: "left-1/2 -translate-x-1/2 bottom-full", // nad przyciskiem
	bottom: "left-1/2 -translate-x-1/2 top-full", // pod przyciskiem
	left: "right-full top-1/2 -translate-y-1/2", // po lewej
	right: "left-full top-1/2 -translate-y-1/2", // po prawej
};

const tooltipOffsetDefaults: Record<TooltipPosition, string> = {
	top: "mb-2",
	bottom: "mt-2",
	left: "mr-2",
	right: "ml-2",
};

export const IconButton = ({
	icon,
	text,
	className = "",
	onClick,
	tooltipPosition = "top",
	tooltipOffsetClass,
	tooltipClassName = "",
}: IconButtonProps) => {
	const pos = tooltipPosClasses[tooltipPosition];
	const offset = tooltipOffsetClass ?? tooltipOffsetDefaults[tooltipPosition];

	return (
		<div className="relative inline-flex group">
			<button
				type="button"
				className={`cursor-pointer ${className}`}
				onClick={onClick}
			>
				<Icon type={icon} />
			</button>

			<span
				className={[
					"pointer-events-none absolute",
					pos,
					offset,
					"whitespace-nowrap rounded-md bg-black/80 text-white text-xs px-2 py-1",
					"opacity-0 transition",
					"group-hover:opacity-100",
					"translate-y-1 group-hover:translate-y-0",
					tooltipClassName,
				].join(" ")}
			>
				{text}
			</span>
		</div>
	);
};
