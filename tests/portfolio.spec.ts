import { expect, test } from "@playwright/test";
import { CASE_STUDIES } from "../lib/projects";

const pages = ["", "/services", "/projets", "/cv",
  ...CASE_STUDIES.map((project) => `/projets/${project.caseStudySlug}`)];
const checkedLinks = new Set<string>();

for (const locale of ["fr", "en"]) {
  const prefix = locale === "fr" ? "" : "/en";
  for (const route of pages) {
    const pathname = `${prefix}${route}` || "/";
    test(`${pathname}: content, metadata and internal links`, async ({ page, request }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      const response = await page.goto(pathname);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.lalason.pro${pathname === "/" ? "" : pathname}`);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S+/);
      await expect(page.locator('a[href*="/offre"]')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      const links = await page.locator('a[href^="/"]').evaluateAll((elements) =>
        [...new Set(elements.map((element) => element.getAttribute("href")!))]);
      for (const href of links) {
        if (checkedLinks.has(href)) continue;
        const linked = await request.get(href);
        expect(linked.ok(), `${pathname} -> ${href}`).toBe(true);
        checkedLinks.add(href);
      }
      expect(errors).toEqual([]);
    });
  }

  test(`${locale}: offer removed and CV PDF preserved`, async ({ request }) => {
    const removed = await request.get(`${prefix}/offre`);
    expect(removed.status()).toBe(404);
    const pdf = await request.get(`${prefix}/cv/pdf`);
    expect(pdf.status()).toBe(200);
    expect(pdf.headers()["content-type"]).toContain("application/pdf");
    expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  });

  test(`${locale}: theme, filters and project modal`, async ({ page }) => {
    await page.goto(prefix || "/");
    await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
    await expect(page.locator("html")).toHaveClass(/light/);
    await page.getByRole("button", { name: "Toggle theme", exact: true }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    const filters = page.getByRole("group").getByRole("button");
    await filters.nth(2).click();
    await expect(filters.nth(2)).toHaveAttribute("aria-pressed", "true");
    await filters.first().click();
    await page.getByRole("button", { name: locale === "fr" ? /Voir les .* autres réalisations/ : /Show .* more projects/ }).click();
    await page.locator('button[aria-haspopup="dialog"]').first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
}

test("sitemap contains exactly the remaining bilingual pages", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  expect(xml).not.toContain("/offre");
  const actual = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname).sort();
  const expected = pages.flatMap((pathname) => [pathname || "/", `/en${pathname}`]).sort();
  expect(actual).toEqual(expected);
  expect((await request.get("/fr/offre")).status()).toBe(404);
});

test("language switch preserves the current route", async ({ page }) => {
  await page.goto("/services");
  await page.getByRole("button", { name: "Switch to EN" }).click();
  await expect(page).toHaveURL(/\/en\/services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.getByRole("button", { name: "Switch to FR" }).click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
});

test("scroll decorations and rocket remain interactive", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const celestialBody = page.locator(".galaxy-journey > .cursor-pointer");
  await expect(celestialBody).toBeVisible();
  await celestialBody.click();
  await expect(page.locator(".animate-countdown-pop")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 12_000 }).toBeLessThan(10);
  await expect(page.locator(".animate-countdown-pop")).toHaveCount(0);
});
