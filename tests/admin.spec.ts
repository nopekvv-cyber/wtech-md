import { test, expect } from "@playwright/test";
import { markSeen, watch, expectClean } from "./helpers";

const PASSWORD = "test-admin-pass-123"; // tests/start-server.mjs

test.describe("admin CMS", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "one engine is enough for the admin");

  test("is hidden from robots and needs the password", async ({ page, request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow: \/admin/);
    const res = await page.goto("/admin");
    expect(res?.headers()["x-robots-tag"]).toContain("noindex");
    await expect(page.locator("h1")).toHaveText("WTECH CRM");
    await page.fill('input[name="password"]', "wrong-password");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("#login-err")).toHaveText(/Parolă greșită/);
  });

  test("saves settings and the site shows them at once", async ({ page, context }) => {
    const w = await watch(page);
    await page.goto("/admin");
    await page.fill('input[name="password"]', PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('input[name="contact.phone"]')).toBeVisible();

    await page.fill('input[name="contact.phone"]', "+373 69 123 456");
    await page.fill('input[name="contact.legal_name"]', "WTECH Test SRL");
    await page.fill('input[name="contact.whatsapp"]', "069 123 456");
    await page.fill('input[name="contact.telegram"]', "wtechmd");
    await page.fill('input[name="contact.address"]', "str. Test 1, Chișinău");
    await page.fill('input[name="contact.idno"]', "1234567890123");
    await page.fill('input[name="proof.n1"]', "40+");
    await page.getByRole("button", { name: "Salvează modificările" }).click();
    await expect(page.locator('[role="status"]')).toHaveText(/Salvat/);

    await expectClean(page, w);

    // the public site, same session (new page, no admin cookie needed)
    const site = await context.newPage();
    await markSeen(site);
    await site.goto("/preturi");
    await expect(site.locator("#preturi")).toContainText("600");
    await expect(site.locator("#preturi")).toContainText("12\u202f000");
    await site.goto("/contact");
    await expect(site.locator("#contact a[href^='tel:']")).toHaveAttribute("href", "tel:+37369123456");
    await expect(site.locator("#contact a[href^='https://wa.me/']")).toHaveAttribute("href", /wa\.me\/37369123456/);
    await expect(site.locator("#contact a[href^='https://t.me/']")).toHaveAttribute("href", "https://t.me/wtechmd");
    await site.goto("/");
    await expect(site.locator("dl dd").first()).toHaveText("40+");
    const faq = await site.locator("body").innerText();
    expect(faq).not.toMatch(/\[\[/);
  });

  test("leads inbox: a submitted form shows up, can be handled, exports as CSV", async ({ page, request, baseURL }) => {
    const json = { "content-type": "application/json", origin: baseURL!, "x-forwarded-for": "10.77.0.9" };
    const r = await request.post("/api/lead", { data: { kind: "contact", locale: "ro", name: "=Inbox Test SRL", phone: "+373 69 555 555", email: "inbox@firma.md", company: "Inbox SRL", message: "Vreau un CRM", interest: "CRM", startedAt: 1000, privacyAccepted: true, marketingConsent: false }, headers: json });
    expect(r.status()).toBe(200);
    // no session: CSV refused
    expect((await request.get("/admin/leads.csv")).status()).toBe(401);
    await page.goto("/admin");
    await page.fill('input[name="password"]', PASSWORD);
    await page.locator('button[type="submit"]').click();
    await page.getByRole("link", { name: /^Leaduri/ }).first().click();
    await expect(page.locator("h1")).toHaveText("Leaduri");
    const card = page.locator("li", { hasText: "inbox@firma.md" }).first();
    await expect(card).toContainText("Contact form");
    await expect(card).toContainText("Vreau un CRM");
    await card.getByRole("button", { name: "Marchează procesat" }).click();
    await expect(page.locator("li", { hasText: "inbox@firma.md" })).toHaveCount(0); // new-only view
    await page.getByRole("link", { name: "Arată toate" }).click();
    await expect(page.locator("li", { hasText: "inbox@firma.md" }).first()).toContainText("Marchează ca nou");
    const csv = await page.request.get("/admin/leads.csv");
    expect(csv.status()).toBe(200);
    expect(csv.headers()["content-type"]).toContain("text/csv");
    const text = await csv.text();
    expect(text).toContain("inbox@firma.md");
    expect(text).toContain("'=Inbox Test SRL"); // formula-looking cells are neutralised
  });

  test("sign out drops the session", async ({ page }) => {
    await page.goto("/admin");
    await page.fill('input[name="password"]', PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('input[name="contact.phone"]')).toBeVisible();
    await page.getByRole("button", { name: "Ieșire" }).click();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });
});
