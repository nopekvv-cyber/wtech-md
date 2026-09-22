"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";

import { FAQ_KEYS } from "@/lib/faq";
import { BundleShell } from "@/components/ui/BundleShell";

export function Faq() {
  const t = useTranslations("faq");
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="container-x">
        <BundleShell accent="violet" className="p-7 md:p-12 lg:p-14">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4">
              <p className="bundle-kicker">WTECH clarity bundle</p>
              <h2 id="faq-title" className="text-[32px] md:text-[42px] mt-4">{t("title")}</h2>
            </div>
            <div className="lg:col-span-8 border-t border-line divide-y divide-white/10">
              {FAQ_KEYS.map((n, i) => {
                const isOpen = open === i;
                return (
                  <div key={n} className="faq-bundle-row">
                <h3>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-6 py-5 text-left text-[18px] md:text-[20px] font-medium"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${n}`}
                    id={`faq-q-${n}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {t(`q${n}`)}
                    <Plus size={18} className={`shrink-0 text-dim transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} aria-hidden="true" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <m.div
                      id={`faq-a-${n}`}
                      role="region"
                      aria-labelledby={`faq-q-${n}`}
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-dim pb-6 max-w-[640px]">{t(`a${n}`)}</p>
                    </m.div>
                  ) : null}
                </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </BundleShell>
      </div>
    </section>
  );
}
