import { fetchProtected } from "./fetchProtected";

export const googleFontsApi = async () => {
	const res = await fetchProtected(`http://localhost:4000/api/google-fonts`);
	if (!res.ok)
		throw new Error(`Failed to fetch Google Fonts: ${res.statusText}`);
	return res.json();
};
