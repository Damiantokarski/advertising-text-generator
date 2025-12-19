import { Icon } from "../../../../../ui/Icon";

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
		<div className="relative flex border-gray-200 border p-2 rounded-lg shadow gap-4 max-w-md ">
			<img
				src={URL.createObjectURL(file)}
				alt={file.name}
				className="w-10 h-10 object-contain p-1 rounded-sm shadow  bg-gray-200"
			/>
			<button
				onClick={() => removeFile(index)}
				className="text-fire absolute top-2 right-2 cursor-pointer"
			>
				<Icon type="close" className="text-sm" />
			</button>
			<span className="text-primary-text text-xs text-center mt-2 font-bold">
				{file.name}
			</span>
		</div>
	);
};
