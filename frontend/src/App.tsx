import "./App.css";
import { useModal } from "./app/hooks/useModal";
import { Projects } from "./app/view/dashboard/projects/Projects";
import { CompressImageModal } from "./app/Ui/CompressImageModal";
import { Icon } from "./app/Ui/Icon";

export default function App() {

	const { openModal } = useModal();

	const handleCompressImage = () => {
		openModal({
			title: "Compress Image",
			content: <CompressImageModal />,
			className: "max-w-3xl",
		});
	};

	return (
		<main className="relative flex flex-col h-screen min-w-full">
			<button
				onClick={handleCompressImage}
				className="flex items-center gap-2 bg-primary-blue-sky px-4 py-1.5 rounded-md text-surface  hover:bg-primary-blue-hover transition-colors cursor-pointer shadow-sm"
			>
				<Icon type="gear" className="text-sm" />
				<span className="text-sm">Compress Image</span>
			</button>
			<Projects />
		</main>
	);
}
