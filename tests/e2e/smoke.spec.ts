import { test, expect } from "@playwright/test";

test.describe("smoke", () => {
  test("home renders the hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Anmol Malhan/i);
    await expect(page.getByText("THINK", { exact: true })).toBeVisible();
    await expect(page.getByText("CODE", { exact: true })).toBeVisible();
  });

  test("projects listing links to a case study", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: "Projects", level: 1 })).toBeVisible();

    const tripmatesHeading = page.getByRole("heading", { name: "Tripmates", level: 2 });
    await expect(tripmatesHeading).toBeVisible();
  });

  test("project case study renders structured sections", async ({ page }) => {
    await page.goto("/projects/tripmates");
    await expect(page.getByRole("heading", { name: "Tripmates", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The Problem" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Stack", exact: true })).toBeVisible();
  });

  test("contact page exposes form and fallback channels", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "Contact Request" })).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /github/i }).first()).toBeVisible();
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
});
