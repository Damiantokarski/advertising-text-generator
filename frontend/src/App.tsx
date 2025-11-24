import "./App.css";
import { Searchbar } from "./app/pages/dashboard/projects/components/Searchbar";

import { Dropzone } from "./app/Ui/Dropzone";

export default function App() {
	const handleDropZone = (files: File[]) => {
		console.log(files);
	};
	return (
		<div className="relative">
			<Dropzone onFiles={handleDropZone} />

			<Searchbar
				onSearch={(value) => console.log(value)}
				debounceMs={300}
				placeholder="Test"
			/>
		</div>
	);
}
