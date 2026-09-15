import { test, expect } from "@playwright/test";
import { LOCALES, PAGES, watch, expectClean, noHorizontalScroll, markSeen, telegramMessages } from "./helpers";

for (const locale of LOCALES) {
  test.describe(`pages · ${locale}`, () => {
    for (const path of PAGES[locale]) {
      test(`${path} renders clean`, async ({ page }) => {
        await markSeen(page);
        const w = await watch(page);
        const res = await page.goto(path, { waitUntil: "networkidle" });
        expect(res?.status()).toBe(200);
        await expect(page.locator("h1").first()).toBeVisible();
        expect(await page.getAttribute("html", "lang")).toBe(locale);
        expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBeGreaterThanOrEqual(4);
        await noHorizontalScroll(page);
        await expectClean(page, w);
      });
    }
  });
}

test.describe("hero", () => {
  test("loads immediately without entry or language overlays", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".preloader-stage")).toHaveCount(0);
    await expect(page.locator('[data-locale-banner="true"]')).toHaveCount(0);
    const media = page.locator("[data-hero]");
    await expect(media).toBeVisible();
    if (await media.evaluate((el) => el instanceof HTMLVideoElement)) {
      await expect(media).toHaveAttribute("poster", "/brand/wtech-hero-mark-v2.webp");
    } else {
      expect(await media.evaluate((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
    }
  });

  test("Higgsfield hero loop plays", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const video = page.locator("video[data-hero]");
    await expect(video).toBeVisible();
    await expect.poll(() => video.evaluate((el) => (el as HTMLVideoElement).readyState)).toBeGreaterThanOrEqual(2);
    const before = await video.evaluate((el) => (el as HTMLVideoElement).currentTime);
    await page.waitForTimeout(700);
    const after = await video.evaluate((el) => (el as HTMLVideoElement).currentTime);
    expect(after).toBeGreaterThan(before);
  });

  test("?v=b swaps the headline and fires hero_variant", async ({ page }) => {
    await markSeen(page);
    await page.goto("/?v=b");
    await expect(page.locator("h1")).toContainText(/Clienți care vin singuri/);
    const events = await page.evaluate(() => (window as unknown as { __wtechEvents?: Array<{ name: string }> }).__wtechEvents?.map((e) => e.name) ?? []);
    expect(events).toContain("hero_variant");
    await page.goto("/?v=zzz");
    await expect(page.locator("h1")).toContainText(/Clienții îți scriu/);
  });

  test("reduced motion: no pinning and content visible", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.locator(".preloader-stage")).toHaveCount(0, { timeout: 2000 });
    await expect(page.locator("video[data-hero]")).toHaveCount(0);
    await expect(page.locator("img[data-hero]")).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 4000)); // mouse.wheel is unsupported in mobile WebKit
    await page.waitForTimeout(500);
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    await expect(page.locator("#servicii h2")).toBeVisible();
    await ctx.close();
  });
});

test.describe("navigation and a11y", () => {
  test("language switch keeps the page", async ({ page }, testInfo) => {
    await markSeen(page);
    await page.goto("/servicii/site-uri");
    const mobile = testInfo.project.name === "mobile-safari";
    const lang = async (code: string) => {
      if (mobile) await page.locator('button[aria-controls="mobile-menu"]').click(); // the switch lives in the sheet on phones
      await page.locator(`a[hreflang="${code}"]:visible`).first().click();
    };
    await lang("ru");
    await page.waitForURL("**/ru/uslugi/sayty");
    expect(await page.getAttribute("html", "lang")).toBe("ru");
    await lang("en");
    await page.waitForURL("**/en/services/websites");
    expect(await page.getAttribute("html", "lang")).toBe("en");
  });

  test("404 pages exist in every locale with the brand", async ({ page }) => {
    for (const p of ["/nu-exista", "/ru/net-takoi", "/en/nothing-here"]) {
      const res = await page.goto(p);
      expect(res?.status()).toBe(404);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("header nav")).toBeVisible();
    }
  });

  test("skip link, focus visibility and Escape on the mobile menu", async ({ page }, testInfo) => {
    await markSeen(page);
    await page.goto("/");
    if (testInfo.project.name === "chromium") {
      // iOS has no Tab focus navigation and WebKit skips links on Tab (macOS default); exercised on Chromium
      await page.keyboard.press("Tab");
      // headless WebKit reports the document as inactive, which makes toBeFocused() fail; ask the DOM instead
      await expect.poll(() => page.evaluate(() => document.activeElement?.classList.contains("skip-link") ?? false)).toBe(true);
      await page.keyboard.press("Enter");
      expect(await page.evaluate(() => location.hash)).toBe("#main");
    } else if (testInfo.project.name === "mobile-safari") {
      const btn = page.locator('button[aria-controls="mobile-menu"]');
      await btn.click();
      await expect(page.locator("#mobile-menu")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.locator("#mobile-menu")).toHaveCount(0);
      await expect(btn).toBeFocused();
    }
    // messenger pill reachable and opens the chat
    const pill = page.locator(".messenger-pill button");
    await pill.focus();
    await expect(pill).toBeFocused();
    await pill.press("Enter");
    await expect(page.locator('[role="dialog"][aria-labelledby="ana-title"]')).toBeVisible();
    const events = await page.evaluate(() => (window as unknown as { __wtechEvents?: Array<{ name: string }> }).__wtechEvents?.map((e) => e.name) ?? []);
    expect(events).toContain("chat_open");
    await page.keyboard.press("Escape");
    await expect(page.locator('[role="dialog"][aria-labelledby="ana-title"]')).toHaveCount(0);
  });

  test("20 client navigations do not leak ScrollTriggers or heap", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium", "heap metrics are Chromium-only");
    await markSeen(page);
    await page.goto("/");
    const count = () => page.evaluate(() => (window as unknown as { __ST?: { getAll: () => unknown[] } }).__ST?.getAll().length ?? -1);
    const heap = () => page.evaluate(() => (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize ?? 0);
    const links = ["/servicii", "/", "/preturi", "/", "/contact", "/"];
    for (let i = 0; i < 20; i++) {
      const href = links[i % links.length]!;
      await page.locator(`a[href="${href}"]`).first().click();
      await page.waitForURL((u) => u.pathname === href);
      await page.waitForLoadState("networkidle");
      if (i === 2) await page.evaluate(() => (window as unknown as { gc?: () => void }).gc?.());
    }
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const st = await count();
    expect(st, "ScrollTrigger instances after 20 navigations").toBeLessThanOrEqual(6);
    const h = await heap();
    expect(h, "heap after navigations").toBeLessThan(120 * 1024 * 1024);
  });
});

