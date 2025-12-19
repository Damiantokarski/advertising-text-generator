interface ProgressBarProps {
	progress: number;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
	return (
		<>
			<label className="text-sm">Compression progress: {progress}%</label>
			<progress max={100} value={progress} className="progress-bar" />
		</>
	);
};
