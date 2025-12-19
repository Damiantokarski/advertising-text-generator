import { Dropzone } from "./Dropzone";
import { useCompressImage } from "../hooks/useCompressImage";

import { CompressImageList } from "./CompressImageList";

export const CompressImageModal = () => {
	const { files, onDrop, removeFile, compress, isAbleCompressing, progress } =
		useCompressImage();

	return (
		<div className="relative p-8 bg-surface shadow rounded-lg w-full max-w-4xl h-full max-h-[calc(55vh-100px)] flex flex-col gap-6">
			<div className=" flex gap-8 w-full h-full">
				<div className="h-full flex flex-col gap-4 max-w-112 w-full mt-14 ">
					<div className="flex flex-col gap-4">
						<p className="text-lg text-primary-text max-w-2xl text-right leading-5 ">
							Reduce size without losing quality.
						</p>
						<p className="text-sm text-primary-text max-w-2xl text-right mb-4 leading-4">
							Your files never leave your device -<br /> compression runs
							locally.
						</p>
					</div>
					<button
						onClick={compress}
						className="cursor-pointer bg-primary-blue-sky text-surface font-semibold px-6 py-1.5 rounded-md w-fit hover:bg-primary-blue-hover transition-colors disabled:bg-primary-blue-sky/50 disabled:cursor-not-allowed self-end"
						disabled={!isAbleCompressing}
					>
						Compress
					</button>
				</div>
				<div className="h-full w-full">
					{(isAbleCompressing || progress > 0) && (
						<div>
							<label className="text-sm">Postęp kompresji: {progress}%</label>
							<progress max={100} value={progress} className="progress-bar" />
						</div>
					)}
					{isAbleCompressing || progress > 0 ? (
						<div className="flex flex-col items-center max-h-[calc(100vh-730px)] max-w-112 h-full w-full">
							<CompressImageList files={files} removeFile={removeFile} />
						</div>
					) : (
						<Dropzone
							onFiles={onDrop}
							className="w-full h-full max-h-[calc(100vh-700px)] max-w-112"
						/>
					)}
				</div>
			</div>
		</div>
	);
};
