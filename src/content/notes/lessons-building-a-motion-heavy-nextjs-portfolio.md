---
title: "Ten things I learned building a motion-heavy Next.js portfolio"
date: "2026-07-10"
excerpt: "The non-obvious lessons from shipping this site: animation, accessibility, and the SEO gotchas that only surface once it is live."
tags: ["nextjs", "gsap", "frontend"]
---

This portfolio runs on Next.js 16, React 19, Tailwind v4, GSAP, and Lenis, and it
is deliberately animation-heavy: smooth scroll, a custom cursor, scroll-reveals,
a horizontal project gallery. Almost nothing that broke was the animation itself.
The trouble lived in the seams, in the places where animation meets server
rendering, where JavaScript meets its own absence, where the design meets a
screen reader. Here are ten lessons that cost me time, offered so they cost you
less. Several have their own deep-dive posts, linked as they come up.

## 1. Do not split an animation's initial state between CSS and JS

Set a starting `transform` in CSS and again in your animation library, and the
library will read the CSS value and stack its own on top. My hero text ended up
translated twice as far as intended, and it stayed hidden. The full account is in
[a separate post](/notes/hero-text-invisible-for-2-5-seconds), and the fix came
down to a single word. The rule that came out of it is simple: define the initial
state entirely in CSS or entirely in JavaScript, never half in each.

## 2. Not everything belongs in React state

Two values I had modelled as `useState` did not belong in React at all. The site
theme lives in the DOM and a media query, which makes it a job for
`useSyncExternalStore`. A decorative sliding underline is read by nothing, which
makes it a job for a ref. Removing the state removed a render and, with it, a
flash on load. The lint rule that caught both is the subject of
[its own note](/notes/the-lint-rule-was-right-i-didnt-need-usestate).

## 3. Give anything JavaScript reveals a no-JS fallback

My scroll-reveals begin at `opacity: 0` and fade in when an IntersectionObserver
fires. Should the JavaScript never run, that content stays invisible for good. The
safeguard is a `<noscript>` block in the document head that forces the revealed
state:

```html
<noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>
```

Content below the fold that depends on JavaScript to appear is a quiet trap.
Always leave it a way out.

## 4. Give JavaScript-driven reveals a CSS safety net

The same principle, one level up. My hero's largest text is hidden until GSAP
animates it in, so a failure to load GSAP would mean the most important words on
the page never arrive. A small CSS keyframe that forces the final state after a
couple of seconds guarantees the text appears even when the script does not.
Anything that gates your largest contentful paint deserves that kind of
insurance.

## 5. Keep animation libraries off the critical path

GSAP and Lenis together weigh roughly 60KB of JavaScript that nothing needs for
the first paint. Shipping them in the initial bundle on every route is pure waste.
Loading them through `next/dynamic` with `ssr: false`, wrapped in a small client
component, defers them until after hydration. Smooth scroll and the animations
still work; they simply no longer stand in the way of the first render.

## 6. Respect prefers-reduced-motion, and give the cursor back

Every animation on the site returns early under
`prefers-reduced-motion: reduce`. The detail people miss: when you replace the
system cursor with a custom one, reduced-motion users should have their native
pointer returned to them, so gate `cursor: none` behind the same query. Tailwind's
`animate-pulse` is another culprit, since it keeps animating unless you reset it
yourself.

## 7. Set the theme before the first paint

A theme toggle that reads `localStorage` inside a `useEffect` shows the wrong
theme for a single frame on every load. A tiny inline script in the `<head>` that
sets `data-theme` before React hydrates removes the flash completely. It is the
rare case where a blocking inline script is exactly the right call.

## 8. Rename routes with a permanent redirect

When I rebranded a case study, its URL changed with it. A `permanent: true` (308)
redirect in `next.config.ts` keeps every old link alive and carries its search
ranking over to the new address. Point your canonical tags at the host that wins
the redirect as well, never at one that redirects again. The whole story sits in
[a dedicated post](/notes/renaming-a-nextjs-route-without-losing-seo).

## 9. Verify in a real browser, not only in unit tests

Unit tests pass happily while the actual page is broken. Every real bug on this
site, from the stacked transform to the theme flash to a cropped screenshot, was
caught by driving a genuine browser and asserting on computed styles and rendered
output. A handful of Playwright smoke tests will surface more true regressions
than a hundred unit tests of pure functions.

## 10. The small accessibility details bite hardest

Two shipped broken and revealed themselves only on a careful review. A "message
sent" state hidden with `aria-hidden` still kept its inputs in the tab order,
which is a keyboard trap; the `inert` attribute is the correct tool. And
low-opacity mono text at forty percent failed WCAG contrast. Neither surfaces in
a casual glance, yet both matter to real people.

## The thread running through all of it

Nearly every one of these lessons lives at a boundary: animation against server
rendering, JavaScript against its absence, design against assistive technology.
The pretty surface of a portfolio is the easy part. The lessons hide in the joints
between the parts. If you are building something in the same spirit and run into
one of these, the linked posts go further, and the entire site is open source at
[anmolmalhan/Portfolio](https://github.com/anmolmalhan/Portfolio).
