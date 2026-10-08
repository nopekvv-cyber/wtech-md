import { z } from "zod";
import { getActor } from "@/lib/admin-auth";
import { originAllowed } from "@/lib/request-guard";
import { readBody } from "@/lib/workspace-db";
import { stages } from "@/lib/workspace-types";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const json = (d: unknown, status = 200) =>
  Response.json(d, { status, headers: { "Cache-Control": "no-store" } });
export async function GET() {
  const actor = await getActor();
  if (!actor || !["owner", "sales"].includes(actor.role))
    return json({ error: "unauthorized" }, 401);
  const [leads, notes, audit] = await Promise.all([
    actor.db
      .from("leads")
      .select(
        "id,created_at,name,company,email,phone,message,interest,channel,source,stage,next_action,follow_up_at,value,currency,handled,delivered,owner_id,version,privacy_version,marketing_consent",
      )
      .order("id", { ascending: false })
      .limit(200),
    actor.db
      .from("wtech_records")
      .select(
        "id,title,status,lead_id,due_at,payload,version,created_at,updated_at",
      )
      .eq("module", "tasks")
      .order("created_at", { ascending: false })
      .limit(500),
    actor.role === "owner"
      ? actor.db
          .from("wtech_audit")
          .select("id,entity,entity_id,action,created_at")
          .in("entity", ["leads", "wtech_records"])
          .order("id", { ascending: false })
          .limit(200)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (leads.error || notes.error || audit.error)
    return json({ error: "unavailable" }, 503);
  return json({
    leads: leads.data,
    notes: notes.data,
    audit: audit.data,
    role: actor.role,
  });
}
export async function POST(req: Request) {
  const actor = await getActor();
  if (!actor || !["owner", "sales"].includes(actor.role))
    return json({ error: "unauthorized" }, 401);
  if (!originAllowed(req)) return json({ error: "origin_rejected" }, 403);
  let raw;
  try {
    raw = await readBody(req);
  } catch {
    return json({ error: "invalid_body" }, 400);
  }
  const command = z
    .object({ action: z.enum(["lead", "note"]), data: z.unknown() })
    .strict()
    .safeParse(raw);
  if (!command.success) return json({ error: "invalid_command" }, 400);
  if (command.data.action === "lead") {
    const result = z
      .object({
        id: z.number().int().positive(),
        version: z.number().int().positive(),
        stage: z.enum(stages),
        next_action: z.string().max(500).nullable(),
        follow_up_at: z.string().datetime({ offset: true }).nullable(),
        value: z.number().nonnegative().max(9999999999),
        currency: z.string().regex(/^[A-Z]{3}$/),
        handled: z.boolean(),
        assign: z.boolean().default(false),
      })
      .strict()
      .safeParse(command.data.data);
    if (!result.success) return json({ error: "invalid" }, 400);
    const { id, version, assign, ...row } = result.data;
    const r = await actor.db
      .from("leads")
      .update({ ...row, ...(assign ? { owner_id: actor.id } : {}) })
      .eq("id", id)
      .eq("version", version)
      .select("id")
      .single();
    if (r.error)
      return json(
        {
          error: r.error.code === "PGRST116" ? "edit_conflict" : "save_failed",
        },
        409,
      );
  } else {
    const result = z
      .object({
        id: z.string().uuid().optional(),
        version: z.number().int().positive().optional(),
        lead_id: z.number().int().positive(),
        title: z.string().trim().min(2).max(180),
        notes: z.string().trim().min(1).max(4000),
        status: z.enum(["open", "done", "blocked"]),
        due_at: z.string().datetime({ offset: true }).nullable(),
      })
      .strict()
      .safeParse(command.data.data);
    if (!result.success) return json({ error: "invalid" }, 400);
    const d = result.data;
    const row = {
      module: "tasks",
      lead_id: d.lead_id,
      title: d.title,
      status: d.status,
      due_at: d.due_at,
      payload: { notes: d.notes },
    };
    const r = d.id
      ? await actor.db
          .from("wtech_records")
          .update(row)
          .eq("id", d.id)
          .eq("module", "tasks")
          .eq("version", d.version || 0)
          .select("id")
          .single()
      : await actor.db
          .from("wtech_records")
          .insert({ ...row, owner_id: actor.id })
          .select("id")
          .single();
    if (r.error)
      return json(
        {
          error: r.error.code === "PGRST116" ? "edit_conflict" : "save_failed",
        },
        409,
      );
  }
  return json({ ok: true });
}
