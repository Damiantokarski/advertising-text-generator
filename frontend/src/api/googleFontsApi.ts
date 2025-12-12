export const googleFontsApi = async () => {
  const res = await fetch(`http://localhost:4000/api/google-fonts`);
  if (!res.ok)
    throw new Error(`Failed to fetch Google Fonts: ${res.statusText}`);
  return res.json();
};
