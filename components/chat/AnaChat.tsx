"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { m, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Sparkles } from "lucide-react";
import { useBrand } from "@/components/preloader/BrandContext";
import { whatsappHref } from "@/lib/site";
import { useSite } from "@/components/site/SiteContext";
import { track } from "@/lib/analytics";
import type { Locale } from "@/i18n/routing";

type Msg = { role: "user" | "assistant"; content: string };

/**
 * Ana: the AI employee for visitors. Streams answers from /api/chat (Claude, grounded in the site's copy for the
 * current locale) and hands leads to Telegram/SMTP through the capture_lead tool.
 */
export function AnaChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("chat");
  const locale = useLocale() as Locale;
  const { contact } = useSite();
  const { openBooking } = useBrand();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    track("chat_open");
    const id = setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(id); window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    setNotice(null);
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setBusy(true);
    track("chat_message", { n: next.filter((x) => x.role === "user").length });
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale, messages: next }),
      });
      if (res.status === 503) { setOffline(true); setMsgs(next); return; }
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let acc = "";
      let failed = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const ev = JSON.parse(line) as { t: string; d?: string };
          if (ev.t === "text") { acc += ev.d ?? ""; setMsgs([...next, { role: "assistant", content: acc }]); }
          else if (ev.t === "lead") setNotice(t("leadSaved"));
          else if (ev.t === "error") failed = true;
        }
      }
      if (failed && !acc) setMsgs([...next, { role: "assistant", content: t("error") }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: t("error") }]);
    } finally {
      setBusy(false);
    }
  }

  const suggestions = [t("s1"), t("s2"), t("s3"), t("s4")];

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ana-title"
          className="fixed inset-0 lg:inset-auto lg:right-6 lg:bottom-6 z-[70] flex flex-col bg-surface lg:w-[400px] lg:h-[min(640px,calc(100vh-48px))] lg:rounded-[var(--radius-lg)] border-0 lg:border border-line shadow-[0_30px_90px_rgba(0,0,0,0.7)] overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <header className="flex items-center gap-3 px-4 py-3 border-b border-line" style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}>
            <span className="shrink-0 w-9 h-9 rounded-full grid place-items-center" style={{ background: "conic-gradient(from 180deg, #6E3BFF, #FF7A6B, #35E3F0, #6E3BFF)" }} aria-hidden="true">
              <span className="w-7 h-7 rounded-full bg-surface grid place-items-center"><Sparkles size={13} /></span>
            </span>
            <div className="min-w-0 flex-1">
              <h2 id="ana-title" className="text-[15px] font-medium leading-tight">{t("title")}</h2>
              <p className="text-dim text-[12px] truncate">{t("subtitle")}</p>
            </div>
            <a href={whatsappHref(locale, contact.whatsapp)} target="_blank" rel="noopener noreferrer" className="w-10 h-10 grid place-items-center rounded-full border border-line text-dim hover:text-ink" aria-label={t("whatsapp")} onClick={() => track("cta_whatsapp_click", { place: "chat" })}>
              <MessageCircle size={16} />
            </a>
            <button type="button" className="w-10 h-10 grid place-items-center rounded-full text-dim hover:text-ink" aria-label={t("close")} onClick={onClose}>
              <X size={18} />
            </button>
          </header>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-[14.5px] leading-relaxed" data-lenis-prevent>
            <Bubble from="assistant">{t("greeting")}</Bubble>
            {msgs.map((mm, i) => (
              <Bubble key={i} from={mm.role}>
                {mm.content || (busy && i === msgs.length - 1 ? <span className="text-dim">{t("typing")}</span> : "")}
              </Bubble>
            ))}
            {offline ? (
              <div className="rounded-[var(--radius-md)] border border-line p-3 text-[13px] text-dim">
                {t("offline")}
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={whatsappHref(locale, contact.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">{t("whatsapp")}</a>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => { onClose(); openBooking(); }}>{t("book")}</button>
                </div>
              </div>
            ) : null}
            {notice ? <div role="status" className="rounded-[var(--radius-md)] p-3 text-[13px]" style={{ background: "rgba(53,227,240,0.12)" }}>{notice}</div> : null}
            {msgs.length === 0 && !offline ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((s) => (
                  <button key={s} type="button" className="rounded-full border border-line px-3 py-2 text-[13px] text-ink/85 hover:border-white/40" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            ) : null}
          </div>

          <form
            className="flex items-center gap-2 px-3 py-3 border-t border-line"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
            onSubmit={(e) => { e.preventDefault(); send(input); }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="field flex-1 min-h-[44px] py-2"
              placeholder={t("placeholder")}
              aria-label={t("placeholder")}
              maxLength={2000}
              disabled={offline}
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary min-h-[44px] px-4" disabled={busy || offline || !input.trim()} aria-label={t("send")}>
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
          <p className="text-dim text-[11px] px-4 pb-2 lg:pb-3">{t("disclaimer")}</p>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

function Bubble({ from, children }: { from: "user" | "assistant"; children: React.ReactNode }) {
  return (
    <div className={`flex ${from === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-[16px] px-3.5 py-2.5 whitespace-pre-wrap ${from === "user" ? "bg-ink text-black" : "bg-white/[0.07]"}`}>{children}</div>
    </div>
  );
}
