import { expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

export const LOCALES = ["ro", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Every route per locale, with the localised slugs from i18n/routing.ts */
export const PAGES: Record<Locale, string[]> = {
  ro: ["/", "/servicii", "/servicii/site-uri", "/servicii/ai-seo", "/lucrari", "/preturi", "/contact", "/audit", "/despre", "/blog", "/blog/crm-pentru-afaceri-moldova"],
  ru: ["/ru", "/ru/uslugi", "/ru/uslugi/sayty", "/ru/uslugi/ai-seo", "/ru/raboty", "/ru/ceny", "/ru/contact", "/ru/audit", "/ru/o-nas", "/ru/blog", "/ru/blog/crm-pentru-afaceri-moldova"],
  en: ["/en", "/en/services", "/en/services/websites", "/en/services/ai-seo", "/en/work", "/en/pricing", "/en/contact", "/en/audit", "/en/about", "/en/blog", "/en/blog/crm-pentru-afaceri-moldova"],
};

export type Watch = { consoleErrors: string[]; pageErrors: string[]; failedRequests: string[]; csp: string[] };

/** Collects console errors, uncaught exceptions, failed/4xx+ requests and CSP violations for a page. */
export async function watch(page: Page): Promise<Watch> {
  const w: Watch = { consoleErrors: [], pageErrors: [], failedRequests: [], csp: [] };
  await page.addInitScript(() => {
    (window as unknown as { __csp: string[] }).__csp = [];
    document.addEventListener("securitypolicyviolation", (e) => {
      (window as unknown as { __csp: string[] }).__csp.push(`${e.violatedDirective} ${e.blockedURI}`);
    });
  });
  page.on("console", (m) => { if (m.type() === "error") w.consoleErrors.push(m.text().slice(0, 300)); });
  page.on("pageerror", (e) => w.pageErrors.push(String(e.message).slice(0, 300)));
  page.on("requestfailed", (r) => {
    const err = r.failure()?.errorText ?? "";
    // Next cancels in-flight link prefetches (`?_rsc=`) when the router moves on; that is not a failed resource
    const aborted = /ERR_ABORTED|cancelled|canceled/i.test(err);
    const abortedPrefetch = /[?&]_rsc=/.test(r.url()) && aborted;
    // a server action that ends in redirect() supersedes its own POST; Chromium reports the fetch as aborted
    const abortedAction = r.method() === "POST" && !/\/api\//.test(r.url()) && aborted;
    if (!/\/api\/chat/.test(r.url()) && !abortedPrefetch && !abortedAction) w.failedRequests.push(`${r.method()} ${r.url()} ${err}`);
  });
  page.on("response", (r) => { if (r.status() >= 400 && !/\/api\/chat/.test(r.url())) w.failedRequests.push(`${r.status()} ${r.url()}`); });
  return w;
}

async function collectCsp(page: Page, w: Watch) {
  const v = await page.evaluate(() => (window as unknown as { __csp?: string[] }).__csp ?? []);
  w.csp.push(...v);
}

export async function expectClean(page: Page, w: Watch) {
  await collectCsp(page, w);
  expect(w.pageErrors, "uncaught exceptions").toEqual([]);
  expect(w.consoleErrors, "console errors").toEqual([]);
  expect(w.failedRequests, "failed requests").toEqual([]);
  expect(w.csp, "CSP violations").toEqual([]);
}

export async function noHorizontalScroll(page: Page) {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(over, "horizontal overflow px").toBeLessThanOrEqual(0);
}

export function telegramMessages(): Array<{ url: string; body: { text?: string } }> {
  try {
    return readFileSync("qa/test-results/telegram.jsonl", "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  } catch {
    return [];
  }
}

/** Skip the preloader for tests that are not about it. */
export async function markSeen(page: Page) {
  await page.addInitScript(() => { try { sessionStorage.setItem("wtech_seen", "1"); } catch {} });
}
