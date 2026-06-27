"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setDark: (value: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () =>
        set((state) => {
          const next = !state.isDark;
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", next);
          }
          return { isDark: next };
        }),
      setDark: (value) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", value);
        }
        set({ isDark: value });
      },
    }),
    { name: "theme-storage" }
  )
);
