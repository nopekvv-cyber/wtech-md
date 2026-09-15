"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { m, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { useBrand } from "@/components/preloader/BrandContext";
import { whatsappHref } from "@/lib/site";
import { useSite } from "@/components/site/SiteContext";
import { track } from "@/lib/analytics";
import type { Locale } from "@/i18n/routing";

/** Appears once the hero has scrolled out. Desktop: the nav turns solid and its top-right pill is the sticky CTA. Mobile: bottom bar (Apel + WhatsApp). */
export function StickyCta() {
  const t = useTranslations("sticky");
  const locale = useLocale() as Locale;
  const { contact } = useSite();
  const { openBooking } = useBrand();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) { setShow(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e) setShow(!e.isIntersecting); }, { threshold: 0, rootMargin: "-80px 0px 0px 0px" });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // let the messenger pill sit above the bar so the two never overlap
  useEffect(() => {
    document.documentElement.classList.toggle("has-sticky", show);
    return () => document.documentElement.classList.remove("has-sticky");
  }, [show]);

  return (
    <AnimatePresence>
      {show ? (
        <>
          <m.div
            key="mobile"
            className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-line bg-black/85 backdrop-blur-xl"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-2 gap-2 p-2">
              <button type="button" className="btn btn-primary" onClick={() => { track("cta_call_click", { place: "sticky-mobile" }); openBooking(); }}>
                <Phone size={16} aria-hidden="true" /> {t("call")}
              </button>
              <a href={whatsappHref(locale, contact.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" onClick={() => track("cta_whatsapp_click", { place: "sticky-mobile" })}>
                <MessageCircle size={16} aria-hidden="true" /> {t("whatsapp")}
              </a>
            </div>
          </m.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
