import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("home renders the hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Anmol Malhan/i);
    await expect(page.getByText("THINK.", { exact: true })).toBeVisible();
    await expect(page.getByText("CODE.", { exact: true })).toBeVisible();
    await expect(page.getByText("SHIP.", { exact: true })).toBeVisible();
  });

  test("hero text reveal lands at translate(0), guards GSAP/CSS conflict", async ({ page }) => {
    await page.goto("/");
    // Hero tween is 0.2s delay + 1.4s duration + 0.2s worst-case stagger.
    // Allow a generous tail for slower CI hardware before reading the final state.
    await page.waitForTimeout(2500);
    const matrices = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>(".hero-line span")).map(
        (s) => getComputedStyle(s).transform
      )
    );
    expect(matrices).toHaveLength(3);
    // Final state should be identity-translate. We round to tolerate sub-px
    // float dust from GSAP's tween precision.
    for (const m of matrices) {
      const match = m.match(/matrix\(1, 0, 0, 1, (-?[\d.e-]+), (-?[\d.e-]+)\)/);
      expect(match, `expected identity-translate matrix, got: ${m}`).not.toBeNull();
      const [tx, ty] = [Number(match![1]), Number(match![2])];
      expect(Math.abs(tx)).toBeLessThan(0.5);
      expect(Math.abs(ty)).toBeLessThan(0.5);
    }
  });

  test("projects listing links to a case study", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: "Projects", level: 1 })).toBeVisible();

    const tripmatesHeading = page.getByRole("heading", { name: "Tripmates", level: 2 });
    await expect(tripmatesHeading).toBeVisible();

    const swiftSevaHeading = page.getByRole("heading", { name: "Swift Digital Seva", level: 2 });
    await expect(swiftSevaHeading).toBeVisible();
  });

  test("project case study renders structured sections", async ({ page }) => {
    await page.goto("/projects/tripmates");
    await expect(page.getByRole("heading", { name: "Tripmates", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The Problem" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Stack", exact: true })).toBeVisible();
  });

  test("swift digital seva case study renders", async ({ page }) => {
    await page.goto("/projects/swift-digital-seva");
    await expect(page.getByRole("heading", { name: "Swift Digital Seva", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Architecture" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Stack", exact: true })).toBeVisible();
  });

  test("old client-work-os slug redirects to swift-digital-seva", async ({ page }) => {
    await page.goto("/projects/client-work-os");
    await expect(page).toHaveURL(/\/projects\/swift-digital-seva$/);
    await expect(page.getByRole("heading", { name: "Swift Digital Seva", level: 1 })).toBeVisible();
  });

  test("contact page exposes form and fallback channels", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "Contact", level: 1 })).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /github/i }).first()).toBeVisible();
  });

  test("contact form submits and reaches the success terminal", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel(/name/i).fill("Ada Lovelace");
    await page.getByLabel(/email/i).fill("ada@example.com");
    await page.getByLabel(/message/i).fill("Hello — interested in working together.");

    // No RESEND_API_KEY in dev → server action returns mode: "mailto" → client
    // flow appends logs and ends at the "Transmission Complete" success state.
    // The mailto: handoff that follows is a no-op in headless Chromium.
    await page.getByRole("button", { name: /await transmit/i }).click();
    await expect(page.getByText(/Transmission Complete/i)).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole("button", { name: /reset/i })).toBeVisible();
  });

  test("home footer contact CTA navigates to /contact", async ({ page }) => {
    await page.goto("/");
    // Scroll to the bottom so the fixed-reveal footer is fully on-screen
    // and `inert` flips off via the IntersectionObserver.
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }));
    const cta = page.getByRole("link", { name: /Execute Contact/i });
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("unknown route renders the 404 page", async ({ page }) => {
    const res = await page.goto("/this-route-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("404: route not found")).toBeVisible();
  });

  // The notes section was removed. These cover the redirects that replaced it,
  // so the indexed URLs stay proven rather than silently rotting into 404s.
  test("removed notes routes redirect home", async ({ page }) => {
    await page.goto("/notes");
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/notes/hero-text-invisible-for-2-5-seconds");
    await expect(page).toHaveURL(/\/$/);

    // Nested paths too — a bare "/notes" redirect source would not catch these.
    await page.goto("/notes/rss.xml");
    await expect(page).toHaveURL(/\/$/);
  });

  test("tools nav entry is present but not navigable", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByText("Tools", { exact: true })).toBeVisible();
    await expect(nav.getByText("Soon", { exact: true })).toBeVisible();
    // It must not be a link, or it would advertise a route that does not exist.
    await expect(nav.getByRole("link", { name: /^Tools/ })).toHaveCount(0);
  });
});
