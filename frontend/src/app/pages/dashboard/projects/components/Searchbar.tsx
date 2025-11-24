import { useRef } from "react";
import { Icon } from "../../../../Ui/Icon";

interface SearchbarProps {
	placeholder?: string;
	debounceMs?: number;
	onSearch: (value: string) => void;
}

export const Searchbar = ({
	onSearch,
	placeholder = "Search...",
	debounceMs = 300,
}: SearchbarProps) => {
	const timerRef = useRef<number | null>(null);

	const handleInput = (value: string) => {
		if (timerRef.current) {
			window.clearTimeout(timerRef.current);
		}
		timerRef.current = window.setTimeout(() => {
			onSearch(value.trim());
		}, debounceMs);
	};

	return (
		<div className="absolute top-10 right-8 border border-primary-blue-sky px-3 py-1.5 rounded-md flex items-center bg-main">
			<Icon type="magnifyingGlass" className="text-primary-blue mr-2 " />
			<input
				placeholder={placeholder}
				className="focus:outline-none text-sm"
				onChange={(e) => handleInput(e.target.value)}
			/>
		</div>
	);
};
