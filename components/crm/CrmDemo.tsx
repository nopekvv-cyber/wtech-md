"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { m, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Search, Bell, ChevronDown, LayoutDashboard, Users, Handshake, Building2, Workflow, Bot, Settings, Calendar, Clock, Sparkles, ArrowRight, Send, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { RevenueChart } from "./RevenueChart";
import { Kanban } from "./Kanban";
import { followups } from "./data";
import { Typewriter } from "@/components/ui/Typewriter";
import { useBrand } from "@/components/preloader/BrandContext";
import { track } from "@/lib/analytics";
import { loadGsap } from "@/lib/gsap";

const NAV = [
  { key: "overview", Icon: LayoutDashboard }, { key: "leads", Icon: Users }, { key: "deals", Icon: Handshake }, { key: "clients", Icon: Building2 },
  { key: "automations", Icon: Workflow }, { key: "ai", Icon: Bot }, { key: "settings", Icon: Settings },
] as const;

export function CrmDemo() {
  const t = useTranslations("crm");
  const { openBooking } = useBrand();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });
  const [anaStep, setAnaStep] = useState(0);
  const months = t("chart.months").split(",");

  // ±4° mouse tilt on the bezel, driven by motion values (no React re-render per move)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 20 });
  useEffect(() => { if (inView && anaStep === 0) setAnaStep(1); }, [inView, anaStep]);
  useEffect(() => {
    // the demo mounts after the first ScrollTrigger measurement and pushes every later section down
    let cancelled = false;
    loadGsap().then(({ ScrollTrigger }) => { if (!cancelled) { ScrollTrigger.sort(); ScrollTrigger.refresh(); } });
    return () => { cancelled = true; };
  }, []);

  const stats = [
    { key: "leads", value: "128", delta: "+24%", up: true, Icon: Users },
    { key: "won", value: "34", delta: "+42%", up: true, Icon: Handshake },
    { key: "revenue", value: "1.2M MDL", delta: "+56%", up: true, Icon: Building2 },
    { key: "response", value: t("stats.responseValue"), delta: "-67%", up: false, Icon: Clock },
  ] as const;

  return (
    <section id="crm" className="section" aria-labelledby="crm-title">
      <div className="container-x">
        <h2 id="crm-title" className="text-[32px] md:text-[44px] max-w-[760px]">{t("title")}</h2>
        <p className="text-dim mt-4 text-lg">{t("sub")}</p>
      </div>
      <div className="container-x mt-12 md:mt-16" style={{ perspective: 1600 }}>
        <m.div
          ref={ref}
          className="monitor"
          style={reduce ? undefined : { rotateX: rx, rotateY: ry }}
          initial={reduce ? false : { scale: 0.92, rotateX: 8, opacity: 0 }}
          animate={inView ? { scale: 1, rotateX: 0, opacity: 1 } : undefined}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onPointerLeave={() => { mx.set(0); my.set(0); }}
        >
          <div className="grid lg:grid-cols-[180px_1fr_280px] min-h-[560px] text-[13px]" data-lenis-prevent>
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col border-r border-line p-4">
              <Image src="/brand/wtech-mark-ui.png" alt="" width={56} height={33} className="object-contain w-14 h-auto mb-6" />
              <nav aria-label="CRM" className="grid gap-1">
                {NAV.map(({ key, Icon }, i) => (
                  <span key={key} className={`flex items-center gap-2.5 px-3 py-2 rounded-[8px] ${i === 0 ? "bg-white/[0.06] text-ink" : "text-dim"}`}>
                    <Icon size={15} aria-hidden="true" /> {t(`sidebar.${key}`)}
                  </span>
                ))}
              </nav>
              <div className="mt-auto pt-6 text-dim text-[11px]">
                <div className="text-ink">wtech.md</div>
                <div>{t("stats.vs")}</div>
              </div>
            </aside>

            {/* Main */}
            <div className="p-4 md:p-5 min-w-0">
              <div className="flex items-center gap-3">
                <div className="crm-panel flex-1 flex items-center gap-2 px-3 h-9 text-dim"><Search size={14} aria-hidden="true" /><span className="truncate">{t("search")}</span></div>
                <span className="text-dim"><Bell size={16} aria-hidden="true" /></span>
                <span className="hidden sm:inline-flex items-center gap-2"><span className="w-7 h-7 rounded-full bg-white/10 grid place-items-center text-[10px]">MD</span>{t("user")}<ChevronDown size={14} aria-hidden="true" /></span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
                {stats.map(({ key, value, delta, up, Icon }, i) => (
                  <m.div
                    key={key}
                    className="crm-panel p-3"
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={inView ? { opacity: 1, y: 0 } : undefined}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
                  >
                    <div className="text-dim flex items-center gap-2 text-[11px]"><Icon size={13} aria-hidden="true" />{t(`stats.${key}`)}</div>
                    <div className="text-[24px] md:text-[26px] leading-tight mt-1 tnum">{value}</div>
                    <div className="text-[11px] mt-1 flex items-center gap-1" style={{ color: up ? "#35E3F0" : "#35E3F0" }}>
                      {up ? <ArrowUpRight size={12} aria-hidden="true" /> : <ArrowDownRight size={12} aria-hidden="true" />}{delta}
                      <span className="text-dim ml-1">{t("stats.vs")}</span>
                    </div>
                  </m.div>
                ))}
              </div>

              <div className="crm-panel p-3 md:p-4 mt-3">
                <div className="flex items-center justify-between text-[12px]"><span>{t("chart.title")}</span><span className="tnum">1.2M MDL <span style={{ color: "#35E3F0" }}>+56%</span></span></div>
                <RevenueChart months={months} draw={inView} />
              </div>

              <div className="mt-4 flex items-center justify-between text-[12px]">
                <span className="font-medium text-[14px]">{t("pipeline.title")}</span>
                <span className="text-dim">{t("pipeline.total")}: <span className="text-ink tnum">87</span> · {t("pipeline.period")}</span>
              </div>
              <div className="mt-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                <m.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.6, delay: 0.5 }}>
                  <Kanban />
                </m.div>
              </div>
              <p className="sr-only">{t("pipeline.dragHint")}</p>
            </div>

            {/* Ana */}
            <aside className="border-t lg:border-t-0 lg:border-l border-line p-4 md:p-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-[14px]"><Sparkles size={14} aria-hidden="true" />{t("ana.panel")}</span>
                <span className="crm-panel px-2 py-1 text-[11px] inline-flex items-center gap-1">{t("ana.name")}<ChevronDown size={12} aria-hidden="true" /></span>
              </div>
              <div className="flex gap-3 mt-4">
                <span className="shrink-0 w-9 h-9 rounded-full grid place-items-center" style={{ background: "conic-gradient(from 180deg, #6E3BFF, #FF7A6B, #35E3F0, #6E3BFF)" }} aria-hidden="true"><span className="w-7 h-7 rounded-full bg-surface" /></span>
                <div className="min-h-[72px]">
                  <div className="font-medium">{t("ana.greeting")}</div>
                  <p className="text-dim text-[12px] mt-1"><Typewriter text={t("ana.summary")} start={anaStep >= 1} speed={14} onDone={() => setAnaStep(2)} /></p>
                </div>
              </div>
              <ul className="crm-panel divide-y divide-white/10 mt-4">
                {[{ Icon: Calendar, k: "t1" }, { Icon: Clock, k: "t2" }, { Icon: Sparkles, k: "t3" }].map(({ Icon, k }, i) => (
                  <m.li key={k} className="flex items-center gap-3 p-3" initial={reduce ? false : { opacity: 0, x: 8 }} animate={anaStep >= 2 ? { opacity: 1, x: 0 } : undefined} transition={{ delay: i * 0.12 }}>
                    <Icon size={15} className="text-dim shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1"><span className="block">{t(`ana.${k}`)}</span><span className="block text-dim text-[11px]">{t(`ana.${k}s`)}</span></span>
                    <ArrowRight size={13} className="text-dim" aria-hidden="true" />
                  </m.li>
                ))}
              </ul>
              <div className="flex items-center justify-between mt-5 text-[12px]"><span className="font-medium text-[13px]">{t("ana.followups")}</span><span className="text-dim inline-flex items-center gap-1">{t("ana.seeAll")}<ArrowRight size={12} aria-hidden="true" /></span></div>
              <ul className="mt-2 divide-y divide-white/10">
                {followups.map((f) => (
                  <li key={f.key} className="py-2.5 flex gap-3 items-start">
                    <span className="text-dim tnum w-10 shrink-0">{f.time}</span>
                    <span className="min-w-0 flex-1"><span className="block">{f.company}</span><span className="block text-dim text-[11px]">{t(`ana.${f.key}`)}</span></span>
                    <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full" style={{ background: f.urgent ? "rgba(110,59,255,0.25)" : "rgba(255,255,255,0.08)" }}>{f.urgent ? t("ana.urgent") : t("ana.normal")}</span>
                  </li>
                ))}
              </ul>
              <div className="crm-panel mt-4 h-10 px-3 flex items-center justify-between text-dim"><span className="inline-flex items-center gap-2"><Sparkles size={13} aria-hidden="true" />{t("ana.input")}</span><Send size={14} aria-hidden="true" /></div>
            </aside>
          </div>
        </m.div>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button type="button" className="btn btn-primary" onClick={() => { track("cta_call_click", { place: "crm" }); openBooking(); }}>{t("cta")}</button>
          <span className="text-dim text-[14px]">{t("pipeline.dragHint")}</span>
        </div>
      </div>
    </section>
  );
}
