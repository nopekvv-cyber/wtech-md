#!/usr/bin/env node
import { chromium } from "playwright";

const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3101";
const host = process.env.INTERNATIONAL_HOST ?? "wtech.to";
const routes = [
  "/", "/services", "/work", "/pricing", "/contact", "/audit", "/about",
  "/privacy", "/terms", "/cookies", "/refunds", "/sms-consent",
  "/services/websites", "/services/crm-dashboards", "/services/ai-employees",
  "/services/automations", "/services/custom-software", "/services/ai-seo",
];

const browser = await chromium.launch({ headless: true });
const failures = [];

async function checkPage(page, route) {
  const response = await page.goto(baseURL + route, { waitUntil: "networkidle" });
  if (response?.status() !== 200) failures.push(`${route}: HTTP ${response?.status()}`);
  if ((await page.locator("html").getAttribute("lang")) !== "en") failures.push(`${route}: html lang is not en`);
  if (!(await page.locator("h1").first().isVisible())) failures.push(`${route}: no visible h1`);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  if (canonical !== `https://${host}${route === "/" ? "" : route}`) failures.push(`${route}: bad canonical ${canonical}`);
  if ((await page.locator('link[rel="alternate"][hreflang="ro"], link[rel="alternate"][hreflang="ru"]').count()) !== 0) failures.push(`${route}: Moldova hreflang leaked`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) failures.push(`${route}: horizontal overflow`);
}

try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 }, extraHTTPHeaders: { "x-forwarded-host": host } });
  const page = await desktop.newPage();
  for (const route of routes) await checkPage(page, route);
  const text = await page.locator("body").innerText();
  if (!text.includes("wtech.to")) failures.push("desktop: wtech.to identity missing");
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, extraHTTPHeaders: { "x-forwarded-host": host } });
  const mobilePage = await mobile.newPage();
  for (const route of ["/", "/services", "/pricing", "/contact"]) await checkPage(mobilePage, route);
  if (!(await mobilePage.locator('button[aria-controls="mobile-menu"]').isVisible())) failures.push("mobile: menu button missing");
  await mobile.close();

  const canada = await browser.newContext({ extraHTTPHeaders: { "x-forwarded-host": host, "x-vercel-ip-country": "CA" } });
  const canadaPage = await canada.newPage();
  await canadaPage.goto(baseURL + "/pricing", { waitUntil: "networkidle" });
  const pricing = await canadaPage.locator("#preturi").innerText();
  if (!pricing.includes("CAD") || !pricing.includes("1,990")) failures.push("Canada: CAD price book missing");
  await canada.close();
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, desktopRoutes: routes.length, mobileRoutes: 4, localizedPriceBook: "Canada/CAD" }));
