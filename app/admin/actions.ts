"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { COOKIE, isAdmin, isHttps, passwordMatches, requestIp, signSession } from "@/lib/admin-auth";
import { rateLimit, log } from "@/lib/request-guard";
import { writeSettings, setHandled } from "@/lib/db";
import { FIELDS } from "@/lib/settings";

export type ActionState = { error?: string; ok?: boolean; at?: string };

export async function login(_prev: ActionState, form: FormData): Promise<ActionState> {
  const ip = await requestIp();
  if (await rateLimit(`admin:${ip}`)) { log("warn", "admin login rate limited", { ip }); return { error: "Prea multe încercări. Încearcă din nou peste câteva minute." }; }
  const password = String(form.get("password") ?? "");
  if (!password || !passwordMatches(password)) { log("warn", "admin login failed", { ip }); return { error: "Parolă greșită." }; }
  const s = signSession();
  (await cookies()).set(COOKIE, s.value, { httpOnly: true, sameSite: "strict", secure: await isHttps(), path: "/admin", expires: s.expires });
  log("info", "admin login", { ip });
  redirect("/admin");
}

export async function toggleHandled(form: FormData): Promise<void> {
  if (!(await isAdmin())) return;
  const id = Number(form.get("id"));
  if (!Number.isInteger(id) || id <= 0) return;
  await setHandled(id, String(form.get("handled")) === "1");
  const back = String(form.get("back") ?? "/admin/leads");
  redirect(/^\/admin\/leads(\?[\w=&]*)?$/.test(back) ? back : "/admin/leads");
}

export async function logout(): Promise<void> {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
  redirect("/admin");
}

const digits = (s: string) => s.replace(/[^\d]/g, "");
/** Moldovan numbers as typed locally ("069 123 456", "69123456") become +373…; numbers with another country code stay. */
function normalizeMd(v: string): string {
  let d = digits(v);
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("373")) return "+" + d;
  if (d.startsWith("0")) return "+373" + d.slice(1);
  if (d.length === 8) return "+373" + d;
  return "+" + d;
}
const phone = z.string().trim().max(24).refine((v) => v === "" || /^\+?[\d\s()-]{7,}$/.test(v), "phone").transform((v) => v === "" ? "" : normalizeMd(v));
const validators: Record<string, z.ZodType<string>> = {
  "contact.phone": phone, "contact.whatsapp": phone, "contact.viber": phone,
  "contact.email": z.string().trim().max(120).refine((v) => v === "" || z.string().email().safeParse(v).success, "email"),
  "contact.telegram": z.string().trim().max(40).refine((v) => v === "" || /^@?[A-Za-z0-9_]{4,32}$/.test(v.replace(/^https?:\/\/t\.me\//, "")), "telegram").transform((v) => v.replace(/^https?:\/\/t\.me\//, "").replace(/^@/, "") ? "@" + v.replace(/^https?:\/\/t\.me\//, "").replace(/^@/, "") : ""),
  "contact.idno": z.string().trim().max(20).refine((v) => v === "" || /^\d{13}$/.test(v), "idno"),
};
const urlField = z.string().trim().max(200).refine((v) => v === "" || /^https:\/\/[^\s]+$/.test(v), "url");
const numberField = z.string().trim().max(12).refine((v) => v === "" || /^\d{3,7}$/.test(digits(v)), "number").transform((v) => v === "" ? "" : digits(v));

export async function saveSettings(_prev: ActionState, form: FormData): Promise<ActionState> {
  if (!(await isAdmin())) return { error: "Sesiunea a expirat. Autentifică-te din nou." };
  const values: Record<string, string> = {};
  const errors: string[] = [];
  for (const f of FIELDS) {
    const raw = String(form.get(f.key) ?? "");
    const schema = validators[f.key] ?? (f.type === "url" ? urlField : f.type === "number" ? numberField : z.string().trim().max(f.max ?? 200));
    const r = schema.safeParse(raw);
    if (!r.success) errors.push(f.label);
    else values[f.key] = r.data;
  }
  if (errors.length) return { error: `Verifică: ${errors.join(", ")}.` };
  await writeSettings(values);
  log("info", "settings saved", { keys: Object.keys(values).length });
  return { ok: true, at: new Date().toISOString() };
}
