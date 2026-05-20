"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";
const STORAGE_KEY = "theme";
const CHANGE_EVENT = "themechange";

// The inline FOUC script in the root layout sets `data-theme` on <html> before
// React hydrates, so the client snapshot can read straight from the DOM. This
// matches the React-blessed pattern for syncing to an external store and
// eliminates the need for the `react-hooks/set-state-in-effect` escape hatch.
function getClientSnapshot(): Theme {
  if (typeof document === "undefined") return "system";
  const v = document.documentElement.getAttribute("data-theme");
  return v === "light" || v === "dark" ? v : "system";
}

function getServerSnapshot(): Theme {
  // The server has no access to the user's choice — render a stable default
  // and let useSyncExternalStore reconcile on the client.
  return "system";
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function applyTheme(next: Theme) {
  const root = document.documentElement;
  if (next === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", next);
  try {
    if (next === "system") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* localStorage unavailable — DOM state still updates */
  }
  // Notify same-tab listeners; the `storage` event only fires across tabs.
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

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
      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-foreground/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
