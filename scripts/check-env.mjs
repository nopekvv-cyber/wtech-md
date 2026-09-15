#!/usr/bin/env node
// Cloud environment guard. Preview mode is allowed locally; production needs Supabase and admin secrets.
import { readFileSync, existsSync } from "node:fs";

export function loadEnvFile(file) {
  if (!existsSync(file)) return false;
  let text;
  try { text = readFileSync(file, "utf8"); } catch (e) {
    console.warn(JSON.stringify({ level: "warn", msg: `settings file ${file} exists but cannot be read (${e.code || e.message}); using defaults` }));
    return false;
  }
  for (const line of text.split("\n")) {
    const m = /^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (!m || m[1] in process.env) continue;
    const v = m[2];
    process.env[m[1]] = /^['"]/.test(v) ? v.replace(/^(['"])(.*)\1.*$/, "$2") : v.replace(/\s+#.*$/, "").trim(); // `KEY=value   # note`
  }
  return true;
}
const envFiles = [".env.local", ".env"];
const loaded = envFiles.filter(loadEnvFile);
if (loaded.length) console.log(JSON.stringify({ level: "info", msg: "settings file loaded", files: loaded }));
else console.warn(JSON.stringify({ level: "warn", msg: "no local settings file found: using the current environment" }));

const problems = [];
const warnings = [];
const env = process.env;

const url = env.NEXT_PUBLIC_SITE_URL || "";
try { new URL(url); } catch { warnings.push(`NEXT_PUBLIC_SITE_URL is ${url ? "not a full URL" : "not set"}: using https://wtech.md`); }
try { if (env.SUPABASE_URL) new URL(env.SUPABASE_URL); } catch { problems.push("SUPABASE_URL must be a full URL"); }
if ((env.SUPABASE_URL && !env.SUPABASE_SERVICE_ROLE_KEY) || (!env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY)) problems.push("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set together");
if (env.SUPABASE_SERVICE_ROLE_KEY && env.SUPABASE_SERVICE_ROLE_KEY.length < 20) problems.push("SUPABASE_SERVICE_ROLE_KEY does not look valid");
if (env.TELEGRAM_BOT_TOKEN && !/^\d{6,12}:[A-Za-z0-9_-]{30,}$/.test(env.TELEGRAM_BOT_TOKEN)) problems.push("TELEGRAM_BOT_TOKEN does not look like a bot token");
if (env.TELEGRAM_CHAT_ID && !/^-?\d{4,20}$/.test(env.TELEGRAM_CHAT_ID)) problems.push("TELEGRAM_CHAT_ID must be numeric");
if ((env.TELEGRAM_BOT_TOKEN && !env.TELEGRAM_CHAT_ID) || (!env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID)) problems.push("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set together");
if (env.SMTP_HOST && !env.LEADS_TO) problems.push("SMTP_HOST is set but LEADS_TO is empty");
if (env.SMTP_PORT && !/^\d{1,5}$/.test(env.SMTP_PORT)) problems.push("SMTP_PORT must be a number");
if (env.TRUST_PROXY && !["0", "1"].includes(env.TRUST_PROXY)) problems.push("TRUST_PROXY must be 0 or 1");
if (env.CHAT_DISABLED && !["0", "1"].includes(env.CHAT_DISABLED)) problems.push("CHAT_DISABLED must be 0 or 1");
if (env.ADMIN_PASSWORD && env.ADMIN_PASSWORD.length < 8) problems.push("ADMIN_PASSWORD must be at least 8 characters");
if (env.ADMIN_SESSION_SECRET && env.ADMIN_SESSION_SECRET.length < 32) problems.push("ADMIN_SESSION_SECRET must be at least 32 characters");
for (const k of Object.keys(env)) if (/^NEXT_PUBLIC_/.test(k) && /(TOKEN|SECRET|PASS|API_KEY)/.test(k)) problems.push(`${k}: secrets must not be NEXT_PUBLIC_`);

if (!env.TELEGRAM_BOT_TOKEN && !env.SMTP_HOST) warnings.push("no TELEGRAM_* or SMTP_* set: leads are collected in /admin/leads only (no push notifications)");
if (!env.ANTHROPIC_API_KEY && env.CHAT_DISABLED !== "1") warnings.push("ANTHROPIC_API_KEY not set: the chat falls back to WhatsApp/booking");
if (env.ALLOW_PLACEHOLDERS === "1") warnings.push("ALLOW_PLACEHOLDERS=1: [[placeholders]] may be visible on the site");
if (!env.SUPABASE_URL) warnings.push("Supabase is not configured: database-backed routes will report unavailable");
if (!env.ADMIN_PASSWORD) warnings.push("ADMIN_PASSWORD not set: /admin login is unavailable");
if (!env.ADMIN_SESSION_SECRET) warnings.push("ADMIN_SESSION_SECRET not set: a password-derived local fallback will be used");
for (const k of ["NEXT_PUBLIC_PHONE", "NEXT_PUBLIC_WHATSAPP", "NEXT_PUBLIC_ADDRESS"]) if (env[k] && /\[\[/.test(env[k])) problems.push(`${k} still contains a [[placeholder]]: leave it empty and fill it in /admin`);

for (const w of warnings) console.warn(JSON.stringify({ level: "warn", msg: w }));
if (problems.length) {
  for (const p of problems) console.error(JSON.stringify({ level: "error", msg: p }));
  console.error(JSON.stringify({ level: "error", msg: "environment validation failed: fix the variables above" }));
  process.exit(1);
}
console.log(JSON.stringify({ level: "info", msg: "env ok", preview: warnings.length > 0 }));
