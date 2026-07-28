import { defineConfig, devices } from "@playwright/test";

// Use a project-specific default port so the suite never silently reuses an
// unrelated dev server sitting on the shared :3000 (which would test the wrong
// app). Override with PORT if needed.
const PORT = Number(process.env.PORT ?? 3210);
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  // Compiles every route once before the workers start. `next dev` builds
  // routes on first request, and parallel workers hitting cold routes could
  // outlast the expect timeout — failures that passed on re-run and read as
  // flakiness. See the file for why this beats adding retries.
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // CI builds + serves the production output for realistic timing;
    // local dev hits `next dev` so iteration is fast. PORT is threaded through
    // so Next binds the same port Playwright waits on.
    command: process.env.CI ? "npm run start" : "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { NEXT_PUBLIC_SITE_URL: BASE_URL, PORT: String(PORT) },
  },
});
