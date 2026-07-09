---
title: "Making a third-party widget follow my theme toggle"
date: "2026-07-09"
excerpt: "react-github-calendar doesn't know about my theme. Syncing it — without a hydration flash — is a job for useSyncExternalStore."
tags: ["react", "nextjs", "theming"]
---

My [about page](/about) embeds a GitHub contributions calendar via
`react-github-calendar`. The component takes a `colorScheme` prop and a pair of
colour palettes, but it has no idea my site has its own theme toggle. If I hard-code
`colorScheme="light"`, the calendar's empty cells glow pale grey inside a dark
card. I needed it to track whatever theme the visitor actually has — and to get
it right on the very first paint, not after a flicker.

## Where the theme actually lives

My theme isn't a React value. It's resolved the same way `globals.css` resolves
it:

1. an explicit `data-theme="light|dark"` attribute on `<html>` (set by the
   toggle and persisted to `localStorage`), or
2. failing that, the OS preference via `prefers-color-scheme`.

So "the current scheme" is a function of the DOM plus a media query — two mutable
sources React doesn't own. That's the textbook use case for
`useSyncExternalStore`.

```ts
export function getResolvedScheme(): "light" | "dark" {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return getSystemQuery().matches ? "dark" : "light";
}

export function subscribeToScheme(callback: () => void): () => void {
  const unsubscribeTheme = subscribeToTheme(callback);   // data-theme MutationObserver + storage/toggle events
  const mq = getSystemQuery();
  mq.addEventListener("change", callback);
  return () => { unsubscribeTheme(); mq.removeEventListener("change", callback); };
}
```

The component becomes almost boring:

```tsx
const scheme = useSyncExternalStore(subscribeToScheme, getResolvedScheme, getServerScheme);

return <GitHubCalendar username={username} colorScheme={scheme} theme={explicitTheme} />;
```

Toggle the theme anywhere on the site and the calendar repaints, because the
toggle dispatches the same event `subscribeToScheme` is listening for.

## The hydration-flash trap

There's a catch that a naïve version gets wrong. The server has no access to the
visitor's saved theme, so `getServerScheme` has to return a stable default
(`"light"`). If nothing corrected that before paint, a dark-theme visitor would
see a light calendar for a beat and then a flip — the exact flash I was trying to
avoid.

Two things prevent it:

- An **inline script in the document `<head>`** sets `data-theme` on `<html>`
  *before* React hydrates. It's the standard anti-FOUC trick, and it means the
  DOM already reflects the real theme by the time the client renders.
- `useSyncExternalStore` **reads the client snapshot immediately on hydration**,
  so `getResolvedScheme` sees that already-correct `data-theme` and paints the
  calendar in the right palette on the first client frame.

I verified it the boring way — a headless browser with `localStorage.theme =
"dark"`, loading the page cold and asserting the first-painted cell fill is the
dark palette, not the light one. It is.

## One store, two consumers

The tell that this was the right abstraction: my theme toggle button needed the
exact same subscribe/snapshot logic. Rather than keep two copies in sync by hand,
I pulled the whole thing into a `src/lib/theme` module — `getThemeSnapshot`,
`subscribeToTheme`, `getResolvedScheme`, `applyTheme` — and both the toggle and
the calendar consume it. One cached `MediaQueryList`, one source of truth.

## The takeaway

Any time you're syncing UI to something outside React — a third-party widget to
your theme, a component to `localStorage`, anything DOM- or media-query-shaped —
`useSyncExternalStore` beats `useState` + `useEffect`, and it's the piece that
makes the first render correct instead of correcting it after the fact. The
consolidation is commit `e0a6b91` on
[anmolmalhan/Portfolio](https://github.com/anmolmalhan/Portfolio).
