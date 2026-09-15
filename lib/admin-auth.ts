import "server-only";
import { createHmac, randomBytes, timingSafeEqual, createHash } from "node:crypto";
import { cookies, headers } from "next/headers";
import { env } from "./env";
import { log } from "./request-guard";

/**
 * Single-operator admin session for /admin. The password is ADMIN_PASSWORD (or, when unset, a random one generated
 * at startup and printed once to the server log so the preview stays zero-config). Sessions are HMAC-signed
 * expiring tokens in an httpOnly cookie. ADMIN_SESSION_SECRET is preferred; otherwise a stable key is derived from
 * ADMIN_PASSWORD so every Vercel function instance can verify the same session.
 */
export const COOKIE = "wtech_admin";
const SESSION_MS = 8 * 60 * 60 * 1000;

let generated: string | null = null;
export function adminPassword(): string {
  if (env.ADMIN_PASSWORD) return env.ADMIN_PASSWORD;
  if (!generated) {
    generated = randomBytes(9).toString("base64url");
    log("warn", "ADMIN_PASSWORD not set: temporary admin password for /admin (changes on every restart)", { password: generated });
  }
  return generated;
}

function secret(): Buffer {
  const source = env.ADMIN_SESSION_SECRET || `wtech-admin-session:${adminPassword()}`;
  return createHash("sha256").update(source).digest();
}

function sig(exp: string): string {
  return createHmac("sha256", secret()).update(exp).digest("hex");
}

export function passwordMatches(given: string): boolean {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(adminPassword()).digest();
  return timingSafeEqual(a, b);
}

export function signSession(): { value: string; expires: Date } {
  const exp = String(Date.now() + SESSION_MS);
  return { value: `${exp}.${sig(exp)}`, expires: new Date(Number(exp)) };
}

export function verifySession(token: string | undefined): boolean {
  if (!token) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = sig(exp);
  return mac.length === expected.length && timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
}

export async function isAdmin(): Promise<boolean> {
  return verifySession((await cookies()).get(COOKIE)?.value);
}

/** Client IP for the login rate limit, same trust rule as the API routes. */
export async function requestIp(): Promise<string> {
  const h = await headers();
  const cf = h.get("cf-connecting-ip");
  const xff = h.get("x-forwarded-for");
  if (env.TRUST_PROXY === "1" && cf) return cf.trim();
  if (env.TRUST_PROXY === "1" && xff) return xff.split(",")[0]?.trim() || "unknown";
  return h.get("x-real-ip") || "local";
}

export async function isHttps(): Promise<boolean> {
  const h = await headers();
  return (h.get("x-forwarded-proto") ?? "").split(",")[0]?.trim() === "https";
}
