import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against the production standalone build (npm run build first). tests/start-server.mjs starts the app with a
 * isolated in-memory database and a local Telegram mock so form deliveries can be asserted without touching the network.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: "qa/playwright-report", open: "never" }]],
  outputDir: "qa/test-results",
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node tests/start-server.mjs",
    url: "http://localhost:3000/api/health",
    reuseExistingServer: false,
    timeout: 60_000,
  },
  projects: [
    // one rate-limit bucket per engine: the test server runs with TRUST_PROXY=1 and keys the limiter by X-Forwarded-For
    { name: "chromium", use: { ...devices["Desktop Chrome"], extraHTTPHeaders: { "x-forwarded-for": "10.0.0.1" } } },
    { name: "webkit", use: { ...devices["Desktop Safari"], extraHTTPHeaders: { "x-forwarded-for": "10.0.0.2" } } },
    { name: "mobile-safari", use: { ...devices["iPhone 13"], extraHTTPHeaders: { "x-forwarded-for": "10.0.0.3" } } },
  ],
});
