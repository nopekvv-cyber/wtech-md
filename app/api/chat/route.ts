import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/chat-knowledge";
import { notifyAll } from "@/lib/notify";
import { insertLead, markDelivered } from "@/lib/db";
import { chatConfigured } from "@/lib/env";
import { clientIp, rateLimit, originAllowed, jsonError, log } from "@/lib/request-guard";
import type { Locale } from "@/i18n/routing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z
  .object({
    locale: z.enum(["ro", "ru", "en"]).default("ro"),
    messages: z
      .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(2000) }).strict())
      .min(1)
      .max(30),
  })
  .strict();

const LEAD_TITLE: Record<Locale, string> = { ro: "Lead din chatul cu Ana", ru: "Заявка из чата с Аной", en: "Lead from the Ana chat" };

const leadTool = {
  name: "capture_lead",
  description: "Send the visitor's contact details to the wtech.md team so a person calls them back. Call it once, only after the visitor gave a phone number or email.",
  strict: true,
  input_schema: {
    type: "object" as const,
    properties: {
      name: { type: "string", description: "Visitor's name as given" },
      phone: { type: "string", description: "Phone or WhatsApp number as given, empty string if none" },
      email: { type: "string", description: "Email as given, empty string if none" },
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
  const { locale, messages } = parsed.data;
  if (messages[messages.length - 1]?.role !== "user") return jsonError("invalid", 400);

  // No credentials on this server: tell the widget so it shows the messenger links instead.
  if (!chatConfigured) return jsonError("offline", 503);

  const client = new Anthropic();
  const history: Anthropic.MessageParam[] = messages.map((m) => ({ role: m.role, content: m.content }));
  const system = await buildSystemPrompt(locale);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        let leadSent = false;
        for (let turn = 0; turn < 3; turn++) {
          const s = client.messages.stream({
            model: "claude-opus-5",
            max_tokens: 1024, // deliberately short chat answers
            output_config: { effort: "low" },
            system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
            tools: [leadTool],
            messages: history,
          });
          s.on("text", (delta) => ndjson(controller, { t: "text", d: delta }));
          const msg = await s.finalMessage();
          if (msg.stop_reason === "refusal") { ndjson(controller, { t: "error" }); break; }
          if (msg.stop_reason !== "tool_use") break;
          history.push({ role: "assistant", content: msg.content });
          const results: Anthropic.ToolResultBlockParam[] = [];
          for (const block of msg.content) {
            if (block.type !== "tool_use") continue;
            let result = "ok";
            if (block.name === "capture_lead" && !leadSent) {
              const input = block.input as { name: string; phone: string; email: string; interest: string; summary: string };
              if (input.phone || input.email) {
                const clip = (v: unknown, n: number) => String(v ?? "").slice(0, n);
                let id = 0;
                try {
                  id = await insertLead({ kind: "chat", locale, name: clip(input.name, 120), phone: clip(input.phone, 40), email: clip(input.email, 160), interest: clip(input.interest, 200), message: clip(input.summary, 1000), ip });
                } catch (e) {
                  log("error", "chat lead insert failed", { err: String(e) });
                }
                try {
                  const delivered = await notifyAll({
                    title: LEAD_TITLE[locale],
                    locale,
                    lines: [["Nume / Имя / Name", clip(input.name, 120)], ["Telefon", clip(input.phone, 40)], ["E-mail", clip(input.email, 160)], ["Interes", clip(input.interest, 200)], ["Rezumat", clip(input.summary, 1000)], ["ID", String(id)]],
                  });
                  if (delivered && id) await markDelivered(id);
                  leadSent = true;
                  ndjson(controller, { t: "lead" });
                } catch (e) {
                  log("error", "chat lead notify failed", { id, err: String(e) });
                  result = id ? "ok (stored; the team will call back)" : "error: could not deliver the lead; ask the visitor to write on WhatsApp";
                  if (id) { leadSent = true; ndjson(controller, { t: "lead" }); }
                }
              } else {
                result = "error: no phone or email given";
              }
            }
            results.push({ type: "tool_result", tool_use_id: block.id, content: result });
          }
          history.push({ role: "user", content: results });
        }
        ndjson(controller, { t: "done" });
      } catch (e) {
        if (e instanceof Anthropic.RateLimitError) log("error", "chat: rate limited by API");
        else if (e instanceof Anthropic.AuthenticationError) log("error", "chat: invalid credentials");
        else if (e instanceof Anthropic.APIError) log("error", "chat: API error", { status: e.status, message: e.message });
        else log("error", "chat: failed", { err: String(e) });
        ndjson(controller, { t: "error" });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" } });
}
