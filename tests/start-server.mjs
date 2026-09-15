// Starts the Telegram mock and the production standalone server with an isolated test data store.
import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";

const root = process.cwd();
const standalone = join(root, ".next/standalone");
if (!existsSync(join(standalone, "server.js"))) { console.error("no production build: run `npm run build` first"); process.exit(1); }
cpSync(join(root, "public"), join(standalone, "public"), { recursive: true });
cpSync(join(root, ".next/static"), join(standalone, ".next/static"), { recursive: true });
mkdirSync(join(standalone, "scripts"), { recursive: true });
cpSync(join(root, "scripts/check-env.mjs"), join(standalone, "scripts/check-env.mjs"));

const telegramLog = join(root, "qa/test-results/telegram.jsonl");
mkdirSync(join(root, "qa/test-results"), { recursive: true });
writeFileSync(telegramLog, "");

// Telegram mock: records every sendMessage body, answers like the real API
const mock = createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    writeFileSync(telegramLog, JSON.stringify({ url: req.url, body: safeJson(body) }) + "\n", { flag: "a" });
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ ok: true, result: { message_id: 1 } }));
  });
});
mock.listen(3999, "127.0.0.1");
function safeJson(s) { try { return JSON.parse(s); } catch { return s; } }

const child = spawn("node", ["server.js"], {
  cwd: standalone,
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: "3000",
    HOSTNAME: "127.0.0.1",
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    TELEGRAM_BOT_TOKEN: "123456789:TESTTOKENTESTTOKENTESTTOKENTESTTOKEN",
    TELEGRAM_CHAT_ID: "12345",
    TELEGRAM_API_BASE: "http://127.0.0.1:3999",
    RATE_LIMIT_MAX: "6",
    TRUST_PROXY: "1", // the suite sets X-Forwarded-For per project so rate-limit buckets do not bleed between engines
    CHAT_DISABLED: "1",
    ADMIN_PASSWORD: "test-admin-pass-123",
    ADMIN_SESSION_SECRET: "test-admin-session-secret-1234567890",
    ALLOW_IN_MEMORY_DB: "1",
  },
});
const stop = () => { child.kill("SIGTERM"); mock.close(); process.exit(0); };
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
child.on("exit", (code) => { mock.close(); process.exit(code ?? 0); });
