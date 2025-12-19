import { createContext, useContext } from "react";
import type { Session, RegisterResult } from "../../api/authApi";

export interface AuthContextType {
    user: Session;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<Session>;
    logout: () => Promise<void>;
    register: (email: string, name: string, password: string) => Promise<RegisterResult>;
    refreshAccessToken: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}