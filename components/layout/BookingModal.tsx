"use client";

import { useState, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { m, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useBrand } from "@/components/preloader/BrandContext";
import { calUrl } from "@/lib/site";
import { track } from "@/lib/analytics";
import { useConsent } from "@/components/privacy/ConsentProvider";
import { ContactPreference } from "@/components/privacy/ContactPreference";
import { FormConsent } from "@/components/privacy/FormConsent";
import { useModalFocus } from "@/components/accessibility/useModalFocus";

/**
 * Primary CTA target. If NEXT_PUBLIC_CAL_URL is set, embeds the self-hosted Cal.com page.
 * Otherwise a 3-field fallback form writes to Telegram via /api/lead.
 */
export function BookingModal() {
  const { bookingOpen, bookingContext, closeBooking } = useBrand();
  const t = useTranslations("booking");
  const tc = useTranslations("contact");
  const tConsent = useTranslations("consent");
  const locale = useLocale();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [err, setErr] = useState<string | null>(null);
  const [channel, setChannel] = useState("phone");
  const idempotency = useRef<string>("");
  const [startedAt] = useState(() => Date.now());
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const { external, openSettings } = useConsent();
  const modalRef = useModalFocus(bookingOpen, closeBooking);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending" || state === "sent") return;
    if (!idempotency.current) idempotency.current = crypto.randomUUID();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const contact = String(fd.get("phone") ?? "").trim();
    const phone = channel === "email" ? "" : contact;
    const email = channel === "email" ? contact : "";
    if (name.length < 2) {
      setErr(tc("invalidName"));
      document.getElementById("bk-name")?.focus();
      return;
    }
    if (channel !== "email" && phone.replace(/[^\d]/g, "").length < 8) {
      setErr(tc("invalidPhone"));
      document.getElementById("bk-phone")?.focus();
      return;
    }
    if (channel === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr(tc("invalidEmail"));
      return;
    }
    if (!privacyAccepted) {
      setErr(tConsent("requiredError"));
      document.getElementById("booking-consent-privacy")?.focus();
      return;
    }
    setErr(null);
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "call",
          locale,
          name,
          phone,
          email,
          channel,
          idempotencyKey: idempotency.current,
          source: location.pathname,
          message: String(fd.get("message") || ""),
          when: String(fd.get("when") ?? ""),
          website: String(fd.get("website") ?? ""),
          startedAt,
          privacyAccepted,
          marketingConsent,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      track("form_submit", { form: "booking" });
    } catch {
      setState("error");
    }
  }

  return (
    <AnimatePresence>
      {bookingOpen ? (
        <m.div
          className="fixed inset-0 z-[120] grid place-items-center bg-black/75 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeBooking}
        >
          <m.div
            ref={modalRef}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="relative w-full max-w-[720px] bg-surface border border-line rounded-[var(--radius-lg)] overflow-hidden"
            initial={{ y: 16, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 16, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 w-11 h-11 grid place-items-center text-dim hover:text-ink z-10"
              aria-label={t("close")}
              onClick={closeBooking}
            >
              <X size={18} />
            </button>
            <div className="p-6 md:p-8">
              <h2
                id="booking-title"
                className="text-[26px] md:text-[30px] pr-10"
              >
                {t("title")}
              </h2>
              <p className="text-dim mt-2">{t("sub")}</p>
            </div>
            {calUrl && external ? (
              <iframe
                title={t("title")}
                src={`${calUrl}?embed=true&theme=dark&layout=month_view`}
                className="w-full h-[560px] border-0 bg-black"
                loading="lazy"
              />
            ) : (
              <form
                onSubmit={submit}
                className="px-6 md:px-8 pb-8 grid gap-4"
                noValidate
              >
                {calUrl ? (
                  <div className="rounded-[var(--radius-md)] border border-line p-4 text-[14px] text-dim">
                    <p>{t("externalBlocked")}</p>
                    <button
                      type="button"
                      className="link-inline mt-3"
                      onClick={openSettings}
                    >
                      {t("openCookieSettings")}
                    </button>
                  </div>
                ) : null}
                <p className="text-dim text-[14px]">{channel==="email"?t("emailFallback"):channel==="whatsapp"?t("whatsappFallback"):t("fallback")}</p>
                {state === "sent" ? (
                  <div
                    role="status"
                    className="rounded-[var(--radius-md)] border border-line p-5"
                  >
                    <div className="text-lg">{tc("success")}</div>
                    <p className="text-dim mt-2">{tc("successSub")}</p>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      aria-hidden="true"
                    />
                    <div>
                      <label className="label" htmlFor="bk-name">
                        {tc("name")}
                      </label>
                      <input
                        id="bk-name"
                        name="name"
                        className="field"
                        autoComplete="name"
                        required
                        aria-required="true"
                        aria-invalid={
                          err === tc("invalidName") ? "true" : undefined
                        }
                        aria-describedby={
                          err === tc("invalidName")
                            ? "booking-error"
                            : undefined
                        }
                      />
                    </div>
                    <ContactPreference
                      id="booking"
                      value={channel}
                      onChange={setChannel}
                    />
                    <div>
                      <label className="label" htmlFor="bk-phone">
                        {channel === "email"
                          ? "Email"
                          : channel === "whatsapp"
                            ? "WhatsApp"
                            : tc("phone")}
                      </label>
                      <input
                        id="bk-phone"
                        name="phone"
                        type={channel === "email" ? "email" : "tel"}
                        inputMode={channel === "email" ? "email" : "tel"}
                        className="field"
                        autoComplete="tel"
                        required
                        aria-required="true"
                        aria-invalid={
                          err === tc("invalidPhone") ? "true" : undefined
                        }
                        aria-describedby={
                          err === tc("invalidPhone")
                            ? "booking-error"
                            : undefined
                        }
                      />
                    </div>
                    {bookingContext.message ? (
                      <div>
                        <label className="label" htmlFor="bk-context">
                          {tc("message")}
                        </label>
                        <textarea
                          id="bk-context"
                          name="message"
                          className="field"
                          defaultValue={bookingContext.message}
                          rows={3}
                          maxLength={2000}
                        />
                      </div>
                    ) : null}
                    <FormConsent
                      id="booking-consent"
                      privacyAccepted={privacyAccepted}
                      marketingConsent={marketingConsent}
                      error={
                        !privacyAccepted && err === tConsent("requiredError")
                          ? err
                          : undefined
                      }
                      onPrivacyChange={(value) => {
                        setPrivacyAccepted(value);
                        if (value && err === tConsent("requiredError"))
                          setErr(null);
                      }}
                      onMarketingChange={setMarketingConsent}
                    />
                    <div>
                      <label className="label" htmlFor="bk-when">
                        {t("contactWhen")}
                      </label>
                      <input
                        id="bk-when"
                        name="when"
                        className="field"
                        placeholder="Marți, 14:00"
                      />
                    </div>
                    {err ? (
                      <p id="booking-error" className="error-text" role="alert">
                        {err}
                      </p>
                    ) : null}
                    {state === "error" ? (
                      <p className="error-text" role="alert">
                        {tc("error")}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      className="btn btn-primary justify-self-start"
                      disabled={state === "sending"}
                    >
                      {state === "sending" ? tc("submit") + "…" : tc("submit")}
                    </button>
                  </>
                )}
              </form>
            )}
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
