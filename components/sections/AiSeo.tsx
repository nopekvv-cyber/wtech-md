"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { m, useInView, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowDown, Minus, Sparkles, Search, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Typewriter } from "@/components/ui/Typewriter";
import { BundleShell } from "@/components/ui/BundleShell";

const ROWS = [
  { k: "k1", pos: 2, delta: 5 },
  { k: "k2", pos: 4, delta: 3 },
  { k: "k3", pos: 1, delta: 2 },
  { k: "k4", pos: 6, delta: 0 },
  { k: "k5", pos: 3, delta: 9 },
] as const;
const SPARK = [22, 25, 24, 31, 38, 36, 44, 52, 58, 57, 66, 74, 81];

/** Simulated AI answer (typed on scroll-in) + ranking mini-dashboard in the CRM's visual language. Demo data. */
export function AiSeo() {
  const t = useTranslations("seo");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [phase, setPhase] = useState(0);
  const w = 260, h = 60;
  const pts = SPARK.map((v, i) => `${(i / (SPARK.length - 1)) * w},${h - (v / 100) * h}`).join(" ");

  return (
    <section id="ai-seo" className="section" aria-labelledby="seo-title">
      <div className="container-x">
        <BundleShell accent="cyan" className="p-6 md:p-10 lg:p-14">
          <p className="bundle-kicker">WTECH visibility bundle</p>
          <h2 id="seo-title" className="text-[32px] md:text-[46px] max-w-[760px] mt-4">{t("title")}</h2>
          <p className="text-dim mt-4 text-lg max-w-[620px]">{t("sub")}</p>
          <p className="mt-4 text-[12px] uppercase tracking-[0.14em] text-dim">{t("demoLabel")}</p>
          <div ref={ref} className="mt-14 md:mt-20 grid lg:grid-cols-2 gap-6">
            {/* AI answer panel */}
            <div className="relative crm-panel rounded-[var(--radius-lg)] p-6 md:p-8 overflow-hidden min-h-[380px]">
          <Image src="/media/seo-bg-1.jpg" alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover opacity-70 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 text-dim text-[13px]"><Search size={14} aria-hidden="true" />{t("question")}</div>
            <div className="mt-6 flex gap-3">
              <span className="shrink-0 w-8 h-8 rounded-full grid place-items-center bg-white/[0.06]"><Sparkles size={14} aria-hidden="true" /></span>
              <p className="text-[16px] md:text-[17px] leading-relaxed max-w-[520px]">
                <Typewriter text={t("answerIntro")} start={inView} speed={12} onDone={() => setPhase(1)} />
                {phase >= 1 ? <span className="font-medium">wtech.md</span> : null}
                <Typewriter text={t("answerBody")} start={phase >= 1} speed={10} onDone={() => setPhase(2)} />
              </p>
            </div>
            <m.div className="mt-8 pl-11 text-[12px] text-dim" initial={reduce ? false : { opacity: 0 }} animate={phase >= 2 ? { opacity: 1 } : undefined}>
              {t("sources")}: wtech.md · wtech.md/despre · wtech.md/blog
            </m.div>
          </div>
            </div>

            {/* Ranking mini-dashboard */}
            <div className="relative crm-panel rounded-[var(--radius-lg)] p-6 md:p-8 overflow-hidden">
          <Image src="/media/seo-bg-2.jpg" alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover opacity-60 pointer-events-none" />
          <div className="relative">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="text-[14px]">{t("ranking.title")}</div>
                <div className="text-dim text-[12px] mt-1">{t("ranking.trend")}</div>
              </div>
              <div className="text-right">
                <div className="text-dim text-[12px]">{t("ranking.visibility")}</div>
                <div className="grad-underline inline-block text-[34px] leading-none mt-1 tnum">81<span className="text-dim text-[16px]">/100</span></div>
              </div>
            </div>
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[60px] mt-6" aria-hidden="true">
              <m.polyline points={pts} fill="none" stroke="rgba(245,241,234,0.7)" strokeWidth="1.5" initial={reduce ? false : { pathLength: 0 }} animate={inView ? { pathLength: 1 } : undefined} transition={{ duration: 1.4, ease: "easeOut" }} />
            </svg>
            <table className="w-full mt-6 text-[13px]">
              <thead className="text-dim text-[11px]">
                <tr><th className="text-left font-normal pb-2">{t("ranking.keyword")}</th><th className="text-right font-normal pb-2">{t("ranking.position")}</th></tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {ROWS.map((r, i) => (
                  <m.tr key={r.k} initial={reduce ? false : { opacity: 0, y: 6 }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 0.3 + i * 0.08 }}>
                    <td className="py-2.5 pr-4">{t(`ranking.${r.k}`)}</td>
                    <td className="py-2.5 text-right tnum">
                      <span className="inline-flex items-center gap-2 justify-end">
                        {r.delta > 0 ? <ArrowUp size={12} style={{ color: "#35E3F0" }} aria-label="+" /> : r.delta < 0 ? <ArrowDown size={12} style={{ color: "#FF7A6B" }} aria-label="-" /> : <Minus size={12} className="text-dim" aria-hidden="true" />}
                        <span className="text-dim text-[11px] w-6 text-right">{r.delta > 0 ? `+${r.delta}` : r.delta === 0 ? "" : r.delta}</span>
                        <span className="w-6 text-right">#{r.pos}</span>
                      </span>
                    </td>
                  </m.tr>
                ))}
              </tbody>
            </table>
          </div>
            </div>
          </div>
          <div className="mt-12 md:mt-16">
            <ul className="divide-y divide-white/10 border-t border-line max-w-[760px]">
              {(["l1", "l2", "l3"] as const).map((k) => <li key={k} className="py-5 text-[17px]">{t(k)}</li>)}
            </ul>
            <Link href={{ pathname: "/audit", query: { ai: "1" } }} className="btn btn-primary mt-8">{t("cta")} <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </BundleShell>
      </div>
    </section>
  );
}
