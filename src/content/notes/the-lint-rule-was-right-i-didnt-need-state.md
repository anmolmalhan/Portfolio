---
title: "The lint rule was right: I didn't need state"
date: "2026-07-07"
excerpt: "Two setState-in-effect lint errors, two different fixes, and neither of them was a suppression comment."
tags: ["react", "hooks", "refactoring"]
---

This site's lint run had been failing with two errors for a while, both the same
rule: `react-hooks/set-state-in-effect`. The tempting move was an
`eslint-disable` comment — the site worked, the animations were smooth, and the
rule reads like pedantry:

```
Calling setState synchronously within an effect can trigger cascading renders
```

But every time this rule has fired on my code, it's been pointing at the same
underlying smell: *state that was never really state*. So instead of
suppressing it, I looked at what each effect was actually doing. The two fixes
ended up being completely different, which is the interesting part.

## Case one: subscribing to something external

The GitHub contribution calendar on my about page has to follow the site theme,
so I was tracking the resolved scheme in state:

```tsx
const [scheme, setScheme] = useState<"light" | "dark">("light");

useEffect(() => {
  setScheme(getActiveScheme());   // ← the lint error

  const update = () => setScheme(getActiveScheme());
  const observer = new MutationObserver(update);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  // ...plus a matchMedia listener, plus cleanup
}, []);
```

The synchronous `setScheme` on mount is there because the server renders
"light" and the client needs to correct it. Which means: render once with the
wrong value, run the effect, set state, render again. A guaranteed double
render on every mount, by design.

React has a hook whose entire job is this exact shape — read a value from an
external source, subscribe to changes, and provide a server-side fallback:

```tsx
const scheme = useSyncExternalStore(
  subscribeToScheme,      // MutationObserver + matchMedia, returns cleanup
  getActiveScheme,        // client snapshot
  () => "light",          // server snapshot
);
```

The component went from 20 lines of subscription bookkeeping to one hook call.
The theme (`data-theme` attribute plus the OS preference) *is* an external
store; I'd just never labelled it that way in my head.

## Case two: state that was never state

The header nav has a little underline that glides between links. I stored its
position in state, measured the DOM in an effect, and set it:

```tsx
const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

useEffect(() => {
  moveIndicator(activeIndex);   // measures a link, calls setIndicator
  // ...
}, [activeIndex, moveIndicator]);
```

Same rule, same complaint. But `useSyncExternalStore` is wrong here — there's
no external source. The real question the rule forced me to ask was: *does
anything render differently because of this value?* And the answer was no. The
indicator is `aria-hidden`, purely decorative, and its position affects exactly
one element's inline style. Nothing else reads it.

That's not state. That's a style write with extra steps. The same file already
moved link labels around with direct style mutation for the magnetic-hover
effect, so the fix was to make the indicator consistent with that:

```tsx
const indicatorRef = useRef<HTMLSpanElement | null>(null);

const moveIndicator = useCallback((index: number) => {
  const indicator = indicatorRef.current;
  const link = index >= 0 ? linkRefs.current[index] : null;
  if (!indicator) return;
  if (!link) {
    indicator.style.opacity = "0";
    return;
  }
  const r = link.getBoundingClientRect();
  indicator.style.left = `${r.left - listRect().left}px`;
  indicator.style.width = `${r.width}px`;
  indicator.style.opacity = "1";
}, []);
```

No state, no re-render, the CSS transition still does the gliding. Hovering a
nav link now costs a style write instead of a component render.

## What I took away

**A lint error is a prompt, not a verdict.** The rule couldn't tell me the fix
— it flagged two identical-looking lines that needed opposite treatments. One
value was a genuine external subscription wearing a `useEffect` costume; the
other wasn't a value at all, just a DOM write routed through the render cycle
for no reason.

**The question that sorts them is "who reads this?"** If other JSX branches on
the value, it's state. If an external system owns it, it's
`useSyncExternalStore`. If exactly one element's style consumes it and nothing
else cares, write the style.

**Suppression comments have a compounding cost.** If I'd disabled the rule
twice, the next setState-in-effect would have looked normal next to them.
Fixing both meant the rule stays trustworthy — the next time it fires on this
repo, it's a real signal.
