export const checkPsdFile = (file?: File | null) => {
  if (!file) return false;
  const name = file.name.toLowerCase();
  return file.type === "image/vnd.adobe.photoshop" || name.endsWith(".psd");
};