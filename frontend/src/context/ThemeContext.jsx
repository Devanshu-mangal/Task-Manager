import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "task-manager-theme";

const ThemeContext = createContext(null);

function getSystemDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyDomTheme(mode) {
  const root = document.documentElement;
  const isDark = mode === "dark" || (mode === "system" && getSystemDark());
  root.classList.toggle("dark", isDark);
  root.classList.toggle("light", !isDark);
}

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s === "light" || s === "dark" || s === "system") return s;
    } catch {
      /* ignore */
    }
    return "system";
  });
  const [systemTick, setSystemTick] = useState(0);

  useEffect(() => {
    applyDomTheme(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      setSystemTick((n) => n + 1);
      if (mode === "system") applyDomTheme("system");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  const setMode = useCallback((next) => {
    setModeState(next);
  }, []);

  const resolved = useMemo(
    () => (mode === "system" ? (getSystemDark() ? "dark" : "light") : mode),
    [mode, systemTick]
  );

  const value = useMemo(
    () => ({
      mode,
      setMode,
      resolved,
    }),
    [mode, setMode, resolved]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
