// Wrapper to get endpoints that require JWT protection
import { refreshAccessToken } from "./auth";

export const fetchProtected = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const withCredentials: RequestInit = { ...options, credentials: "include" };
    let res = await fetch(url, withCredentials);
    if (res.status === 401) {
        const refresh = await refreshAccessToken();
        if (!refresh) throw new Error("failed to refresh access token");
        res = await fetch(url, withCredentials);
    }
    return res
};