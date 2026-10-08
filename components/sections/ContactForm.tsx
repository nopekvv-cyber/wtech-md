"use client";

import { useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { track } from "@/lib/analytics";
import {ContactPreference} from "@/components/privacy/ContactPreference";
import { FormConsent } from "@/components/privacy/FormConsent";

const OPTIONS = ["o1", "o2", "o3", "o4", "o5"] as const;

/** Two-step micro-commitment form. Step 1: one tappable question. Step 2: contact. Progress line uses the gradient. */
export function ContactForm() {
  const t = useTranslations("contact");
  const tConsent = useTranslations("consent");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [draft,setDraft]=useState<Record<string,string>>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [choice, setChoice] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [channel,setChannel]=useState("phone");
  const idempotency=useRef<string>("");
  const [startedAt] = useState(() => Date.now());

  function choose(k: string) {
    setChoice(k);
    track("form_step1", { choice: k });
    setStep(2);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(state==="sending"||state==="sent")return;
    if(!idempotency.current)idempotency.current=crypto.randomUUID();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const errs: Record<string, string> = {};
    if (name.length < 2) errs.name = t("invalidName");
    if (channel!=="email"&&phone.replace(/[^\d]/g, "").length < 8) errs.phone = t("invalidPhone");
    if(channel==="email"&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(fd.get("email")||"")))errs.email=t("invalidEmail");
    if (!privacyAccepted) errs.privacy = tConsent("requiredError");
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = errs.name ? "ct-name" : errs.phone ? "ct-phone" : errs.email ? "ct-email" : "contact-consent-privacy";
      document.getElementById(first)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "contact", locale, name, phone:channel==="email"?"":phone,channel,idempotencyKey:idempotency.current,source:location.pathname,
          email: String(fd.get("email") ?? ""), company: String(fd.get("company") ?? ""), message: String(fd.get("message") ?? ""),
          interest: choice ? t(choice as "o1") : "", website: String(fd.get("website") ?? ""), startedAt,
          privacyAccepted, marketingConsent,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      track("form_submit", { form: "contact", choice });
    } catch {
      setState("error");
    }
  }

  const progress = state === "sent" ? 1 : step === 1 ? 0.5 : 0.85;

  return (
    <div>
      <div className="flex items-center justify-between text-[13px] text-dim">
        <span>{t("stepOf", { step })}</span>
      </div>
      <div className="relative h-px bg-white/10 mt-3 mb-8 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-y-0 left-0" style={{ width: `${progress * 100}%`, background: "var(--grad)", transition: "width 500ms cubic-bezier(0.16,1,0.3,1)" }} />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {state === "sent" ? (
          <m.div key="sent" role="status" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[var(--radius-md)] border border-line p-6">
            <div className="text-[22px]">{t("success")}</div>
            <p className="text-dim mt-2">{t("successSub")}</p>
          </m.div>
        ) : step === 1 ? (
          <m.fieldset key="s1" initial={reduce ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -12 }} transition={{ duration: 0.25 }} className="border-0 p-0 m-0">
            <legend className="text-[24px] md:text-[28px] mb-6">{t("step1")}</legend>
            <div className="grid gap-2">
              {OPTIONS.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`text-left min-h-[56px] px-5 rounded-[var(--radius-md)] border transition-colors ${choice === k ? "border-ink bg-white/[0.06]" : "border-line hover:border-white/30"}`}
                  onClick={() => choose(k)}
                >
                  {t(k)}
                </button>
              ))}
            </div>
          </m.fieldset>
        ) : (
          <m.form key="s2" onChange={e=>{const fd=new FormData(e.currentTarget);setDraft(old=>({...old,...Object.fromEntries([...fd.entries()].filter(([,v])=>typeof v==="string") as [string,string][])}))}} onSubmit={submit} noValidate initial={reduce ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: 12 }} transition={{ duration: 0.25 }} className="grid gap-5">
            <div className="text-[24px] md:text-[28px]">{t("step2")}</div>
            <ContactPreference id="contact" value={channel} onChange={setChannel}/>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label" htmlFor="ct-name">{t("name")}</label>
                <input id="ct-name" name="name" defaultValue={draft.name||""} className="field" autoComplete="name" required aria-required="true" aria-invalid={errors.name ? "true" : undefined} aria-describedby={errors.name ? "ct-name-err" : undefined} />
                {errors.name ? <p id="ct-name-err" className="error-text" role="alert">{errors.name}</p> : null}
              </div>
              <div>
                <label className="label" htmlFor="ct-phone">{channel==="whatsapp"?"WhatsApp":t("phone")}</label>
                <input disabled={channel==="email"} id="ct-phone" name="phone" defaultValue={draft.phone||""} type="tel" inputMode="tel" className="field" autoComplete="tel" required aria-required="true" aria-invalid={errors.phone ? "true" : undefined} aria-describedby={errors.phone ? "ct-phone-err" : undefined} />
                {errors.phone ? <p id="ct-phone-err" className="error-text" role="alert">{errors.phone}</p> : null}
              </div>
              <div>
                <label className="label" htmlFor="ct-email">{t("email")}</label>
                <input required={channel==="email"} aria-invalid={errors.email?true:undefined} id="ct-email" name="email" defaultValue={draft.email||""} type="email" inputMode="email" className="field" autoComplete="email" />
              </div>
              <div>
                <label className="label" htmlFor="ct-company">{t("company")}</label>
                <input id="ct-company" name="company" defaultValue={draft.company||""} className="field" autoComplete="organization" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="ct-message">{t("message")}</label>
              <textarea id="ct-message" name="message" defaultValue={draft.message||""} className="field min-h-[110px]" rows={3} />
            </div>
            {errors.email?<p className="error-text" role="alert">{errors.email}</p>:null}
            <FormConsent id="contact-consent" privacyAccepted={privacyAccepted} marketingConsent={marketingConsent} error={errors.privacy || undefined} onPrivacyChange={(value) => { setPrivacyAccepted(value); if (value) setErrors((old) => ({ ...old, privacy: "" })); }} onMarketingChange={setMarketingConsent} />
            {state === "error" ? <p className="error-text" role="alert">{t("error")}</p> : null}
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn btn-primary" disabled={state === "sending"}>{state === "sending" ? "…" : t("submit")}</button>
              <button type="button" className="text-dim hover:text-ink text-[15px]" onClick={() => setStep(1)}>{t("back")}</button>
            </div>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
