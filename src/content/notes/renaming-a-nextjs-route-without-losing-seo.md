---
title: "Renaming a Next.js route without losing SEO"
date: "2026-07-08"
excerpt: "A case study rebrand meant changing a slug. Here's how to move a URL without 404-ing the old one or throwing away its link equity."
tags: ["nextjs", "seo", "redirects"]
---

One of my case studies started life as "Client Work OS" and lived at
`/projects/client-work-os`. When the underlying product pivoted and rebranded to
Swift Digital Seva, the [case study](/projects/swift-digital-seva) had to follow
— new title, new copy, and, more delicately, a new URL. Changing a slug sounds
trivial. Doing it without breaking anything a search engine or a shared link
already knows about takes a little care.

## What "changing the slug" actually touches

My projects are data-driven, so the slug lives in one place:

```ts
{ id: "2", slug: "swift-digital-seva", title: "Swift Digital Seva", /* ... */ }
```

`generateStaticParams` reads that array, so the new page prerenders and the old
`/projects/client-work-os` simply stops existing. The sitemap is generated from
the same data, so it updates itself. The canonical tag and the auto-generated OG
image both key off the slug, so they move too. So far so good — except every
link to the old URL now 404s. Anything Google had indexed, anything I'd shared,
dead.

## The 308 that saves the link equity

The fix is a permanent redirect declared in `next.config.ts`:

```ts
async redirects() {
  return [
    {
      source: "/projects/client-work-os",
      destination: "/projects/swift-digital-seva",
      permanent: true,   // 308 — passes ranking signals to the new URL
    },
  ];
}
```

`permanent: true` emits a **308** (the modern permanent redirect; `permanent:
false` gives a temporary 307). The distinction matters for SEO: a permanent
redirect tells search engines "this moved for good — transfer what you knew about
the old URL to the new one." A temporary one tells them to keep the old URL
indexed. For a rename, you almost always want permanent.

I confirmed the behaviour against the running app rather than trusting the config:

```
/projects/swift-digital-seva -> 200
/projects/client-work-os     -> 308  (Location: /projects/swift-digital-seva)
```

## Lock it down with a test

A redirect is exactly the kind of thing that silently rots — someone deletes the
rule during a refactor and nobody notices until an old link 404s in production.
So it gets a smoke test:

```ts
test("old client-work-os slug redirects to swift-digital-seva", async ({ page }) => {
  await page.goto("/projects/client-work-os");
  await expect(page).toHaveURL(/\/projects\/swift-digital-seva$/);
  await expect(page.getByRole("heading", { name: "Swift Digital Seva", level: 1 })).toBeVisible();
});
```

## The checklist

If you're renaming a route in Next.js and care about not losing traffic:

1. **Change the slug in one place** if your content is data-driven, so the sitemap
   and static params follow automatically.
2. **Add a `permanent: true` redirect** from the old path to the new one — never
   leave the old URL 404-ing.
3. **Verify the status code** is a 308 (or 301), not a 307, and that it lands on a
   200, not another redirect hop.
4. **Point the canonical at the final host**, not one that itself redirects — a
   canonical to a redirecting URL wastes the signal.
5. **Write a test** so the redirect can't quietly disappear.

The rename is commit `22cad16` on
[anmolmalhan/Portfolio](https://github.com/anmolmalhan/Portfolio). Google will
follow the 308 on its next crawl and carry the old URL's history over to the new
one — no ranking reset, no dead links.
