#!/usr/bin/env node
// Lighthouse mobile on the home page in each locale plus one service page. Saves JSON to qa/lighthouse/ and fails
// when a page misses the gates (Performance >= 90, Accessibility >= 95, Best Practices = 100, SEO = 100).
// Runs each page LH_RUNS times (default 3) and keeps the median-performance run: mobile-throttled LCP on the home
// route is bimodal (H1 vs hero image), so a single run is not a fair gate.
// Uses the server on BASE_URL when one answers; otherwise starts tests/start-server.mjs (production standalone build).
import { execFileSync, spawn } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, renameSync, rmSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const RUNS = Math.max(1, Number(process.env.LH_RUNS || 3));
const pages = [["/", "home-ro"], ["/ru", "home-ru"], ["/en", "home-en"], ["/servicii/ai-seo", "service-ai-seo"]];
const gates = { performance: 90, accessibility: 95, "best-practices": 100, seo: 100 };
mkdirSync("qa/lighthouse", { recursive: true });

async function up() { try { return (await fetch(BASE + "/api/health")).ok; } catch { return false; } }
let server = null;
if (!(await up())) {
  server = spawn("node", ["tests/start-server.mjs"], { stdio: "ignore" });
  const t0 = Date.now();
  while (!(await up())) {
    if (Date.now() - t0 > 60_000) { console.error("server did not start"); server.kill("SIGTERM"); process.exit(1); }
    await new Promise((r) => setTimeout(r, 500));
  }
}

let failed = false;
const summary = [];
try {
  for (const [path, name] of pages) {
    const runs = [];
    for (let i = 0; i < RUNS; i++) {
      const out = `qa/lighthouse/${name}.run${i}.json`;
      execFileSync("npx", ["--yes", "lighthouse", BASE + path, "--form-factor=mobile", "--screenEmulation.mobile", "--throttling-method=simulate",
        "--only-categories=performance,accessibility,best-practices,seo", "--output=json", `--output-path=${out}`, "--chrome-flags=--headless=new --no-sandbox", "--quiet"], { stdio: "ignore" });
      const r = JSON.parse(readFileSync(out, "utf8"));
      runs.push({ out, r, perf: r.categories.performance.score });
    }
    runs.sort((a, b) => a.perf - b.perf);
    const med = runs[Math.floor((runs.length - 1) / 2)];
    for (const x of runs) if (x !== med) rmSync(x.out, { force: true });
    renameSync(med.out, `qa/lighthouse/${name}.json`);
    const c = med.r.categories, a = med.r.audits;
    const score = (k) => Math.round(c[k].score * 100);
    const row = { page: path, perf: score("performance"), perfRuns: runs.map((x) => Math.round(x.perf * 100)), a11y: score("accessibility"), bp: score("best-practices"), seo: score("seo"),
      lcp: +(a["largest-contentful-paint"].numericValue / 1000).toFixed(2), cls: +a["cumulative-layout-shift"].numericValue.toFixed(3), tbt: Math.round(a["total-blocking-time"].numericValue) };
    const bad = Object.entries(gates).filter(([k, min]) => score(k) < min).map(([k]) => k);
    if (bad.length) failed = true;
    summary.push({ ...row, ok: bad.length === 0, below: bad });
    console.log(JSON.stringify(summary[summary.length - 1]));
  }
} finally {
  if (server) server.kill("SIGTERM");
  writeFileSync("qa/lighthouse/summary.json", JSON.stringify({ date: new Date().toISOString(), runs: RUNS, gates, pages: summary }, null, 2) + "\n");
}
if (failed) { console.error("lighthouse gates not met"); process.exit(1); }
