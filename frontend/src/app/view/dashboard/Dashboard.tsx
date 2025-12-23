import { Compress } from "./components/compress/Compress";
import { Projects } from "./components/projects/Projects";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Stats } from "./components/stats/Stats";

export const Dashboard = () => {
	return (
		<main className="relative flex flex-col h-screen min-w-full w-full  ">
			<Sidebar />
			<div className="p-6 h-full flex gap-6">
				<Projects />
				<div className="w-full flex flex-col gap-6">
					<Compress />
					<Stats />
				</div>
			</div>
		</main>
	);
};
