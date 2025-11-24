import "./App.css";
import { Projects } from "./app/view/dashboard/projects/Projects";


export default function App() {
	return (
		<main className="relative flex flex-col h-screen min-w-full">
			<Projects />
		</main>
	);
}
