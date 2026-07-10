---
title: "Renaming a Next.js route without losing SEO"
date: "2026-07-08"
excerpt: "A case study rebrand meant changing a slug. Here is how to move a URL without 404-ing the old one or throwing away its link equity."
tags: ["nextjs", "seo", "redirects"]
---

One of my case studies began life as "Client Work OS" and lived at
`/projects/client-work-os`. When the underlying product pivoted and rebranded to
Swift Digital Seva, the [case study](/projects/swift-digital-seva) had to follow,
with a new title, new copy, and, more delicately, a new URL. Changing a slug
sounds trivial. Doing it without breaking anything a search engine or a shared
link already knows about takes a little care.

## What changing the slug actually touches

My projects are data-driven, so the slug lives in exactly one place:

```ts
{ id: "2", slug: "swift-digital-seva", title: "Swift Digital Seva", /* ... */ }
```

`generateStaticParams` reads that array, so the new page prerenders and the old
`/projects/client-work-os` simply stops existing. The sitemap is generated from
the same data, so it updates itself. The canonical tag and the auto-generated
Open Graph image both key off the slug, so they move too. All well and good,
except that every link to the old URL now returns a 404. Anything Google had
indexed, anything I had shared, dead.

## The 308 that saves the link equity

The remedy is a permanent redirect declared in `next.config.ts`:

```ts
async redirects() {
  return [
    {
      source: "/projects/client-work-os",
      destination: "/projects/swift-digital-seva",
      permanent: true,   // 308, which passes ranking signals to the new URL
    },
  ];
}
```

Setting `permanent: true` emits a 308, the modern permanent redirect, where
`permanent: false` would give a temporary 307. The distinction matters for SEO. A
permanent redirect tells search engines that the page has moved for good and that
they should transfer everything they knew about the old URL to the new one. A
temporary redirect tells them to keep the old URL indexed instead. For a rename,
you almost always want permanent.

I confirmed the behaviour against the running app rather than trusting the config:

```
/projects/swift-digital-seva -> 200
/projects/client-work-os     -> 308  (Location: /projects/swift-digital-seva)
```

## Lock it down with a test

A redirect is precisely the kind of thing that rots in silence. Someone deletes
the rule during a refactor, nobody notices, and an old link starts returning a 404
in production. So it earns a smoke test:

```ts
test("old client-work-os slug redirects to swift-digital-seva", async ({ page }) => {
  await page.goto("/projects/client-work-os");
  await expect(page).toHaveURL(/\/projects\/swift-digital-seva$/);
  await expect(page.getByRole("heading", { name: "Swift Digital Seva", level: 1 })).toBeVisible();
});
```

## The checklist

If you are renaming a route in Next.js and care about keeping your traffic, five
things matter. Change the slug in one place if your content is data-driven, so the
sitemap and static params follow on their own. Add a `permanent: true` redirect
from the old path to the new one, and never leave the old URL returning a 404.
Verify that the status code is a 308 or a 301 rather than a 307, and that it lands
on a 200 rather than another redirect hop. Point the canonical at the final host,
not one that itself redirects, since a canonical aimed at a redirecting URL wastes
the signal. And write a test, so the redirect cannot quietly disappear.

The rename is commit `22cad16` on
[anmolmalhan/Portfolio](https://github.com/anmolmalhan/Portfolio). Google will
follow the 308 on its next crawl and carry the old URL's history across to the new
one, with no ranking reset and no dead links.
