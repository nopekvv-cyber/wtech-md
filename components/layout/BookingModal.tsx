"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { m, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useBrand } from "@/components/preloader/BrandContext";
import { calUrl } from "@/lib/site";
import { track } from "@/lib/analytics";

/**
 * Primary CTA target. If NEXT_PUBLIC_CAL_URL is set, embeds the self-hosted Cal.com page.
 * Otherwise a 3-field fallback form writes to Telegram via /api/lead.
 */
export function BookingModal() {
  const { bookingOpen, closeBooking } = useBrand();
  const t = useTranslations("booking");
  const tc = useTranslations("contact");
  const locale = useLocale();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    if (!bookingOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeBooking();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bookingOpen, closeBooking]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    if (name.length < 2) return setErr(tc("invalidName"));
    if (phone.replace(/[^\d]/g, "").length < 8) return setErr(tc("invalidPhone"));
    setErr(null);
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "call", locale, name, phone, when: String(fd.get("when") ?? ""), website: String(fd.get("website") ?? ""), startedAt }),
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
        <m.div className="fixed inset-0 z-[70] grid place-items-center bg-black/75 backdrop-blur-sm p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeBooking}>
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            className="relative w-full max-w-[720px] bg-surface border border-line rounded-[var(--radius-lg)] overflow-hidden"
            initial={{ y: 16, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 16, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="absolute top-3 right-3 w-11 h-11 grid place-items-center text-dim hover:text-ink z-10" aria-label={t("close")} onClick={closeBooking}>
              <X size={18} />
            </button>
            <div className="p-6 md:p-8">
              <h2 id="booking-title" className="text-[26px] md:text-[30px] pr-10">{t("title")}</h2>
              <p className="text-dim mt-2">{t("sub")}</p>
            </div>
            {calUrl ? (
              <iframe
                title={t("title")}
                src={`${calUrl}?embed=true&theme=dark&layout=month_view`}
                className="w-full h-[560px] border-0 bg-black"
                loading="lazy"
              />
            ) : (
              <form onSubmit={submit} className="px-6 md:px-8 pb-8 grid gap-4" noValidate>
                <p className="text-dim text-[14px]">{t("fallback")}</p>
                {state === "sent" ? (
                  <div role="status" className="rounded-[var(--radius-md)] border border-line p-5">
                    <div className="text-lg">{tc("success")}</div>
                  </div>
                ) : (
                  <>
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                    <div>
                      <label className="label" htmlFor="bk-name">{tc("name")}</label>
                      <input id="bk-name" name="name" className="field" autoComplete="name" required />
                    </div>
                    <div>
                      <label className="label" htmlFor="bk-phone">{tc("phone")}</label>
                      <input id="bk-phone" name="phone" type="tel" inputMode="tel" className="field" autoComplete="tel" required aria-invalid={err ? "true" : undefined} />
                    </div>
                    <div>
                      <label className="label" htmlFor="bk-when">{t("when")}</label>
                      <input id="bk-when" name="when" className="field" placeholder="Marți, 14:00" />
                    </div>
                    {err ? <p className="error-text" role="alert">{err}</p> : null}
                    {state === "error" ? <p className="error-text" role="alert">{tc("error")}</p> : null}
                    <button type="submit" className="btn btn-primary justify-self-start" disabled={state === "sending"}>
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
