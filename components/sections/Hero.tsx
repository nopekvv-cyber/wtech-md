"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { m, useReducedMotion } from "framer-motion";
import { useBrand } from "@/components/preloader/BrandContext";
import { serviceKeys } from "@/lib/services";
import { track } from "@/lib/analytics";

export function Hero() {
  const t = useTranslations("hero");
  const { openBooking } = useBrand();
  const reduce = useReducedMotion();
  const textRef = useRef<HTMLDivElement>(null);

  // ?v=b swaps the headline for the benefit-led variant, read after mount so the H1 stays in the static HTML (it is the LCP).
  const [variantB, setVariantB] = useState(false);
  useEffect(() => {
    try { setVariantB(new URLSearchParams(window.location.search).get("v") === "b"); } catch {}
    if (variantB) track("hero_variant", { v: "b" });
  }, [variantB]);

  // No scroll-driven motion between the hero and the sections below (removed after review).

  const facts = [t("facts.city"), t("facts.reply"), t("facts.price")];
  const h1 = variantB ? t("h1b") : t("h1");
  const visible = {
    initial: false as const,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0 },
  };
  return (
    <section id="hero" className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-bg">
      <div className="hero-art" aria-hidden="true">
        <div className="hero-art__halo" />
        <m.div
          className="hero-art__orbit"
          animate={reduce ? undefined : {
            y: [0, -12, 0],
            rotateX: [2.5, -2, 2.5],
            rotateY: [-7, 8, -7],
            rotateZ: [-0.7, 0.7, -0.7],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-hero
            src="/brand/wtech-hero-mark-v2.webp"
            alt=""
            width={1247}
            height={738}
            fetchPriority="high"
            decoding="async"
            className="hero-art__mark"
            draggable={false}
          />
          {!reduce ? <span className="hero-art__glint" /> : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/wtech-hero-mark-v2.webp" alt="" width={1247} height={738} className="hero-art__reflection" draggable={false} />
        </m.div>
      </div>

      <div className="container-x relative flex-1 grid lg:grid-cols-12 items-start lg:items-center pb-10 lg:pb-0">
        <div ref={textRef} className="pt-[calc(69.5vw+28px)] lg:pt-0 lg:col-span-6 max-w-[540px]">
          <h1 className="text-[clamp(34px,4.6vw,58px)] leading-[1.04]">
            <m.span className="block" {...visible}>{h1}</m.span>
          </h1>
          <m.p className="text-dim text-[16px] md:text-[19px] mt-4 md:mt-6 max-w-[520px] text-balance" {...visible}>{t("sub")}</m.p>
          <m.div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3" {...visible}>
            <button type="button" className="btn btn-primary" onClick={() => { track("cta_call_click", { place: "hero" }); openBooking(); }}>
              {t("primary")}
            </button>
            <a href="#crm" className="btn btn-ghost">{t("ghost")}</a>
          </m.div>
          <m.div {...visible}>
            <p className="text-dim text-[14px] mt-4">{t("risk")}</p>
            <ul className="mt-5 md:mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[13px] md:text-[14px] text-dim">
              {facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </m.div>
        </div>
      </div>

      {/* fold line */}
      <div className="container-x relative pb-6 lg:pb-8 hidden sm:block">
        <ul className="hairline pt-5 flex flex-wrap gap-x-8 gap-y-2 text-[14px] text-dim">
          {serviceKeys.map((k) => (
            <li key={k}>
              <a href={`#svc-${k}`} className="hover:text-ink transition-colors">{t(`fold.${k}`)}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
