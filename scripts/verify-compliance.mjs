import { chromium } from "@playwright/test";

const base = process.env.VERIFY_BASE_URL ?? "http://127.0.0.1:3210";
const browser = await chromium.launch({ headless: true });
const results = [];
let failed = false;

async function check(name, fn) {
  try { await fn(); results.push(`PASS ${name}`); }
  catch (error) { failed = true; results.push(`FAIL ${name}: ${error instanceof Error ? error.message : String(error)}`); }
}

const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const page = await context.newPage();
const consoleErrors = [];
page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text()); });
page.on("pageerror", (error) => consoleErrors.push(error.message));

await check("privacy page and cookie choice render on mobile", async () => {
  await page.goto(`${base}/confidentialitate`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Politica de confidențialitate", exact: true }).waitFor();
  await page.getByRole("heading", { name: "Preferințe de confidențialitate" }).waitFor();
  await page.getByRole("button", { name: "Doar necesare" }).click();
  if (await page.getByRole("heading", { name: "Preferințe de confidențialitate" }).isVisible()) throw new Error("banner stayed open");
  const stored = await page.evaluate(() => localStorage.getItem("wtech_consent_v1"));
  if (!stored?.includes('"analytics":false') || !stored?.includes('"external":false')) throw new Error("necessary-only choice was not stored");
});

await check("all images expose an alt attribute", async () => {
  const missing = await page.locator("img:not([alt])").count();
  if (missing) throw new Error(`${missing} images lack alt`);
});

await check("buttons have accessible names", async () => {
  const unnamed = await page.locator("button").evaluateAll((buttons) => buttons.filter((button) => !(button.getAttribute("aria-label") || button.textContent?.trim())).length);
  if (unnamed) throw new Error(`${unnamed} buttons have no accessible name`);
});

await check("contact form moves focus to invalid fields and required consent", async () => {
  await page.goto(`${base}/contact`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /site/i }).first().click();
  await page.getByRole("button", { name: /trimite/i }).click();
  if ((await page.evaluate(() => document.activeElement?.id)) !== "ct-name") throw new Error("name did not receive focus");
  await page.locator("#ct-name").fill("Test User");
  await page.locator("#ct-phone").fill("+37369000000");
  await page.getByRole("button", { name: /trimite/i }).click();
  if ((await page.evaluate(() => document.activeElement?.id)) !== "contact-consent-privacy") throw new Error("privacy consent did not receive focus");
  if (await page.locator("#contact-consent-marketing").isChecked()) throw new Error("marketing was preselected");
});

await check("legal links are present in the footer", async () => {
  const labels = ["Confidențialitate", "Termeni", "Cookie-uri", "Anulare și rambursări", "Consimțământ SMS", "Setări cookie"];
  for (const label of labels) if (!(await page.getByText(label, { exact: true }).count())) throw new Error(`missing ${label}`);
});

await check("cookie settings persist granular categories", async () => {
  await page.getByRole("button", { name: "Setări cookie" }).click();
  const analytics = page.locator("#consent-analytics");
  const external = page.locator("#consent-external");
  await analytics.check();
  if (await external.isChecked()) throw new Error("external scheduler was bundled with analytics");
  await page.getByRole("button", { name: "Salvează alegerea" }).click();
  const stored = await page.evaluate(() => localStorage.getItem("wtech_consent_v1"));
  if (!stored?.includes('"analytics":true') || !stored?.includes('"external":false')) throw new Error("granular choice was not stored");
});

await check("booking dialog traps focus and closes with Escape", async () => {
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /programează un apel/i }).first().click();
  const dialog = page.getByRole("dialog", { name: /programează un apel/i });
  await dialog.waitFor();
  const close = dialog.getByRole("button", { name: "Închide" });
  await close.focus();
  await page.keyboard.press("Shift+Tab");
  if (!(await dialog.locator(":focus").count())) throw new Error("focus escaped the dialog");
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
});

await check("desktop legal layout has no horizontal overflow", async () => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/termeni`, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) throw new Error(`${overflow}px horizontal overflow`);
});

await check("no browser errors", async () => {
  const relevant = consoleErrors.filter((message) => !message.includes("Supabase") && !message.includes("favicon"));
  if (relevant.length) throw new Error(relevant.join(" | ").slice(0, 1000));
});

await browser.close();
console.log(results.join("\n"));
if (failed) process.exit(1);
