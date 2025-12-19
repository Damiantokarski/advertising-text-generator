import * as auth from "../../api/authApi";
import { useEffect, useState } from "react";
import type { Session, RegisterResult } from "../../api/authApi";
import { AuthContext } from "../hooks/useAuth";


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Session>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const fetched = await auth.checkSession();
            setUser(fetched ?? null);
            setIsLoading(false);
        })();
    }, []);

    const login = async (email: string, password: string) => {
        const loggedIn = await auth.login(email, password);
        setUser(loggedIn ?? null);
        return loggedIn;
    };

    const logout = async (
    ) => {
        await auth.logout();
        setUser(null);
    };

    const register = async (email: string, name: string, password: string): Promise<RegisterResult> => {
        return auth.register(email, name, password);
    };

    // TODO wrapper for silent refresh here or in auth.ts? prob there, idk
    const refreshAccessToken = async () => {
        return auth.refreshAccessToken();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register, refreshAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
}
