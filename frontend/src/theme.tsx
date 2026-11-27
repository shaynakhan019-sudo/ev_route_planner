import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const THEMES = [
  { id: "emerald", label: "Emerald", color: "hsl(160 84% 30%)" },
  { id: "ocean", label: "Ocean", color: "hsl(217 91% 50%)" },
  { id: "sunset", label: "Sunset", color: "hsl(24 95% 50%)" },
  { id: "violet", label: "Violet", color: "hsl(262 83% 58%)" },
  { id: "rose", label: "Rose", color: "hsl(346 77% 50%)" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
export type Mode = "light" | "dark";

const THEME_KEY = "ev-theme";
const MODE_KEY = "ev-mode";

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function getInitialTheme(): ThemeId {
  const saved = readStorage(THEME_KEY);
  return THEMES.some((t) => t.id === saved) ? (saved as ThemeId) : "emerald";
}

function getInitialMode(): Mode {
  const saved = readStorage(MODE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

interface ThemeContextValue {
  theme: ThemeId;
  mode: Mode;
  setTheme: (t: ThemeId) => void;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(getInitialTheme);
  const [mode, setModeState] = useState<Mode>(getInitialMode);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.classList.toggle("dark", mode === "dark");
    root.style.colorScheme = mode;
  }, [theme, mode]);

  const setTheme = useCallback((t: ThemeId) => {
    setThemeState(t);
    writeStorage(THEME_KEY, t);
  }, []);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    writeStorage(MODE_KEY, m);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      const next: Mode = prev === "dark" ? "light" : "dark";
      writeStorage(MODE_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, mode, setTheme, setMode, toggleMode }),
    [theme, mode, setTheme, setMode, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}