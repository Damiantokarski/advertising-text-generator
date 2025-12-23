import List from "../../../../../ui/List/List";
import ListItem from "../../../../../ui/List/ListItem";

interface RejectedListProps {
	rejected: {
		file: {
			name: string;
			size: number;
		};
		reason: string;
	}[];
}

export const RejectedList = ({ rejected }: RejectedListProps) => {
	return (
		<div className="rounded-md border border-red-200 bg-red-200 p-3 max-h-full overflow-y-auto">
			<p className="text-sm font-semibold text-red-700">
				Rejected files ({rejected.length})
			</p>

			<List type="ul" className="mt-1 text-sm text-red-700 list-disc pl-5 ">
				{rejected.map((rejected, index) => (
					<ListItem key={index}>
						<p>
							{rejected.file.name} — {rejected.reason}
						</p>
					</ListItem>
				))}
			</List>
		</div>
	);
};
