import { useAuth } from "../../../../hooks/useAuth";
import { Icon } from "../../../../ui/Icon";
import { IconButton } from "../../../../ui/IconButton";
import { useTheme } from "../../../../hooks/useTheme";

export const Sidebar = () => {
	const { logout, user } = useAuth();
	const { theme, toggleTheme } = useTheme();

	return (
		<section className="relative bg-white rounded-b-lg shadow-md px-8 w-full h-full max-h-16 flex items-center justify-between dark:bg-dark-section">
			<div className="flex">

				<button
					onClick={logout}
					className="absolute left-42 top-4 flex items-center mx-2 gap-2 bg-primary-blue-sky px-4 py-1.5 rounded-md text-surface  hover:bg-primary-blue-hover transition-colors cursor-pointer shadow-sm dark:bg-primary-blue-hover dark:hover:bg-primary-blue"
				>
					<Icon type="logout" className="text-secondary-light text-sm" />
					<span className="text-sm">Logout</span>
				</button>
			</div>
			<div className="flex items-center gap-3">
				<IconButton
					icon={theme == "dark" ? "sunHigh" : "moon"}
					text="Toggle theme (dark/light)"
					className="text-lg dark:text-white"
					onClick={toggleTheme}
					tooltipPosition="right"
					tooltipOffsetClass="mt-3"
				/>
				<div className="bg-primary-blue-hover/10 w-10 h-10 rounded-full flex items-center justify-center dark:bg-white/10">
					<p className="font-bold text-primary-blue">{user?.name.slice(0, 1)}</p>
				</div>
				<div className="flex flex-col ">
					<p className="text-sm dark:text-white">{user?.name}</p>
					<p className="text-xs text-gray-500 dark:text-gray-200">{user?.email}</p>
				</div>
			</div>
		</section>
	);
};
