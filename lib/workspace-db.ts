import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
export function publicDb() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("database_not_configured");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export function userDb(token: string) {
  publicDb();
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } },
    },
  );
}
export async function sharedGate(
  req: Request,
  kind: "faq" | "intake" | "login",
) {
  const ip = process.env.VERCEL
    ? req.headers.get("x-vercel-forwarded-for") ||
      req.headers.get("x-forwarded-for") ||
      "unknown"
    : req.headers.get("x-real-ip") || "local";
  const key = createHash("sha256")
    .update(`${kind}:${ip}:${process.env.ANTHROPIC_API_KEY || "wtech"}`)
    .digest("hex");
  const { data, error } = await publicDb().rpc("wtech_rate_gate", {
    key_hash: key,
    kind,
  });
  if (error) throw new Error("rate_limit_unavailable");
  return Number(data) || 0;
}
export async function readBody(req: Request, limit = 16000): Promise<unknown> {
  if (!req.headers.get("content-type")?.includes("application/json"))
    throw new Error("content_type");
  if (Number(req.headers.get("content-length") || 0) > limit)
    throw new Error("too_large");
  const raw = await req.text();
  if (Buffer.byteLength(raw) > limit) throw new Error("too_large");
  return JSON.parse(raw);
}
