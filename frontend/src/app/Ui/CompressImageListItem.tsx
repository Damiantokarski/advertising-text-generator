import { Icon } from "./Icon";

interface CompressImageListItemProps {
	file: File;
	removeFile: (index: number) => void;
	index: number;
}

export const CompressImageListItem = ({
	file,
	removeFile,
	index,
}: CompressImageListItemProps) => {
	return (
		<div className="relative flex border-zinc-300 border p-4 rounded-lg shadow gap-4 max-w-112 ">
			<img
				src={URL.createObjectURL(file)}
				alt={file.name}
				className="w-16 h-16 object-contain rounded-lg shadow  bg-zinc-300"
			/>
			<button onClick={() => removeFile(index)} className="text-fire absolute top-2 right-2">
				<Icon type="close" className="text-sm" />
			</button>
			<span className="text-primary-text text-xs text-center mt-2 font-bold">{file.name}</span>
		</div>
	);
};
