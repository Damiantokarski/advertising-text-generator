const API_BASE = "http://localhost:4000/api/auth";

export type Session = {
	id: number;
	email: string;
	name: string;
} | null;

export type RegisterResult = {
	ok: boolean;
	email: string;
	name: string;
};

export const checkSession = async (): Promise<Session> => {
	const res = await fetch(`${API_BASE}/me`, {
		method: "POST",
		credentials: "include",
	});
	// console.log("checkSession response:", res.status, res.statusText);
	if (!res.ok) return null;
	const session = await parseSessionSafe(res);
	// console.log("checkSession parsed:", session);
	return session;
};

export const refreshAccessToken = async (): Promise<boolean> => {
	const res = await fetch(`${API_BASE}/refresh`, {
		method: "POST",
		credentials: "include",
	});
	// console.log("refreshAccessToken response:", res.status, res.statusText);
	if (!res.ok) {
		return false;
	}

	return true;
};

export const login = async (
	email: string,
	password: string
): Promise<Session> => {
	const res = await fetch(`${API_BASE}/login`, {
		method: "POST",
		headers: { "Content-type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ email, password }),
	});
	console.log("login response:", res.status, res.statusText);
	if (!res.ok) {
		throw new Error("Failed to log in");
	}
	const session = await parseSessionSafe(res);
	console.log("login parsed:", session);
	return session;
};

export const logout = async (): Promise<void> => {
	const res = await fetch(`${API_BASE}/logout`, {
		method: "POST",
		credentials: "include",
	});
	console.log("logout response:", res.status, res.statusText);
	if (!res.ok) {
		throw new Error("Failed to log out");
	}
};

export const register = async (
	email: string,
	name: string,
	password: string
): Promise<RegisterResult> => {
	const res = await fetch(`${API_BASE}/signup`, {
		method: "POST",
		headers: { "Content-type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ email, name, password }),
	});
	console.log("register response:", res.status, res.statusText);
	if (!res.ok) {
		return { ok: false, email: "", name: "" };
	}
	const registerResponse = await res.json();
	console.log("register parsed:", registerResponse);
	if (!isRegisterResponse(registerResponse)) {
		throw new Error("Response does not match schema");
	}

	return { ok: true, ...registerResponse };
};

function isRegisterResponse(
	obj: unknown
): obj is { email: string; name: string } {
	if (typeof obj !== "object" || obj === null) return false;
	const { email, name } = obj as { email?: unknown; name?: unknown };
	return typeof email === "string" && typeof name === "string";
}

async function parseSessionSafe(res: Response): Promise<Session> {
	try {
		const json = await res.json();
		if (!json || typeof json !== "object") return null;
		const { id, email, name } = json as {
			id?: unknown;
			email?: unknown;
			name?: unknown;
		};
		return typeof id === "number" &&
			typeof email === "string" &&
			typeof name === "string"
			? { id, email, name }
			: null;
	} catch (error) {
		console.error("Failed to parse JSON:", error);
		return null;
	}
}

export default { checkSession, refreshAccessToken, login, logout, register };
