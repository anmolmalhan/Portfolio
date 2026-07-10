---
title: "Making a third-party widget follow my theme toggle"
date: "2026-07-09"
excerpt: "react-github-calendar knows nothing about my theme. Syncing it, without a hydration flash, is a job for useSyncExternalStore."
tags: ["react", "nextjs", "theming"]
---

My [about page](/about) embeds a GitHub contributions calendar through
`react-github-calendar`. The component accepts a `colorScheme` prop and a pair of
palettes, but it has no notion that my site carries its own theme toggle. Hard-code
`colorScheme="light"` and the empty cells glow pale grey inside a dark card. I
needed the calendar to track whatever theme the visitor actually has, and to get
it right on the very first paint rather than after a flicker.

## Where the theme actually lives

The theme is not a React value. It resolves the same way `globals.css` resolves
it. First, an explicit `data-theme="light|dark"` attribute on `<html>`, set by the
toggle and persisted to `localStorage`. Failing that, the operating system
preference through `prefers-color-scheme`. So the current scheme is a function of
the DOM plus a media query, two mutable sources that React does not own. That is
the textbook case for `useSyncExternalStore`.

```ts
export function getResolvedScheme(): "light" | "dark" {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return getSystemQuery().matches ? "dark" : "light";
}

export function subscribeToScheme(callback: () => void): () => void {
  const unsubscribeTheme = subscribeToTheme(callback);   // data-theme MutationObserver plus storage/toggle events
  const mq = getSystemQuery();
  mq.addEventListener("change", callback);
  return () => { unsubscribeTheme(); mq.removeEventListener("change", callback); };
}
```

The component itself becomes almost boring:

```tsx
const scheme = useSyncExternalStore(subscribeToScheme, getResolvedScheme, getServerScheme);

return <GitHubCalendar username={username} colorScheme={scheme} theme={explicitTheme} />;
```

Toggle the theme anywhere on the site and the calendar repaints, because the
toggle dispatches the very event that `subscribeToScheme` is listening for.

## The hydration-flash trap

There is a catch that a naive version gets wrong. The server has no access to the
visitor's saved theme, so `getServerScheme` has to return a stable default of
`"light"`. If nothing corrected that before paint, a dark-theme visitor would see
a light calendar for a beat and then a flip, which is exactly the flash I was
trying to avoid.

Two things prevent it. An inline script in the document `<head>` sets `data-theme`
on `<html>` before React hydrates; it is the standard anti-flash trick, and it
means the DOM already reflects the real theme by the time the client renders. And
`useSyncExternalStore` reads the client snapshot immediately on hydration, so
`getResolvedScheme` sees that already-correct `data-theme` and paints the calendar
in the right palette on the very first client frame.

I verified it the boring way: a headless browser with `localStorage.theme` set to
`"dark"`, loading the page cold and asserting that the first painted cell uses the
dark palette rather than the light one. It does.

## One store, two consumers

The tell that this was the right abstraction is that my theme toggle button needed
the identical subscribe and snapshot logic. Rather than keep two copies in sync by
hand, I pulled the whole thing into a `src/lib/theme` module, holding
`getThemeSnapshot`, `subscribeToTheme`, `getResolvedScheme`, and `applyTheme`, and
both the toggle and the calendar now consume it. One cached `MediaQueryList`, one
source of truth.

## The takeaway

Whenever you sync UI to something outside React, whether a third-party widget to
your theme, a component to `localStorage`, or anything DOM-shaped or
query-shaped, `useSyncExternalStore` beats `useState` paired with `useEffect`, and
it is the piece that makes the first render correct instead of correcting it after
the fact. The consolidation is commit `e0a6b91` on
[anmolmalhan/Portfolio](https://github.com/anmolmalhan/Portfolio).
