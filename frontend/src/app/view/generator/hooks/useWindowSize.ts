import { useEffect, useState } from "react";

export interface WindowSize {
	width: number;
	height: number;
}

export function useWindowSize(): WindowSize {
	const getSize = () => ({
		width: typeof window !== "undefined" ? window.innerWidth : 0,
		height: typeof window !== "undefined" ? window.innerHeight : 0,
	});

	const [size, setSize] = useState<WindowSize>(getSize);

	useEffect(() => {
		const handleResize = () => setSize(getSize());
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return size;
}
