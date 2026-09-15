"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { track } from "@/lib/analytics";

/** 3-field lead magnet (URL, email, WhatsApp) -> /api/audit -> Telegram + SMTP. */
export function AuditForm({ compact = false, place = "section", showAi = false }: { compact?: boolean; place?: string; showAi?: boolean }) {
  const t = useTranslations("audit");
  const locale = useLocale();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ai, setAi] = useState(showAi);
  const [startedAt] = useState(() => Date.now());
  const [aiOffered, setAiOffered] = useState(showAi);
  // ?ai=1 (from the AI SEO section CTA) pre-ticks the AI-visibility checkbox; read without useSearchParams so no Suspense boundary is needed
  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).get("ai") === "1") { setAi(true); setAiOffered(true); }
    } catch {}
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const url = String(fd.get("url") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const whatsapp = String(fd.get("whatsapp") ?? "").trim();
    const errs: Record<string, string> = {};
    if (!/^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(url)) errs.url = t("invalidUrl");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = t("invalidEmail");
    if (whatsapp.replace(/[^\d]/g, "").length < 8) errs.whatsapp = t("invalidPhone");
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("sending");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale, url, email, whatsapp, includeAi: ai, website: String(fd.get("website") ?? ""), place, startedAt }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      track("audit_submit", { place, ai });
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="rounded-[var(--radius-md)] border border-line p-5">
        <div className="text-lg">{t("success")}</div>
        <div className="text-dim text-[14px] mt-1">{t("successSub")}</div>
      </div>
    );
  }

  const idp = `${place}-audit`;
  return (
    <form onSubmit={submit} noValidate className={`grid gap-4 ${compact ? "" : "md:grid-cols-3 md:gap-5 md:items-start"}`}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div>
        <label className="label" htmlFor={`${idp}-url`}>{t("url")}</label>
        <input id={`${idp}-url`} name="url" type="url" inputMode="url" className="field" placeholder={t("urlPlaceholder")} autoComplete="url" aria-invalid={errors.url ? "true" : undefined} aria-describedby={errors.url ? `${idp}-url-err` : undefined} />
        {errors.url ? <p id={`${idp}-url-err`} className="error-text" role="alert">{errors.url}</p> : null}
      </div>
      <div>
        <label className="label" htmlFor={`${idp}-email`}>{t("email")}</label>
        <input id={`${idp}-email`} name="email" type="email" inputMode="email" className="field" autoComplete="email" aria-invalid={errors.email ? "true" : undefined} aria-describedby={errors.email ? `${idp}-email-err` : undefined} />
        {errors.email ? <p id={`${idp}-email-err`} className="error-text" role="alert">{errors.email}</p> : null}
      </div>
      <div>
        <label className="label" htmlFor={`${idp}-wa`}>{t("whatsapp")}</label>
        <input id={`${idp}-wa`} name="whatsapp" type="tel" inputMode="tel" className="field" placeholder={t("whatsappPlaceholder")} autoComplete="tel" aria-invalid={errors.whatsapp ? "true" : undefined} aria-describedby={errors.whatsapp ? `${idp}-wa-err` : undefined} />
        {errors.whatsapp ? <p id={`${idp}-wa-err`} className="error-text" role="alert">{errors.whatsapp}</p> : null}
      </div>
      {aiOffered ? (
        <label className={`flex items-start gap-3 text-[14px] text-dim ${compact ? "" : "md:col-span-3"}`}>
          <input type="checkbox" checked={ai} onChange={(e) => setAi(e.target.checked)} className="mt-1 accent-[#F5F1EA] w-4 h-4" />
          {t("includeAi")}
        </label>
      ) : null}
      <div className={compact ? "" : "md:col-span-3"}>
        <button type="submit" className="btn btn-primary" disabled={state === "sending"}>{state === "sending" ? "…" : t("submit")}</button>
        {state === "error" ? <p className="error-text" role="alert">{t("error")}</p> : null}
      </div>
    </form>
  );
}
