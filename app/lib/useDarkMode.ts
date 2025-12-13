import { useEffect } from "react";
import { create } from "zustand";

type ThemeState = {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  toggleDarkMode: () => void;
};

function getInitialIsDark(): boolean {
  // localStorage first, then system preference
  if (typeof window === "undefined") return false;

  const stored = localStorage.getItem("darkMode");
  if (stored !== null) return stored === "true";

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: getInitialIsDark(),
  setIsDark: (value) => set({ isDark: value }),
  toggleDarkMode: () => set((state) => ({ isDark: !state.isDark })),
}));

// Keep backward-compatible API for existing imports
export function useDarkMode() {
  const isDark = useThemeStore((s) => s.isDark);
  const toggleDarkMode = useThemeStore((s) => s.toggleDarkMode);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDark]);

  return { isDark, toggleDarkMode };
}
