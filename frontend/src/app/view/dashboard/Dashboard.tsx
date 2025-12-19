import { Projects } from "./components/projects/Projects";
import { Sidebar } from "./components/sidebar/Sidebar";

export const Dashboard = () => {
	return (
		<main className="relative flex flex-col h-screen min-w-full">
			<Sidebar />
			<div className="p-6 h-full flex gap-6">
				<div className="w-full"></div>
				<Projects />
			</div>
		</main>
	);
};
