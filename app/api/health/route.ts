import { supabaseConfigured } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  if (process.env.ALLOW_IN_MEMORY_DB === "1") return Response.json({ ok: true, database: "test-memory" }, { headers: { "cache-control": "no-store" } });
  if (!supabaseConfigured) return Response.json({ ok: false, database: "not_configured" }, { status: 503, headers: { "cache-control": "no-store" } });
  const { error } = await supabaseAdmin().from("settings").select("key", { head: true, count: "exact" });
  if (error) return Response.json({ ok: false, database: "unavailable" }, { status: 503, headers: { "cache-control": "no-store" } });
  return Response.json({ ok: true, database: "connected" }, { headers: { "cache-control": "no-store" } });
}
