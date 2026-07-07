export type Theme = "light" | "dark" | "system";
export type ResolvedScheme = "light" | "dark";

const STORAGE_KEY = "theme";
const CHANGE_EVENT = "themechange";

// Single lazily-created MediaQueryList shared by every snapshot/subscribe call.
let systemQuery: MediaQueryList | null = null;
function getSystemQuery(): MediaQueryList {
  systemQuery ??= window.matchMedia("(prefers-color-scheme: dark)");
  return systemQuery;
}

// The inline FOUC script in the root layout sets `data-theme` on <html> before
// React hydrates, so the client snapshots can read straight from the DOM. This
// matches the React-blessed pattern for syncing to an external store and
// eliminates the need for the `react-hooks/set-state-in-effect` escape hatch.
export function getThemeSnapshot(): Theme {
  const v = document.documentElement.getAttribute("data-theme");
  return v === "light" || v === "dark" ? v : "system";
}

export function getServerTheme(): Theme {
  // The server has no access to the user's choice. Render a stable default
  // and let useSyncExternalStore reconcile on the client.
  return "system";
}

export function subscribeToTheme(callback: () => void): () => void {
  // `storage` only fires across tabs; CHANGE_EVENT covers same-tab toggles.
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

/** The scheme actually in effect: explicit data-theme wins, otherwise the
 *  system preference — the same resolution order as globals.css. */
export function getResolvedScheme(): ResolvedScheme {
  const theme = getThemeSnapshot();
  if (theme !== "system") return theme;
  return getSystemQuery().matches ? "dark" : "light";
}

export function getServerScheme(): ResolvedScheme {
  return "light";
}

export function subscribeToScheme(callback: () => void): () => void {
  const unsubscribeTheme = subscribeToTheme(callback);
  const mq = getSystemQuery();
  mq.addEventListener("change", callback);
  return () => {
    unsubscribeTheme();
    mq.removeEventListener("change", callback);
  };
}

export function applyTheme(next: Theme) {
  const root = document.documentElement;
  if (next === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", next);
  try {
    if (next === "system") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* localStorage unavailable. DOM state still updates */
  }
  // Notify same-tab listeners; the `storage` event only fires across tabs.
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
