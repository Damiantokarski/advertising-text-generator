import { useDropzone } from "../hooks/useDropzone";
import { Icon } from "./Icon";

export interface DropzoneProps {
	onFiles: (files: File[]) => void;
	onError?: (messages: string[]) => void;
	accept?: string | string[];
	multiple?: boolean;
	maxSizeMB?: number;
	disabled?: boolean;
	className?: string;
	label?: string;
	renderHelper?: React.ReactNode;
}

export const Dropzone = ({
	onFiles,
	onError,
	accept,
	multiple = true,
	maxSizeMB,
	disabled = false,
	className = "",
	label = "Drag and drop files here or click to select from your drive.",
	renderHelper,
}: DropzoneProps) => {
	const {
		inputRef,
		isDragOver,
		openDialog,
		onDragOver,
		onDragLeave,
		onDrop,
		onPaste,
	} = useDropzone({ onFiles, onError, accept, multiple, maxSizeMB, disabled });

	const baseStyles =
		"flex flex-col items-center justify-center gap-3 w-full rounded-sm border-2 border-dashed p-8 transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer select-none max-w-196 dark:border-primary-blue-hover";
	const stateStyles = disabled
		? "opacity-50 cursor-not-allowed"
		: isDragOver
			? "border-blue-500 bg-blue-50 "
			: "border-zinc-300 hover:bg-zinc-50 dark:hover:bg-gray-600";

	return (
		<div className={`flex justify-center dark:bg-primary-blue-hover/40 ${className}`}>
			<div
				role="button"
				tabIndex={0}
				aria-disabled={disabled}
				aria-label="File upload area"
				className={`${baseStyles} ${stateStyles}`}
				onClick={openDialog}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						openDialog();
					}
				}}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
				onPaste={onPaste}
			>
				<Icon
					type="cloudArrowDown"
					className="text-2xl text-primary-blue-sky dark:text-primary-blue-hover"
				/>
				<p className="text-center text-sm dark:text-white">Drag & drop or select files</p>

				<input
					ref={inputRef}
					type="file"
					style={{ display: "none" }}
					multiple={multiple}
					accept={Array.isArray(accept) ? accept.join(",") : accept}
					onChange={(e) => {
						if (!e.target.files) return;
						const files = Array.from(e.target.files);
						console.log(files);
						onFiles(files);
						e.target.value = "";
					}}
				/>
			</div>
		</div>
	);
};
