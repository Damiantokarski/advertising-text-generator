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
		<div className="w-4 flex flex-col items-center gap-4  ">
			<button
				onClick={zoomIn}
				disabled={scale >= maxScale}
				className="cursor-pointer text-secondary-light"
			>
				+
			</button>
			<span className="text-xs text-secondary-light">
				{(scale * 100).toFixed(0)}%
			</span>
			<button
				onClick={zoomOut}
				disabled={scale <= minScale}
				className="cursor-pointer w-fit text-secondary-light"
			>
				-
			</button>
		</div>
	);
};
