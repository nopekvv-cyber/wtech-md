import "server-only";
import { dbError, supabaseAdmin } from "./supabase";
import { supabaseConfigured } from "./env";

export type LeadRow = {
  kind: "contact" | "call" | "audit" | "chat";
  locale: string;
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  message?: string;
  interest?: string;
  url?: string;
  ip: string;
};

export type Lead = {
  id: number;
  created_at: string;
  kind: string;
  locale: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  company: string | null;
  message: string | null;
  interest: string | null;
  url: string | null;
  delivered: boolean;
  handled: boolean;
};

const LEAD_COLS = "id, created_at, kind, locale, name, phone, email, company, message, interest, url, delivered, handled";
const memory = { leads: [] as Lead[], settings: {} as Record<string, string>, nextId: 1 };
const memoryEnabled = () => !supabaseConfigured && process.env.ALLOW_IN_MEMORY_DB === "1";

/** Newest first; `open` limits to leads not yet marked handled. */
export async function listLeads(opts: { open?: boolean; limit?: number; offset?: number } = {}): Promise<Lead[]> {
  const limit = Math.min(200, Math.max(1, opts.limit ?? 50));
  const offset = Math.max(0, opts.offset ?? 0);
  if (memoryEnabled()) {
    const rows = opts.open ? memory.leads.filter((row) => !row.handled) : memory.leads;
    return [...rows].sort((a, b) => b.id - a.id).slice(offset, offset + limit);
  }
  let query = supabaseAdmin().from("leads").select(LEAD_COLS).order("id", { ascending: false }).range(offset, offset + limit - 1);
  if (opts.open) query = query.eq("handled", false);
  const { data, error } = await query;
  dbError("list leads", error);
  return (data ?? []) as Lead[];
}

export async function countLeads(open = false): Promise<number> {
  if (memoryEnabled()) return open ? memory.leads.filter((row) => !row.handled).length : memory.leads.length;
  let query = supabaseAdmin().from("leads").select("id", { count: "exact", head: true });
  if (open) query = query.eq("handled", false);
  const { count, error } = await query;
  dbError("count leads", error);
  return count ?? 0;
}

export async function setHandled(id: number, handled: boolean): Promise<void> {
  if (memoryEnabled()) {
    const row = memory.leads.find((lead) => lead.id === id);
    if (row) row.handled = handled;
    return;
  }
  const { error } = await supabaseAdmin().from("leads").update({ handled }).eq("id", id);
  dbError("update lead", error);
}

/** All leads as CSV (UTF-8 with BOM for Excel). Cells that could be read as formulas are neutralised. */
export async function leadsCsv(): Promise<string> {
  let rows: Lead[];
  if (memoryEnabled()) {
    rows = [...memory.leads].sort((a, b) => b.id - a.id);
  } else {
    const { data, error } = await supabaseAdmin().from("leads").select(LEAD_COLS).order("id", { ascending: false }).limit(10000);
    dbError("export leads", error);
    rows = (data ?? []) as Lead[];
  }
  const cell = (value: unknown) => {
    let s = value === null || value === undefined ? "" : String(value);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = ["id", "created_at", "kind", "locale", "name", "phone", "email", "company", "message", "interest", "url", "delivered", "handled"];
  const lines = [head.join(",")];
  for (const row of rows) lines.push(head.map((key) => cell((row as unknown as Record<string, unknown>)[key])).join(","));
  return "\ufeff" + lines.join("\r\n") + "\r\n";
}

/** Every CMS setting, key -> value (empty string means cleared). */
export async function readSettings(): Promise<Record<string, string>> {
  if (memoryEnabled()) return { ...memory.settings };
  const { data, error } = await supabaseAdmin().from("settings").select("key, value");
  dbError("read settings", error);
  const out: Record<string, string> = {};
  for (const row of data ?? []) out[row.key] = row.value;
  return out;
}

export async function writeSettings(values: Record<string, string>): Promise<void> {
  if (memoryEnabled()) {
    Object.assign(memory.settings, values);
    return;
  }
  const now = new Date().toISOString();
  const rows = Object.entries(values).map(([key, value]) => ({ key, value, updated_at: now }));
  if (!rows.length) return;
  const { error } = await supabaseAdmin().from("settings").upsert(rows, { onConflict: "key" });
  dbError("write settings", error);
}

export async function insertLead(row: LeadRow): Promise<number> {
  if (memoryEnabled()) {
    const id = memory.nextId++;
    memory.leads.push({
      id,
      created_at: new Date().toISOString(),
      kind: row.kind,
      locale: row.locale,
      name: row.name ?? null,
      phone: row.phone ?? null,
      email: row.email ?? null,
      company: row.company ?? null,
      message: row.message ?? null,
      interest: row.interest ?? null,
      url: row.url ?? null,
      delivered: false,
      handled: false,
    });
    return id;
  }
  const { data, error } = await supabaseAdmin()
    .from("leads")
    .insert({
      kind: row.kind,
      locale: row.locale,
      name: row.name ?? null,
      phone: row.phone ?? null,
      email: row.email ?? null,
      company: row.company ?? null,
      message: row.message ?? null,
      interest: row.interest ?? null,
      url: row.url ?? null,
      ip: row.ip,
    })
    .select("id")
    .single();
  dbError("insert lead", error);
  if (!data?.id) throw new Error("insert lead returned no id");
  return Number(data.id);
}

export async function markDelivered(id: number): Promise<void> {
  if (memoryEnabled()) {
    const row = memory.leads.find((lead) => lead.id === id);
    if (row) row.delivered = true;
    return;
  }
  const { error } = await supabaseAdmin().from("leads").update({ delivered: true, delivered_at: new Date().toISOString() }).eq("id", id);
  dbError("mark lead delivered", error);
}
