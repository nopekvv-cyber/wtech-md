"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useMotionValue, useSpring, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useBrand } from "@/components/preloader/BrandContext";
import { track } from "@/lib/analytics";
import { formatNumber } from "@/components/crm/data";

const RECOVERY = 0.6; // share of missed leads an AI employee recovers by answering in minutes (assumption, stated in the hint)

export function RoiCalculator() {
  const t = useTranslations("ai.roi");
  const tp = useTranslations("pricing");
  const currency = tp("currency");
  const { openBooking } = useBrand();
  const reduce = useReducedMotion();
  const [leads, setLeads] = useState(120);
  const [lost, setLost] = useState(35);
  const [value, setValue] = useState(3500);
  const used = useRef(false);
  const target = Math.round(leads * (lost / 100) * RECOVERY * value);
  const mv = useMotionValue(target);
  const spring = useSpring(mv, { stiffness: 80, damping: 20 });
  const [shown, setShown] = useState(target);
  useMotionValueEvent(spring, "change", (v) => setShown(Math.round(v)));
  useEffect(() => { if (reduce) { mv.jump(target); setShown(target); } else mv.set(target); }, [target, mv, reduce]);

  const onUse = () => { if (!used.current) { used.current = true; track("roi_calc_used"); } };
  const fmt = (n: number) => formatNumber(n, currency);

  return (
    <div className="grid lg:grid-cols-12 gap-10 items-end">
      <form className="lg:col-span-7 grid gap-7" onSubmit={(e) => e.preventDefault()} aria-label={t("title")}>
        <h3 className="text-[24px] md:text-[28px]">{t("title")}</h3>
        <Range id="roi-leads" label={t("leads")} value={leads} min={10} max={1000} step={10} onChange={(v) => { setLeads(v); onUse(); }} display={String(leads)} />
        <Range id="roi-lost" label={t("lost")} value={lost} min={0} max={90} step={5} onChange={(v) => { setLost(v); onUse(); }} display={`${lost}%`} />
        <Range id="roi-value" label={t("value")} value={value} min={200} max={50000} step={100} onChange={(v) => { setValue(v); onUse(); }} display={`${fmt(value)} ${currency}`} />
      </form>
      <div className="lg:col-span-5">
        <div className="text-dim text-[14px]">{t("result")}</div>
        <div className="mt-2 inline-block">
          <span className="grad-underline text-[48px] md:text-[64px] leading-none font-medium tracking-[-0.03em] tnum" aria-live="polite">{fmt(shown)}</span>
          <span className="text-dim ml-2 text-lg">{currency}</span>
        </div>
        <div className="text-dim text-[14px] mt-5 tnum">{fmt(target * 12)} {currency} {t("perYear")}</div>
        <p className="text-dim text-[13px] mt-3 max-w-[380px]">{t("hint")}</p>
        <button type="button" className="btn btn-primary mt-7" onClick={() => { track("cta_call_click", { place: "roi" }); openBooking(); }}>{t("cta")}</button>
      </div>
    </div>
  );
}

function Range({ id, label, value, min, max, step, onChange, display }: { id: string; label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="label mb-0">{label}</label>
        <output htmlFor={id} className="tnum text-[18px]">{display}</output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-3 h-11 accent-[#F5F1EA] cursor-pointer"
      />
    </div>
  );
}
