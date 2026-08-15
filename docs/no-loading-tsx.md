# Why there is no root `loading.tsx`

There used to be a `src/app/loading.tsx` rendering `[booting] compiling route...`.
It was deleted deliberately. Adding one back reintroduces a real bug, so read
this first.

## What went wrong

A `loading.tsx` at the app root wraps **every** route in a Suspense boundary.
React's streaming SSR then emits two things into the HTML:

1. the fallback, in the visible tree, and
2. the real page, inside `<div hidden id="S:0">`,

and swaps them with an inline `<script>` once it runs.

That script is the only thing that performs the swap. With JavaScript
unavailable — blocked, failed to load, an extension, a flaky network — the swap
never happens, so every route sat on the loader forever. The page was fully
present in the DOM (36,165 characters of it) and 137 characters were visible.

Not a degraded page. A page that looks hung.

## Why it was not fixed with CSS

The obvious fix is a `<noscript>` block that hides the fallback and un-hides the
streamed content:

```css
[data-route-loading]{display:none!important}
div[hidden][id^="S:"]{display:contents!important}
```

The first rule works. The second cannot. Chrome's user-agent stylesheet declares

```css
[hidden]:not([hidden="until-found"]) { display: none !important; }
```

and in the CSS cascade **user-agent `!important` beats author `!important`**. No
author stylesheet can reveal a `hidden` element. This was measured, not assumed:
with the rule applied and matching (`querySelectorAll` found the node), computed
`display` stayed `none`.

## What was done instead

Deleted the file, which removes the Suspense boundary and the streaming split
along with it. Measured immediately after, with JavaScript disabled:

| Route    | Before | After |
| -------- | -----: | ----: |
| `/`      |    137 |  1234 |
| `/about` |    210 |  1253 |
| `/blog`  |    210 |   566 |

(visible characters; hidden suspense divs went from 1 to 0 on every route)

## What it costs

There is no route-transition loading UI. That is affordable here because every
route except `/contact` is statically prerendered and `<Link>` prefetches them,
so navigation is effectively instant — the loader was announcing a compile step
that does not happen in production.

## If you want one back

Do not put it at the app root. Scope it to a segment that is genuinely slow and
dynamic, and re-run the no-JS check in `tests/e2e/smoke.spec.ts`
("site is readable when JavaScript is unavailable"), which fails if a route
starts hiding its content behind a streaming fallback again.