test.describe("forms and API", () => {
  test("contact form: validation, happy path, escaped Telegram payload, events", async ({ page }) => {
    await markSeen(page);
    await page.goto("/contact", { waitUntil: "networkidle" });
    // step 1 is a bare fieldset (choice buttons); the <form> only appears with step 2
    await page.locator("#main fieldset button").first().click();
    const form = page.locator("#main form").first();
    await form.locator('button[type="submit"]').click();
    await expect(page.locator('[role="alert"]').first()).toBeVisible(); // name missing
    await page.fill("#ct-name", "Test <b>SRL</b>");
    await page.fill("#ct-phone", "+373 69 123 456");
    await page.waitForTimeout(2200); // time-to-submit guard
    await form.locator('button[type="submit"]').click();
    await expect(form.locator('[role="status"]').or(page.locator('#main [role="status"]')).first()).toBeVisible(); // the locale banner is a status too
    const events = await page.evaluate(() => (window as unknown as { __wtechEvents?: Array<{ name: string }> }).__wtechEvents?.map((e) => e.name) ?? []);
    expect(events).toContain("form_step1");
    expect(events).toContain("form_submit");
    const msgs = telegramMessages();
    const last = msgs[msgs.length - 1];
    expect(last?.body.text ?? "").toContain("&lt;b&gt;SRL&lt;/b&gt;");
    expect(last?.body.text ?? "").toContain("+37369123456");
  });

  test("audit form happy path and audit_submit event", async ({ page }) => {
    await markSeen(page);
    await page.goto("/audit", { waitUntil: "networkidle" }); // typing before hydration loses the controlled value on WebKit
    const form = page.locator("#main form").first(); // the footer carries a second, compact audit form
    await form.locator('input[name="url"]').fill("firma.md");
    await expect(form.locator('input[name="url"]')).toHaveValue("firma.md");
    await form.locator('input[name="email"]').fill("test@firma.md");
    await form.locator('input[name="whatsapp"]').fill("+373 60 000 000");
    await page.waitForTimeout(2200);
    await form.locator('button[type="submit"]').click();
    await expect(form.locator('[role="status"]').or(page.locator('#main [role="status"]')).first()).toBeVisible(); // the locale banner is a status too
    const events = await page.evaluate(() => (window as unknown as { __wtechEvents?: Array<{ name: string }> }).__wtechEvents?.map((e) => e.name) ?? []);
    expect(events).toContain("audit_submit");
  });

  test("API guards: origin, honeypot, unknown keys, method, rate limit", async ({ request, baseURL }, testInfo) => {
    const origin = baseURL!;
    // own rate-limit bucket: the test server trusts X-Forwarded-For, so each project and this test get a distinct IP
    const json = { "content-type": "application/json", "x-forwarded-for": `10.99.${testInfo.workerIndex}.${1 + testInfo.retry}` };
    const body = { locale: "ro", url: "firma.md", email: "a@b.md", whatsapp: "+37360000000", startedAt: 1000 };
    expect((await request.post("/api/audit", { data: body, headers: { ...json } })).status()).toBe(403);
    expect((await request.get("/api/audit")).status()).toBe(405);
    const before = telegramMessages().length;
    expect((await request.post("/api/audit", { data: { ...body, website: "spam" }, headers: { ...json, origin } })).status()).toBe(200);
    expect(telegramMessages().length, "honeypot must not deliver").toBe(before);
    expect((await request.post("/api/audit", { data: { ...body, extra: 1 }, headers: { ...json, origin } })).status()).toBe(400);
    let limited: number | null = null;
    for (let i = 0; i < 8; i++) {
      const r = await request.post("/api/audit", { data: body, headers: { ...json, origin } });
      if (r.status() === 429) { limited = Number(r.headers()["retry-after"]); break; }
    }
    expect(limited, "429 with Retry-After").toBeGreaterThan(0);
  });

  test("health confirms the database", async ({ request }) => {
    const r = await request.get("/api/health");
    expect(r.status()).toBe(200);
    expect(await r.json()).toEqual({ ok: true, database: "test-memory" });
  });
});
