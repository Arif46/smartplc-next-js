"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark, setDark } = useThemeStore();

  useEffect(() => {
    setDark(isDark);
  }, [isDark, setDark]);

  return <>{children}</>;
}
