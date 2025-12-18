import List from "./List/List";
import ListItem from "./List/ListItem";
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
		<List type="ul" className="flex flex-col gap-1 w-full h-full overflow-y-auto py-2 hidden-scrollbar max-w-112">
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
