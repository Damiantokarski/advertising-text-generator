import { createContext, useContext } from "react";

export type Theme = "light" | "dark";

export const ThemeContext = createContext<{
    theme: Theme;
    toggleTheme: () => void;
    resetTheme: () => void;
} | null>(null);

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
};
