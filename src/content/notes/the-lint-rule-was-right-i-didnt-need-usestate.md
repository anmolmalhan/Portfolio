---
title: "The lint rule was right: I didn't need useState"
date: "2026-07-07"
excerpt: "Two react-hooks/set-state-in-effect errors that were not lint noise. They were pointing at state that never belonged in React."
tags: ["react", "hooks", "usesyncexternalstore"]
---

React 19's ESLint plugin flagged two components in this portfolio with the same
error: `react-hooks/set-state-in-effect`, warning that calling setState
synchronously within an effect can trigger cascading renders. My first instinct
was to reach for a suppression comment. My second and better instinct was to read
what the rule was actually telling me. In both cases it was right, and heeding it
left the code smaller.

## Case one: a theme tracker that was never really state

The GitHub contributions calendar on my [about page](/about) has to follow the
site's light and dark theme, or its empty cells clash with the card behind them.
The original code tracked the active theme like this:

```tsx
const [scheme, setScheme] = useState<"light" | "dark">("light");

useEffect(() => {
  setScheme(getActiveScheme());               // the flagged line
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

That `setScheme(getActiveScheme())` on mount is the classic anti-pattern of
syncing state to an external source inside an effect. On the first client render
the component paints with the default of `"light"`, and only then does the effect
fire and flip it. That means a second render, and a visible flash for anyone on
the dark theme.

The theme is not React state. It lives in the DOM, on the `data-theme` attribute
of `<html>`, and in a media query. React 18 already gave us the exact hook for
subscribing to a mutable external source, `useSyncExternalStore`:

```tsx
const scheme = useSyncExternalStore(
  subscribeToScheme,   // register the MutationObserver and matchMedia listener
  getResolvedScheme,   // client snapshot: read data-theme, fall back to the media query
  getServerScheme,     // server snapshot: a stable "light"
);
```

No `useState`, no `useEffect`, no setState inside an effect. React reads the
current value on every render and re-renders only when the store announces a
change. The subscribe and snapshot functions are plain and testable, and because
I later reused them for the theme toggle, they now live in a shared
`src/lib/theme` module.

## Case two: a nav indicator that was not state at all

The desktop header carries a small underline that glides between nav links. It
was built the way most people would build it: measure the active link in an
effect, then store the position in state.

```tsx
const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

useEffect(() => {
  moveIndicator(activeIndex);   // reads getBoundingClientRect, then setIndicator(...)
  // resize listener
}, [activeIndex]);
```

Same lint error, different lesson. This one is not an external store; it is
decoration derived from layout. The indicator's position drives nothing else in
React, since nothing reads `indicator.left` except the indicator itself. Routing
it through state buys nothing and costs a render every time it moves.

The fix is to write to the DOM directly through a ref, exactly the way the magnetic
hover effect on the same links already worked:

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

Both errors were the linter noticing that I had modelled something as React state
when it was nothing of the sort. Two escape hatches are worth committing to
memory. When the value comes from a mutable source React does not own, whether the
DOM, a media query, `localStorage`, or a browser API, reach for
`useSyncExternalStore` rather than `useState` paired with `useEffect`. When the
value is purely visual and nothing in React reads it back, such as a cursor
position or a sliding underline, write it to the DOM through a ref and skip the
render entirely.

The fix is commit `061f786` on
[anmolmalhan/Portfolio](https://github.com/anmolmalhan/Portfolio): two lint
errors resolved, one `useState` and one `useEffect` each removed, and one fewer
flash on load.
