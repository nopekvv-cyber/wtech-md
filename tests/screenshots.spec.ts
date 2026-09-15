import { test, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { LOCALES, markSeen, noHorizontalScroll } from "./helpers";

const WIDTHS = [360, 390, 768, 1024, 1440, 1920];
const HOME: Record<string, string> = { ro: "/", ru: "/ru", en: "/en" };

test.describe("screenshots", () => {
  for (const locale of LOCALES) {
    for (const w of WIDTHS) {
      test(`${locale} @ ${w}`, async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "chromium", "one engine is enough for visual capture");
        mkdirSync("qa/screenshots", { recursive: true });
        await markSeen(page);
        await page.setViewportSize({ width: w, height: Math.round(w < 768 ? w * 1.9 : 900) });
        await page.goto(HOME[locale]!, { waitUntil: "networkidle" });
        // walk the page so lazy sections mount, then back to top
        for (let y = 0; y < 16000; y += 1200) { await page.mouse.wheel(0, 1200); await page.waitForTimeout(80); }
        await page.waitForTimeout(600);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(400);
        await noHorizontalScroll(page);
        await page.screenshot({ path: `qa/screenshots/home-${locale}-${w}.png`, fullPage: true });
        expect(true).toBe(true);
      });
    }
  }
});
