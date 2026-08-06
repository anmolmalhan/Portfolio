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

  test("command palette opens, filters, and navigates", async ({ page }) => {
    await page.goto("/");
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeHidden();

    // The chord is the primary entry point. ControlOrMeta keeps this passing on
    // both the macOS dev machine and the Linux CI runner.
    await page.keyboard.press("ControlOrMeta+k");
    await expect(dialog).toBeVisible();

    await page.keyboard.type("speedo");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects\/speedometx$/);

    // Escape must close it, or keyboard users get trapped.
    await page.keyboard.press("ControlOrMeta+k");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("command palette has a visible trigger and can set the theme", async ({ page }) => {
    await page.goto("/");
    // A shortcut with no affordance is undiscoverable, so the header button
    // must open the same palette.
    await page.getByRole("button", { name: /open command palette/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.type("light");
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("blog nav entry navigates to the post index", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("link", { name: /^Blog/ }).click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(page.getByRole("heading", { level: 1, name: "Blog" })).toBeVisible();
  });

  test("blog index lists posts and each one opens", async ({ page }) => {
    await page.goto("/blog");

    // The index reads frontmatter through gray-matter without compiling any
    // MDX. If that path breaks it renders the "First post is on its way."
    // empty state rather than throwing, so assert on real entries.
    const entries = page.locator('a[href^="/blog/"]');
    const count = await entries.count();
    expect(count).toBeGreaterThan(0);

    await entries.first().click();
    await expect(page).toHaveURL(/\/blog\/[a-z0-9-]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("a post renders body copy, MDX components, and highlighted code", async ({ page }) => {
    await page.goto("/blog/run-claude-code-from-your-phone");

    await expect(
      page.getByRole("heading", { level: 1, name: /Run Claude Code From Your Phone/i })
    ).toBeVisible();

    // The body is pulled in by a templated dynamic import
    // (`@/content/blog/${slug}.mdx`). Nothing else in the suite exercises it,
    // and a broken specifier fails at request time, not at build time.
    await expect(page.getByRole("heading", { level: 2, name: "The setup" })).toBeVisible();

    // Custom components resolved through mdx-components.tsx. A missing mapping
    // renders the raw tag name instead of the component and would otherwise
    // pass unnoticed.
    await expect(page.locator("figure").first()).toBeVisible();

    // rehype-pretty-code runs Shiki at build time and tags each token with
    // --shiki-light/--shiki-dark. If highlighting silently stops, the block
    // still renders as plain text, so assert on a coloured token specifically.
    const code = page.locator("pre.mdx-code").first();
    await expect(code).toBeVisible();
    await expect(code.locator('span[style*="--shiki"]').first()).toBeVisible();

    // Code inside a fence must not inherit the 0.875em inline-code scaling.
    // Regression guard: `[pre_&]:text-inherit` sets colour, not font-size, so
    // this silently rendered at 11.4px on mobile.
    const preSize = await code.evaluate((el) => getComputedStyle(el).fontSize);
    const codeSize = await code
      .locator("code")
      .first()
      .evaluate((el) => getComputedStyle(el).fontSize);
    expect(codeSize).toBe(preSize);
  });

  test("unknown post slug 404s rather than erroring", async ({ page }) => {
    // dynamicParams = false, so anything outside generateStaticParams must be
    // a clean 404 and never a failed module resolution.
    const res = await page.goto("/blog/no-such-post");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("404: route not found")).toBeVisible();
  });
});
