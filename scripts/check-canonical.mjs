#!/usr/bin/env node
/**
 * Verify the canonical host actually serves the site.
 *
 * A canonical URL is a promise that this address is the real one. If it
 * redirects instead of serving, crawlers are pointed at a doorway and Google
 * falls back to guessing, which is what happened here: every page, the sitemap
 * and robots.txt named the apex while the apex 307'd to www, and `www` kept
 * working so nothing looked broken for weeks.
 *
 * Run after any DNS or Vercel domain change:
 *   npm run check:canonical
 */

const DEFAULT_ORIGIN = "https://anmolmalhan.com";
const origin = (process.argv[2] ?? DEFAULT_ORIGIN).replace(/\/$/, "");

/** Fetch without following redirects: a 3xx is exactly what we are hunting. */
async function head(url) {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "canonical-check" } });
  return { status: res.status, location: res.headers.get("location"), text: res };
}

const problems = [];
const note = (s) => console.log("  " + s);

console.log(`\nChecking canonical origin: ${origin}\n`);

// 1. The canonical origin must serve, not redirect.
const root = await head(`${origin}/`);
if (root.status >= 300 && root.status < 400) {
  problems.push(
    `${origin}/ returns ${root.status} -> ${root.location}\n` +
      `    The canonical host must serve the page itself. Either make this host\n` +
      `    primary in Vercel, or point the canonicals at ${root.location}.`,
  );
  note(`root: ${root.status} -> ${root.location}   FAIL`);
} else if (root.status !== 200) {
  problems.push(`${origin}/ returned ${root.status}, expected 200.`);
  note(`root: ${root.status}   FAIL`);
} else {
  note(`root: 200   ok`);
}

// 2. Every <link rel="canonical"> must name the canonical origin, and the URL
//    it names must itself resolve without a hop.
const ROUTES = ["/", "/about", "/projects", "/blog", "/contact"];
for (const route of ROUTES) {
  const res = await fetch(`${origin}${route}`, { headers: { "user-agent": "canonical-check" } });
  const html = await res.text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) {
    problems.push(`${route} has no <link rel="canonical">.`);
    note(`${route.padEnd(11)} no canonical   FAIL`);
    continue;
  }
  if (!canonical.startsWith(origin)) {
    problems.push(`${route} canonical points at ${canonical}, not ${origin}.`);
    note(`${route.padEnd(11)} ${canonical}   FAIL`);
    continue;
  }
  const target = await head(canonical);
  if (target.status !== 200) {
    problems.push(`${route} canonical ${canonical} returns ${target.status}, not 200.`);
    note(`${route.padEnd(11)} ${canonical} -> ${target.status}   FAIL`);
    continue;
  }
  note(`${route.padEnd(11)} ${canonical}   ok`);
}

// 3. robots.txt should advertise a sitemap on the same origin.
const robots = await fetch(`${origin}/robots.txt`).then((r) => r.text());
const sitemapLine = robots.match(/^sitemap:\s*(\S+)/im)?.[1];
if (!sitemapLine) {
  problems.push("robots.txt advertises no Sitemap.");
} else if (!sitemapLine.startsWith(origin)) {
  problems.push(`robots.txt points its Sitemap at ${sitemapLine}, not ${origin}.`);
  note(`robots     ${sitemapLine}   FAIL`);
} else {
  note(`robots     ${sitemapLine}   ok`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n`);
  for (const p of problems) console.error("  - " + p);
  console.error("");
  process.exit(1);
}
console.log("\nCanonical host serves directly and every page agrees.\n");
