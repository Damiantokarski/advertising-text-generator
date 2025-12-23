import { useCompressImage } from "./hooks/useCompressImage";
import { Dropzone } from "../../../../ui/Dropzone";
import { Title } from "../../../../ui/Title";

import { ProgressBar } from "./components/ProgressBar";
import { CompressImageList } from "./components/CompressImageList";
import { RejectedList } from "./components/RejectedList";

export const Compress = () => {
	const {
		files,
		rejected,
		onDrop,
		removeFile,
		compress,
		canCompress,
		isCompressing,
		progress,
	} = useCompressImage({
		outputName: "compressed",
		autoDownload: true,
	});

	return (
		<section className="relative bg-surface rounded-lg shadow-md p-8 w-full  h-[calc(100vh-500px)] mt-16 dark:bg-dark-section">
			<Title
				as="h1"
				title="Compression"
				className="absolute -top-10.5 text-5xl font-bold text-primary-blue-sky dark:text-primary-blue-hover"
			/>

			<div className="flex gap-8 w-full h-full">
				<div className="h-full flex flex-col gap-4 max-w-md w-full justify-center">
					<div className="flex flex-col gap-2">
						<p className="text-lg text-primary-text max-w-2xl leading-4 dark:text-white">
							Reduce size without losing quality.
						</p>
						<p className="text-sm text-primary-text/70 max-w-2xl mb-4 leading-4 dark:text-gray-300">
							Your files never leave your device - compression runs locally.
						</p>

						<Dropzone
							onFiles={onDrop}
							className="w-full h-full max-h-[calc(100vh-700px)] max-w-md"
						/>
					</div>

					<button
						onClick={compress}
						className="cursor-pointer bg-primary-blue-sky text-surface font-semibold px-6 py-1.5 rounded-md w-fit hover:bg-primary-blue-hover transition-colors disabled:bg-primary-blue-sky/50 disabled:cursor-not-allowed self-end dark:bg-primary-blue-hover dark:hover:bg-primary-blue"
						disabled={!canCompress}
					>
						{isCompressing ? "Compressing..." : "Compress"}
					</button>
				</div>

				<div className="h-full w-full">
					{(isCompressing || progress > 0) && <ProgressBar progress={progress} />}

					{rejected.length > 0 ? (
						<RejectedList rejected={rejected} />
					) : (
						<CompressImageList files={files} removeFile={removeFile} />
					)}
				</div>
			</div>
		</section>
	);
};
