import "./App.css";

import { Dropzone } from "./app/Ui/Dropzone";

export default function App() {
	const handleDropZone = (files: File[]) => {
		console.log(files);
	};
	return <Dropzone onFiles={handleDropZone} />;
}