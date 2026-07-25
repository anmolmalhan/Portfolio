import type { FullConfig } from "@playwright/test";

/**
 * Warm every route before the suite runs.
 *
 * Locally the webServer is `next dev`, which compiles each route on first
 * request. With `fullyParallel`, several workers hit cold routes at once and a
 * first compile can outlast the 5s expect timeout — producing failures that
 * pass on re-run and look like flaky tests rather than a cold cache.
 *
 * Fetching each route once, sequentially, moves that compile cost here where
 * it is allowed to be slow. Retries would only have hidden the symptom.
 */
const ROUTES = [
  "/",
  "/projects",
  "/projects/tripmates",
  "/projects/swift-digital-seva",
  "/contact",
  "/about",
  "/this-route-does-not-exist",
];

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use?.baseURL;
  if (!baseURL) return;

  for (const route of ROUTES) {
    try {
      // Sequential on purpose: parallel warmup just recreates the stampede.
      await fetch(new URL(route, baseURL), { redirect: "follow" });
    } catch {
      // A route that fails to warm will surface as a real test failure; the
      // suite should not be blocked from starting because of it.
    }
  }
}
