import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test.describe("homepage accessibility", () => {
  test.beforeEach(async ({ page }) => {
    // Deterministic: contrast is evaluated on the final state, not mid-animation.
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("has no detectable WCAG 2.2 AA violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations).toEqual([]);
  });

  test("exposes one h1 naming the person and the display line", async ({ page }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("Prince Ntunka");
    await expect(h1).toContainText("Engineering");
    await expect(h1).toContainText("Security.");
  });

  test("skip link is the first tab stop and moves focus to main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("hero content is fully visible with reduced motion", async ({ page }) => {
    await page.goto("/");
    for (const locator of [
      page.getByRole("heading", { level: 1 }),
      page.getByRole("list", { name: "Focus areas" }),
    ]) {
      await expect(locator).toBeVisible();
      expect(await locator.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    }
  });

  test("every external link is safe", async ({ page }) => {
    await page.goto("/");
    const external = page.locator('a[href^="http"]');
    for (const link of await external.all()) {
      await expect(link).toHaveAttribute("rel", /noopener/);
      await expect(link).toHaveAttribute("rel", /noreferrer/);
      await expect(link).toHaveAttribute("target", "_blank");
    }
  });
});

test.describe("mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile-only behaviour");

  test("opens, is accessible, closes with Escape and returns focus", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Menu", exact: true });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#site-menu")).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations).toEqual([]);

    await page.keyboard.press("Escape");
    await expect(page.locator("#site-menu")).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });
});
