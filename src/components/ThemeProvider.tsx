"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  cinematicToggle: (buttonRect: DOMRect) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  cinematicToggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) {
      setTheme(saved);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const cinematicToggle = useCallback(
    (buttonRect: DOMRect) => {
      const newTheme = theme === "dark" ? "light" : "dark";
      const newBg = newTheme === "dark" ? "#09090b" : "#fafafa";

      // Find the transition overlay and trigger animation
      const overlay = document.getElementById("theme-transition-overlay");
      if (overlay && (overlay as unknown as { __trigger?: (rect: DOMRect, bg: string) => void }).__trigger) {
        (overlay as unknown as { __trigger: (rect: DOMRect, bg: string) => void }).__trigger(buttonRect, newBg);
      } else {
        // Fallback: instant toggle
        toggleTheme();
      }
    },
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, cinematicToggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
