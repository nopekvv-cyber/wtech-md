import "server-only";
import nodemailer from "nodemailer";
import { env, telegramConfigured, smtpConfigured } from "./env";
import { SITE_URL } from "./site";

type Payload = { title: string; lines: Array<[string, string]>; locale: string };

/** Escapes text for Telegram's HTML parse mode so user input can never inject markup. */
function esc(s: string) {
  return s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c] as string);
}

async function withTimeout<T>(p: (signal: AbortSignal) => Promise<T>, ms: number): Promise<T> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try { return await p(ac.signal); } finally { clearTimeout(t); }
}

/** Telegram delivery: 5 s timeout, one retry. Throws on final failure so the caller can log; the lead is already stored. */
async function notifyTelegram(p: Payload) {
  if (!telegramConfigured) return { skipped: true as const };
  const text = [`<b>${esc(p.title)}</b> · ${esc(p.locale.toUpperCase())}`, ...p.lines.filter(([, v]) => v).map(([k, v]) => `<b>${esc(k)}:</b> ${esc(v)}`)].join("\n").slice(0, 3900);
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await withTimeout(
        (signal) =>
          fetch(`${env.TELEGRAM_API_BASE}/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: "HTML", disable_web_page_preview: true }),
            signal,
          }),
        5000,
      );
      if (!res.ok) throw new Error(`telegram ${res.status}`);
      return { ok: true as const };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

async function notifyEmail(p: Payload) {
  if (!smtpConfigured) return { skipped: true as const };
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    connectionTimeout: 5000,
    socketTimeout: 8000,
  });
  const rows = p.lines.filter(([, v]) => v).map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#8a877f">${esc(k)}</td><td style="padding:6px 0">${esc(v)}</td></tr>`).join("");
  const html = `<!doctype html><body style="margin:0;background:#000;color:#F5F1EA;font-family:Outfit,system-ui,sans-serif"><div style="max-width:600px;margin:0 auto;padding:24px"><img src="${SITE_URL}/media/email-header.png" width="600" height="200" alt="wtech.md" style="display:block;width:100%;height:auto;border-radius:12px"/><h1 style="font-size:22px;font-weight:500;margin:24px 0 8px">${esc(p.title)}</h1><table style="border-collapse:collapse;font-size:15px">${rows}</table><p style="color:#8a877f;font-size:13px;margin-top:24px">wtech.md · ${esc(p.locale.toUpperCase())}</p></div></body>`;
  await transport.sendMail({ from: env.SMTP_FROM || "wtech.md <no-reply@wtech.md>", to: env.LEADS_TO, subject: p.title, html, text: p.lines.map(([k, v]) => `${k}: ${v}`).join("\n") });
  return { ok: true as const };
}

/** Sends on every configured channel. Returns true when at least one delivered; false when none is configured; throws when all configured channels failed. */
export async function notifyAll(p: Payload): Promise<boolean> {
  const results = await Promise.allSettled([notifyTelegram(p), notifyEmail(p)]);
  const delivered = results.some((r) => r.status === "fulfilled" && "ok" in r.value);
  const configured = telegramConfigured || smtpConfigured;
  if (configured && !delivered) throw new Error("no notification channel delivered");
  if (!configured) console.warn(JSON.stringify({ level: "warn", msg: "no TELEGRAM_* or SMTP_* configured; lead saved for /admin/leads", title: p.title }));
  return delivered;
}
