import { Icon } from "../../../../../ui/Icon";

export interface SetScaleProps {
	scale: number;
	minScale?: number;
	maxScale?: number;
	step?: number;
	onChange: (newScale: number) => void;
}

export const StageScale = ({
	scale,
	onChange,
	minScale = 0.1,
	maxScale = 5,
	step = 0.1,
}: SetScaleProps) => {
	const clamp = (v: number) => Math.min(maxScale, Math.max(minScale, v));

	const zoomIn = () => onChange(clamp(scale + step));
	const zoomOut = () => onChange(clamp(scale - step));

	return (
		<div className="flex gap-2 items-center">
			<button
				onClick={zoomIn}
				disabled={scale >= maxScale}
				className="cursor-pointer dark:text-white"
			>
				<Icon type="plus"/>
			</button>
			<span className="text-xs dark:text-white">
				{(scale * 100).toFixed(0)}%
			</span>
			<button
				onClick={zoomOut}
				disabled={scale <= minScale}
				className="cursor-pointer w-fit dark:text-white"
			>
				<Icon type="minus"/>
			</button>
		</div>
	);
};
