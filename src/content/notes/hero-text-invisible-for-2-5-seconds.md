---
title: "Why my hero text was invisible for 2.5 seconds"
date: "2026-05-22"
excerpt: "A debug story about GSAP, CSS, and an inline transform that wasn't doing what I thought."
tags: ["gsap", "css", "debugging"]
---

Last week I shipped a hero animation that worked fine in dev and looked broken in
production. The four words `THINK / & / CODE / SCALE` were supposed to slide up
into view over 1.6 seconds. Instead they were just... absent. Empty space. Then
at exactly 2.5 seconds, all four words *snapped* into place with no animation
at all.

This is the story of what was actually happening, what I assumed was happening,
and why "just zero the `y`" was the one-line fix.

## The setup

The hero markup is roughly this:

```tsx
<div className="reveal-wrapper">
  <span className="hero-line">THINK</span>
</div>
```

`reveal-wrapper` clips with `overflow: hidden`. The hero text starts pushed below
the wrapper (so it's clipped out of view) and animates up to `translateY(0)`.

For SSR-safety, the initial hidden state is set in CSS:

```css
.hero-line span {
  transform: translateY(120%);
  animation: hero-line-reveal-fallback 0.01s 2.5s linear forwards;
}

@keyframes hero-line-reveal-fallback {
  to { transform: translateY(0); }
}
```

That second line is a safety net: if GSAP fails to load for any reason, the
text still becomes visible after 2.5 seconds. Belt and braces.

Then GSAP takes over on mount:

```ts
useLayoutEffect(() => {
  const lines = gsap.utils.toArray<HTMLElement>(".hero-line span");
  gsap.set(lines, { yPercent: 120 });
  gsap.to(lines, { yPercent: 0, duration: 1.4, stagger: 0.1, delay: 0.2 });
}, []);
```

Read it carefully. We set the spans to `yPercent: 120` (same as the CSS) and
tween them back to `0`. Nothing fancy. This is the most ordinary GSAP code in
the world.

## The symptom

The text never moved. The user (me, scrolling my own deploy) saw a blank hero
for 2.5 seconds, then the words appeared with no transition.

I dropped into Playwright and dumped the computed style of one of the spans 2
seconds after page load:

```
matrix(1, 0, 0, 1, 0, 124.406)
```

Translated 124.4px on the Y axis. Should have been 0. The tween finished but
the spans hadn't moved.

## The investigation

Initially I assumed the tween was getting killed by React StrictMode double-mount.
That's the boring usual suspect. So I logged GSAP tween state inside the
animation context. Tween ran. Tween completed.

Then I looked at the *inline* transform, not the computed one:

```
translate(0%, 120%) translate(0px, 124.406px)
```

Two transforms. Stacked.

GSAP's CSS plugin had read the existing computed style — which was the CSS
rule's `translateY(120%)`, resolved to a pixel matrix — and parsed it back
into a pixel `y` value. Then my `gsap.set({ yPercent: 120 })` *added* a 120%
yPercent translation on top, without zeroing the pixel `y` it had inferred.

End result: the spans were translated 240% of their height down, not 120%.
Twice as far. Far enough that even when the tween finished and `yPercent`
went to 0, the `y: 124.406` pixel offset remained inline. The spans were
still hidden.

The CSS fallback animation snapping in at 2.5 seconds was overriding the
broken inline transform — which is why the text suddenly appeared at exactly
that mark.

## The fix

One word:

```ts
gsap.set(lines, { yPercent: 120, y: 0 });
```

Explicitly zero the pixel `y` so it doesn't stack with the percent-based
`yPercent`. GSAP now emits a single, clean transform: `translate(0%, 120%)`.
The tween animates the percent component back to 0. The text slides in like
it was supposed to.

## What I took away

Three things.

**One: when in doubt, look at the inline style, not the computed style.** The
computed matrix flattens everything into one transform, which makes it look
like a single source of truth. The inline style shows you what each plugin
*actually wrote*. They can disagree, and when they do, the inline reveals the
plugin order of operations.

**Two: CSS-derived initial states are landmines for transform plugins.** Any
animation library that reads existing transforms (GSAP, anime.js, Framer
Motion, Motion One — most of them) will inherit whatever you set in CSS. If
you mix unit systems, you get stacking. If you avoid mixing, you don't. The
safest pattern is to either set the initial state entirely in JS or entirely
in CSS, not split between the two.

**Three: defensive CSS fallbacks deserve scrutiny too.** My
`hero-line-reveal-fallback` was meant to save users when GSAP failed. In this
case it actively hid the bug — by snapping the text into view at 2.5 seconds,
it made the bug *look* like a delay rather than a stuck transform. If I hadn't
had it, I'd have noticed within seconds. Belt-and-braces patterns can mask
the very failure they're protecting against.

## The PR

If you want to see the actual fix in the repo, it's commit `5899061`
on [anmolmalhan/portfolio-1](https://github.com/anmolmalhan/portfolio-1).
Five-line diff, hours of debugging, one good takeaway.
