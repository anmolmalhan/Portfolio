"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import {
  applyTheme,
  getServerTheme,
  getThemeSnapshot,
  subscribeToTheme,
  type Theme,
} from "@/lib/theme";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerTheme);

  const cycle = () => {
    const next: Theme = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    applyTheme(next);
  };

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  const label = `Theme: ${theme}. Click to switch.`;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      suppressHydrationWarning
      className="group w-11 h-11 md:w-8 md:h-8 flex items-center justify-center rounded-md hover:bg-foreground/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Icon className="w-4 h-4 transition-transform duration-300 ease-out motion-safe:group-hover:rotate-45 motion-safe:group-hover:scale-110 motion-safe:group-active:scale-90" />
    </button>
  );
}
