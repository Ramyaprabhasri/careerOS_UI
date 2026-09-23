"use client";

import { useEffect } from "react";
import {
  applyTheme,
  getThemeSnapshot,
  subscribeTheme,
} from "@/lib/theme-store";

export function ThemeInit() {
  useEffect(() => {
    applyTheme(getThemeSnapshot());
    const unsubscribe = subscribeTheme(() => applyTheme(getThemeSnapshot()));
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (getThemeSnapshot() === "system") applyTheme("system");
    };
    media.addEventListener("change", onChange);
    return () => {
      unsubscribe();
      media.removeEventListener("change", onChange);
    };
  }, []);

  return null;
}
