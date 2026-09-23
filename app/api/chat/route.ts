import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/chat-knowledge";
import { notifyAll } from "@/lib/notify";
import { insertLead, markDelivered } from "@/lib/db";
import { env } from "@/lib/env";
import { clientIp, rateLimit, originAllowed, jsonError, log } from "@/lib/request-guard";
import type { Locale } from "@/i18n/routing";
import { marketForHost } from "@/lib/market";
import { appendConsent, consentRecord } from "@/lib/compliance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z
  .object({
    locale: z.enum(["ro", "ru", "en"]).default("ro"),
    messages: z
      .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(2000) }).strict())
      .min(1)
      .max(30),
    privacyAccepted: z.literal(true),
  })
  .strict();

const leadInputSchema = z
  .object({
    name: z.string().trim().max(120),
    phone: z.string().trim().max(40),
    email: z.string().trim().max(160),
    interest: z.string().trim().max(200),
    summary: z.string().trim().max(1000),
  })
  .strict();

const LEAD_TITLE: Record<Locale, string> = { ro: "Lead din chatul cu Ana", ru: "Заявка из чата с Аной", en: "Lead from the Ana chat" };

const leadTool: Anthropic.Tool = {
  name: "capture_lead",
  description: "Send the visitor's contact details to the wtech.md team so a person calls them back. Call it once, only after the visitor gave a phone number or email.",
  strict: true,
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Visitor's name as given, or an empty string" },
      phone: { type: "string", description: "Phone or WhatsApp number as given, or an empty string" },
      email: { type: "string", description: "Email as given, or an empty string" },
      interest: { type: "string", description: "What they want to build, in one short sentence" },
      summary: { type: "string", description: "Two-sentence summary of the conversation for the team" },
    },
    required: ["name", "phone", "email", "interest", "summary"],
    additionalProperties: false,
  },
};

function ndjson(controller: ReadableStreamDefaultController, obj: unknown) {
  controller.enqueue(new TextEncoder().encode(JSON.stringify(obj) + "\n"));
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const wait = await rateLimit(ip);
  if (wait) return jsonError("rate_limited", 429, { "retry-after": String(wait) });
  if (!originAllowed(req)) return jsonError("forbidden", 403);
  let body: unknown;
  try { body = await req.json(); } catch { return jsonError("bad_request", 400); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return jsonError("invalid", 400);
  const market = marketForHost(req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  const locale: Locale = market === "international" ? "en" : parsed.data.locale;
  const { messages } = parsed.data;
  if (messages[messages.length - 1]?.role !== "user") return jsonError("invalid", 400);
  if (env.CHAT_DISABLED === "1" || !env.ANTHROPIC_API_KEY) return jsonError("offline", 503);

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, timeout: 20_000, maxRetries: 1 });
  const history: Anthropic.MessageParam[] = messages.map((message) => ({ role: message.role, content: message.content }));
  const system = await buildSystemPrompt(locale, market, req.headers.get("x-vercel-ip-country"));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let leadSent = false;
        for (let turn = 0; turn < 3; turn++) {
          const response = client.messages.stream({
            model: "claude-sonnet-5",
            max_tokens: 1024,
            output_config: { effort: "low" },
            system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
            tools: [leadTool],
            messages: history,
          });
          response.on("text", (delta) => ndjson(controller, { t: "text", d: delta }));
          const message = await response.finalMessage();
          if (message.stop_reason === "refusal") { ndjson(controller, { t: "error" }); break; }
          if (message.stop_reason !== "tool_use") break;

          history.push({ role: "assistant", content: message.content });
          const results: Anthropic.ToolResultBlockParam[] = [];
          for (const block of message.content) {
            if (block.type !== "tool_use") continue;
            let result = "error: unsupported tool";
            if (block.name === "capture_lead" && !leadSent) {
              const lead = leadInputSchema.safeParse(block.input);
              if (!lead.success) {
                result = "error: invalid contact details";
              } else if (!lead.data.phone && !lead.data.email) {
                result = "error: no phone or email given";
              } else {
                const contact = lead.data;
                let id = 0;
                try {
                  id = await insertLead({
                    kind: "chat",
                    locale,
                    name: contact.name,
                    phone: contact.phone,
                    email: contact.email,
                    interest: contact.interest,
                    message: appendConsent(contact.summary, "chat", false),
                    ip,
                  });
                } catch (e) {
                  log("error", "chat lead insert failed", { err: String(e) });
                }
                try {
                  const delivered = await notifyAll({
                    title: LEAD_TITLE[locale],
                    locale,
                    lines: [["Nume / Имя / Name", contact.name], ["Telefon", contact.phone], ["E-mail", contact.email], ["Interes", contact.interest], ["Rezumat", contact.summary], ["Consimțământ", consentRecord("chat", false)], ["ID", String(id)]],
                  });
                  if (delivered && id) await markDelivered(id);
                  leadSent = true;
                  result = "ok";
                  ndjson(controller, { t: "lead" });
                } catch (e) {
                  log("error", "chat lead notify failed", { id, err: String(e) });
                  result = id ? "ok (stored; the team will call back)" : "error: could not deliver the lead; ask the visitor to write on WhatsApp";
                  if (id) { leadSent = true; ndjson(controller, { t: "lead" }); }
                }
              }
            }
            results.push({ type: "tool_result", tool_use_id: block.id, content: result });
          }
          history.push({ role: "user", content: results });
        }
        ndjson(controller, { t: "done" });
      } catch (e) {
        if (e instanceof Anthropic.RateLimitError) log("error", "chat: rate limited by Anthropic");
        else if (e instanceof Anthropic.AuthenticationError) log("error", "chat: invalid Anthropic credentials");
        else if (e instanceof Anthropic.APIError) log("error", "chat: Anthropic API error", { status: e.status, message: e.message });
        else log("error", "chat: failed", { err: String(e) });
        ndjson(controller, { t: "error" });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" } });
}
