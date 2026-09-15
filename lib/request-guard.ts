import "server-only";
import { env } from "./env";
import { SITE_URL } from "./site";
import { supabaseAdmin } from "./supabase";

/** Client IP: only trusts proxy headers when TRUST_PROXY=1 (UGOS reverse proxy or a Cloudflare Tunnel in front). */
export function clientIp(req: Request): string {
  const trust = env.TRUST_PROXY === "1";
  const cf = req.headers.get("cf-connecting-ip"); // Cloudflare's canonical client address
  const xff = req.headers.get("x-forwarded-for");
  const real = req.headers.get("x-real-ip");
  if (trust && cf) return cf.trim();
  if (trust && xff) return xff.split(",")[0]?.trim() || "unknown";
  if (trust && real) return real;
  return "direct";
}

// Sliding window per IP, in memory (single container). Survives until the container restarts.
const buckets = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;

function localRateLimit(ip: string): number {
  const now = Date.now();
  const arr = (buckets.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= env.RATE_LIMIT_MAX) {
    buckets.set(ip, arr);
    const oldest = arr[0] ?? now;
    return Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000));
  }
  arr.push(now);
  buckets.set(ip, arr);
  if (buckets.size > 5000) for (const [k, v] of buckets) if (!v.some((t) => now - t < WINDOW_MS)) buckets.delete(k);
  return 0;
}

/** Returns seconds to wait when limited, 0 when allowed. Supabase keeps the window shared across Vercel instances. */
export async function rateLimit(ip: string): Promise<number> {
  try {
    const { data, error } = await supabaseAdmin().rpc("consume_rate_limit", {
      p_key: ip,
      p_limit: env.RATE_LIMIT_MAX,
      p_window_seconds: WINDOW_MS / 1000,
    });
    if (error) throw error;
    return Number(data) || 0;
  } catch (error) {
    log("warn", "shared rate limit unavailable; using instance-local fallback", { err: String(error) });
    return localRateLimit(ip);
  }
}

function allowedOrigins(): Set<string> {
  const set = new Set<string>();
  try { set.add(new URL(SITE_URL).origin); } catch {}
  for (const o of (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean)) set.add(o);
  if (env.NODE_ENV !== "production") { set.add("http://localhost:3000"); set.add("http://127.0.0.1:3000"); }
  return set;
}

/** POSTs must come from our own pages: Origin (or Referer) has to match the site, or the request Host itself. */
export function originAllowed(req: Request): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const src = origin ?? (referer ? safeOrigin(referer) : null);
  if (!src) return false; // browsers always send Origin on cross-site POST and same-origin fetch POST
  if (allowedOrigins().has(src)) return true;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (host) {
    try { if (new URL(src).host === host) return true; } catch {}
  }
  return false;
}

function safeOrigin(u: string): string | null {
  try { return new URL(u).origin; } catch { return null; }
}

/** Honeypot filled or the form was submitted faster than a human could (2 s). */
export function looksLikeBot(website: string | undefined, startedAt: number | undefined): boolean {
  if (website) return true;
  if (typeof startedAt === "number" && Number.isFinite(startedAt) && Date.now() - startedAt < 2000) return true;
  return false;
}

export function normalizePhone(s: string): string {
  const cleaned = s.replace(/[^\d+]/g, "");
  return cleaned.startsWith("+") ? "+" + cleaned.slice(1).replace(/\+/g, "") : cleaned;
}

export function normalizeEmail(s: string): string {
  return s.trim().toLowerCase();
}

/** Standard JSON error without echoing input. */
export function jsonError(code: string, status: number, headers?: Record<string, string>) {
  return Response.json({ error: code }, { status, headers });
}

export function log(level: "info" | "warn" | "error", msg: string, extra?: Record<string, unknown>) {
  const line = JSON.stringify({ level, msg, ts: new Date().toISOString(), ...extra });
  if (level === "error") console.error(line); else if (level === "warn") console.warn(line); else console.log(line);
}
