import { useEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "../hooks/useTheme";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const resetTheme = () => setTheme("light"); // 👈 reset do light

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        resetTheme, 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
