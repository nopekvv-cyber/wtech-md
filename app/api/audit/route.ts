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
    channel:z.enum(["phone","email","whatsapp"]).default("phone"),
    idempotencyKey:z.string().uuid().optional(),
    source:z.string().max(300).optional(),
    locale: z.enum(["ro", "ru", "en"]).default("ro"),
    url: z.string().trim().min(4).max(300),
    email: z.string().trim().max(160),
    whatsapp: z.string().trim().max(40).regex(/^[+\d\s()\-]*$/).default(""),
    includeAi: z.boolean().optional().default(false),
    place: z.string().max(40).optional().default(""),
    website: z.string().max(200).optional().default(""),
    startedAt: z.number().int().positive().optional(),
    privacyAccepted: z.literal(true),
    marketingConsent: z.boolean().optional().default(false),
  })
  .strict();

const TITLE = { ro: "Cerere audit gratuit", ru: "Запрос бесплатного аудита", en: "Free audit request" } as const;

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
  if (looksLikeBot(d.website, d.startedAt)) return Response.json({ ok: true });
  const email = normalizeEmail(d.email);
  if (d.channel==="email"&&!z.string().email().safeParse(email).success) return jsonError("invalid", 400);
  const whatsapp = normalizePhone(d.whatsapp);
  if (d.channel!=="email"&&whatsapp.replace(/\D/g, "").length < 8) return jsonError("invalid", 400);
  let url: string;
  try {
    const u = new URL(/^https?:\/\//i.test(d.url) ? d.url : `https://${d.url}`);
    if (!/^https?:$/.test(u.protocol) || !u.hostname.includes(".")) throw new Error("bad url");
    url = u.toString();
  } catch { return jsonError("invalid", 400); }

  let id: number;
  try {
    const saved = await insertLead({ kind: "audit", locale: d.locale, phone: whatsapp, email, url, interest: d.includeAi ? "audit+ai" : "audit", message: d.place, ip,channel:d.channel,idempotencyKey:d.idempotencyKey,source:d.source||new URL(req.url).pathname,marketingConsent:d.marketingConsent,privacyAccepted:true });
    id=saved.id;
    if(saved.duplicate)return Response.json({ok:true,duplicate:true});
  } catch (e) {
    if(String(e).includes("idempotency_conflict"))return jsonError("conflict",409);
    if(String(e).includes("rate_limited"))return jsonError("rate_limited",429,{"retry-after":"600"});
    log("error", "audit insert failed", { err: String(e) });
    return jsonError("unavailable", 503);
  }
  try {
    const delivered = await notifyAll({
      title: TITLE[d.locale],
      locale: d.locale,
      lines: [["Site", url], ["E-mail", email], ["WhatsApp", whatsapp], ["AI visibility", d.includeAi ? "da / да / yes" : "nu / нет / no"], ["Sursă", d.place], ["Consimțământ", consentRecord("audit", d.marketingConsent)], ["ID", String(id)]],
    });
    if (delivered) await markDelivered(id);
  } catch (e) {
    log("error", "audit notify failed", { id, err: String(e) });
  }
  return Response.json({ ok: true });
}
