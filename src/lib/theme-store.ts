import type { ThemePreference } from "@/types/profile-settings";

export const THEME_STORAGE_KEY = "careeros-theme";

type Listener = () => void;

let memory: ThemePreference | null = null;
const listeners = new Set<Listener>();

const DEFAULT_THEME: ThemePreference = "dark";

function readTheme(): ThemePreference {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME;
}

export function getThemeSnapshot(): ThemePreference {
  if (memory === null) {
    memory = typeof window === "undefined" ? DEFAULT_THEME : readTheme();
  }
  return memory;
}

export function getThemeServerSnapshot(): ThemePreference {
  return DEFAULT_THEME;
}

export function subscribeTheme(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resolveTheme(preference: ThemePreference): "light" | "dark" {
  if (preference === "system") {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }
  return preference;
}

export function applyTheme(preference: ThemePreference) {
  if (typeof document === "undefined") return;
  const resolved = resolveTheme(preference);
  document.documentElement.dataset.theme = resolved;
}

export function setThemePreference(preference: ThemePreference) {
  memory = preference;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  }
  applyTheme(preference);
  listeners.forEach((listener) => listener());
}
