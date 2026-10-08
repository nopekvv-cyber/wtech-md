import {readBody} from "@/lib/workspace-db";
import { z } from "zod";
import { insertLead, markDelivered } from "@/lib/db";
import { notifyAll } from "@/lib/notify";
import { clientIp, rateLimit, originAllowed, looksLikeBot, normalizePhone, normalizeEmail, jsonError, log } from "@/lib/request-guard";
import { consentRecord } from "@/lib/compliance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z
  .object({
    kind: z.enum(["contact", "call"]),
    channel:z.enum(["phone","email","whatsapp"]).default("phone"),
    idempotencyKey:z.string().uuid().optional(),
    source:z.string().max(300).optional(),
    locale: z.enum(["ro", "ru", "en"]).default("ro"),
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().max(40).regex(/^[+\d\s()\-]*$/).default(""),
    email: z.string().trim().max(160).optional().default(""),
    company: z.string().trim().max(160).optional().default(""),
    message: z.string().trim().max(2000).optional().default(""),
    interest: z.string().trim().max(200).optional().default(""),
    when: z.string().trim().max(120).optional().default(""),
    website: z.string().max(200).optional().default(""), // honeypot
    startedAt: z.number().int().positive().optional(),
    privacyAccepted: z.literal(true),
    marketingConsent: z.boolean().optional().default(false),
  })
  .strict();

const TITLES = {
  contact: { ro: "Lead nou de pe site", ru: "Новая заявка с сайта", en: "New lead from the site" },
  call: { ro: "Cerere apel de 30 min", ru: "Запрос на звонок 30 мин", en: "30-min call request" },
} as const;

export async function POST(req: Request) {
  if (!originAllowed(req)) return jsonError("forbidden", 403);
  const ip = clientIp(req);
  const wait = await rateLimit(ip);
  if (wait) return jsonError("rate_limited", 429, { "retry-after": String(wait) });
  if (!originAllowed(req)) return jsonError("forbidden", 403);
  let body: unknown;
  try { body = await readBody(req); } catch { return jsonError("bad_request", 400); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("invalid", 400);
  const d = parsed.data;
  if (looksLikeBot(d.website, d.startedAt)) return Response.json({ ok: true }); // bots get a quiet success
  const email = d.email ? normalizeEmail(d.email) : "";
  if (email && !z.string().email().safeParse(email).success) return jsonError("invalid", 400);
  if(d.channel==="email"&&!z.string().email().safeParse(email).success)return jsonError("invalid",400);
  const phone = normalizePhone(d.phone);
  if (d.channel!=="email"&&phone.replace(/\D/g, "").length < 8) return jsonError("invalid", 400);

  let id: number;
  try {
    const saved = await insertLead({ kind: d.kind, locale: d.locale, name: d.name, phone, email, company: d.company, message: d.message, interest: d.interest || d.when, ip,channel:d.channel,idempotencyKey:d.idempotencyKey,source:d.source||new URL(req.url).pathname,marketingConsent:d.marketingConsent,privacyAccepted:true });
    id=saved.id;
    if(saved.duplicate)return Response.json({ok:true,duplicate:true});
  } catch (e) {
    if(String(e).includes("idempotency_conflict"))return jsonError("conflict",409);
    if(String(e).includes("rate_limited"))return jsonError("rate_limited",429,{"retry-after":"600"});
    log("error", "lead insert failed", { err: String(e) });
    return jsonError("unavailable", 503);
  }
  try {
    const delivered = await notifyAll({
      title: TITLES[d.kind][d.locale],
      locale: d.locale,
      lines: [["Nume / Имя / Name", d.name], ["Telefon", phone], ["E-mail", email], ["Companie", d.company], ["Interes", d.interest], ["Când", d.when], ["Mesaj", d.message], ["Consimțământ", consentRecord(d.kind, d.marketingConsent)], ["ID", String(id)]],
    });
    if (delivered) await markDelivered(id);
  } catch (e) {
    // Stored already; the operator can see it in Supabase and /admin/leads.
    log("error", "lead notify failed", { id, err: String(e) });
  }
  return Response.json({ ok: true });
}
