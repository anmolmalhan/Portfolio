---
title: "The lint rule was right: I didn't need useState"
date: "2026-07-07"
excerpt: "Two react-hooks/set-state-in-effect errors that weren't lint noise — they were pointing at state that never belonged in React."
tags: ["react", "hooks", "usesyncexternalstore"]
---

React 19's ESLint plugin flagged two components in this portfolio with the same
error: `react-hooks/set-state-in-effect` — "Calling setState synchronously
within an effect can trigger cascading renders." My first instinct was to reach
for a suppression comment. My second, better instinct was to actually read what
the rule was telling me. In both cases it was right, and the fix made the code
smaller.

## Case one: a theme tracker that wasn't really state

The GitHub contributions calendar on my [about page](/about) has to follow the
site's light/dark theme, otherwise its empty cells clash with the card behind
them. The original code tracked the active theme like this:

```tsx
const [scheme, setScheme] = useState<"light" | "dark">("light");

useEffect(() => {
  setScheme(getActiveScheme());               // <- the flagged line
  const update = () => setScheme(getActiveScheme());
  const observer = new MutationObserver(update);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", update);
  return () => { observer.disconnect(); mq.removeEventListener("change", update); };
}, []);
```

The `setScheme(getActiveScheme())` on mount is the classic "sync state to an
external source in an effect" anti-pattern. On the first client render the
component paints with the default `"light"`, *then* the effect fires and flips
it — a second render, and a visible flash for anyone on the dark theme.

The theme isn't React state. It lives in the DOM (`data-theme` on `<html>`) and
in a media query. React 18 gave us the exact hook for "subscribe to a mutable
external source": `useSyncExternalStore`.

```tsx
const scheme = useSyncExternalStore(
  subscribeToScheme,   // register the MutationObserver + matchMedia listener
  getResolvedScheme,   // client snapshot: read data-theme, fall back to the media query
  getServerScheme,     // server snapshot: a stable "light"
);
```

No `useState`, no `useEffect`, no setState-in-effect. React reads the current
value on every render and re-renders only when the store notifies a change. The
subscribe/snapshot functions are plain, testable, and — because I later reused
them for the theme toggle too — moved into a shared `src/lib/theme` module.

## Case two: a nav indicator that wasn't state at all

The desktop header has a little underline that glides between nav links. It was
built like most people would build it: measure the active link in an effect, and
store the position in state.

```tsx
const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

useEffect(() => {
  moveIndicator(activeIndex);   // reads getBoundingClientRect, then setIndicator(...)
  // ...resize listener
}, [activeIndex]);
```

Same lint error, different lesson. This one isn't an external store — it's
*decoration derived from layout*. The indicator's position doesn't drive
anything else in React; nothing reads `indicator.left` except the indicator. So
routing it through state buys nothing and costs a render every time it moves.

The fix is to write to the DOM directly through a ref, exactly the way the
magnetic hover effect on the same links already worked:

```tsx
const moveIndicator = useCallback((index: number) => {
  const indicator = indicatorRef.current;
  const link = index >= 0 ? linkRefs.current[index] : null;
  if (!indicator) return;
  if (!link) { indicator.style.opacity = "0"; return; }
  const lr = navListRef.current!.getBoundingClientRect();
  const r = link.getBoundingClientRect();
  indicator.style.left = `${r.left - lr.left}px`;
  indicator.style.width = `${r.width}px`;
  indicator.style.opacity = "1";
}, []);
```

## The takeaway

Both errors were the linter noticing that I'd modelled something as React state
when it wasn't. There are two escape hatches worth internalizing:

- **If the value comes from a mutable source React doesn't own** — the DOM, a
  media query, `localStorage`, a browser API — reach for `useSyncExternalStore`,
  not `useState` + `useEffect`.
- **If the value is purely visual and nothing in React reads it back** — a
  cursor position, a sliding underline — write it to the DOM through a ref and
  skip the render entirely.

The fix is commit `061f786` on
[anmolmalhan/Portfolio](https://github.com/anmolmalhan/Portfolio). Two lint
errors, minus a `useState` and a `useEffect` each, and one fewer flash on load.
