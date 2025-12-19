import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { IconButton } from "../../../../../ui/IconButton";

export const CopyLink = () => {
	const location = useLocation();

	const handleCopy = async () => {
		const url = `${window.location.origin}${location.pathname}${location.search}${location.hash}`;
		await navigator.clipboard.writeText(url);

		if (url) {
			toast.success("Link to the project has been copied successfully!");
		} else {
			toast.error("Something went wrong!");
		}
	};

	return (
		<IconButton
			icon="copy"
			text="Cupy Link"
			className="text-lg text-amber"
			onClick={handleCopy}
			tooltipPosition="right"
			tooltipOffsetClass="mt-3"
		/>
	);
};
