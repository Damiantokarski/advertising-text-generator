import List from "../../../../../ui/List/List";
import ListItem from "../../../../../ui/List/ListItem";
import { CompressImageListItem } from "./CompressImageListItem";


interface CompressImageListProps {
	files: File[];
	removeFile: (index: number) => void;
}
export const CompressImageList = ({
	files,
	removeFile,
}: CompressImageListProps) => {
	return (
		<List type="ul" className="flex flex-col gap-1 w-full h-full max-h-[calc(100%-50px)] overflow-y-auto py-2  max-w-md">
			{files.map((file, index) => (
				<ListItem key={index} >
					<CompressImageListItem
						file={file}
						removeFile={removeFile}
						index={index}
					/>
				</ListItem>
			))}
		</List>
	);
};
