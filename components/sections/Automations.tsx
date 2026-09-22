"use client";

import { useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { loadGsap } from "@/lib/gsap";
import { useBrand } from "@/components/preloader/BrandContext";
import { track } from "@/lib/analytics";


const NODES = ["lead", "crm", "offer", "whatsapp", "invoice", "report"] as const;
const W = 1600, H = 360;
const XS = NODES.map((_, i) => 120 + i * ((W - 240) / (NODES.length - 1)));
const path = XS.map((x, i) => (i === 0 ? `M ${x} ${H / 2}` : `C ${(XS[i - 1] ?? x) + 120} ${H / 2 + (i % 2 ? -70 : 70)}, ${x - 120} ${H / 2 + (i % 2 ? -70 : 70)}, ${x} ${H / 2}`)).join(" ");

/** Horizontal pinned strip. The gradient path draws with scroll; the Higgsfield pulse texture is masked into it. */
export function Automations() {
  const t = useTranslations("automations");
  const { openBooking } = useBrand();
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLElement>(null);
  const track_ = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    if (reduce || !wrap.current || !track_.current || !pathRef.current) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    let cleanup: (() => void) | undefined;
    let disposed = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
    if (disposed || !pathRef.current || !wrap.current || !track_.current) return;
    const ctx = gsap.context(() => {
      const len = pathRef.current!.getTotalLength();
      gsap.set(pathRef.current, { strokeDasharray: len, strokeDashoffset: len });
      if (mq.matches) {
        const distance = () => track_.current!.scrollWidth - window.innerWidth;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: wrap.current, start: "top top", end: () => `+=${distance() + 400}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1, refreshPriority: 4 },
        });
        tl.to(track_.current, { x: () => -distance(), ease: "none" }, 0)
          .to(pathRef.current, { strokeDashoffset: 0, ease: "none" }, 0)
          .fromTo(".auto-node", { opacity: 0.35, scale: 0.9 }, { opacity: 1, scale: 1, stagger: 0.12, ease: "none" }, 0.05);
      }
    }, wrap);
    const rid = requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
    cleanup = () => { cancelAnimationFrame(rid); ctx.revert(); };
    });
    return () => { disposed = true; cleanup?.(); };
  }, [reduce]);

  return (
    <section id="automatizari" ref={wrap} className="section overflow-hidden automation-bundle-stage" aria-labelledby="auto-title">
      <div className="container-x">
        <p className="bundle-kicker">WTECH automation bundle</p>
        <h2 id="auto-title" className="text-[32px] md:text-[46px] max-w-[760px] mt-4">{t("title")}</h2>
        <p className="text-dim mt-4 text-lg">{t("sub")}</p>
      </div>
      {/* phones and tablets: a vertical flow, one node per row, gradient spine */}
      <ol className="lg:hidden container-x mt-12 relative" aria-label={NODES.map((n) => t(`nodes.${n}`)).join(" → ")}>
        <span className="absolute left-[calc(20px+17px)] top-4 bottom-4 w-px" style={{ background: "var(--grad)", opacity: 0.7 }} aria-hidden="true" />
        {NODES.map((n, i) => (
          <li key={n} className="auto-mobile-node relative flex items-center gap-5 py-4 px-4">
            <span className="relative z-10 w-9 h-9 rounded-full grid place-items-center shrink-0" style={{ background: "#0A0A0B", border: "1.5px solid rgba(255,255,255,0.18)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-ink" />
            </span>
            <span className="text-[20px]">{t(`nodes.${n}`)}</span>
            {i < NODES.length - 1 ? null : null}
          </li>
        ))}
      </ol>
      <div ref={track_} className="mt-6 lg:mt-20 lg:flex lg:items-center lg:w-max">
        <div className="hidden lg:block lg:w-[1600px] shrink-0">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-[1600px] h-auto" role="img" aria-label={NODES.map((n) => t(`nodes.${n}`)).join(" → ")}>
            <defs>
              <linearGradient id="auto-grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#6E3BFF" /><stop offset="0.5" stopColor="#FF7A6B" /><stop offset="1" stopColor="#35E3F0" />
              </linearGradient>
              <mask id="auto-mask"><path d={path} stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" /></mask>
            </defs>
            <path d={path} stroke="rgba(255,255,255,0.10)" strokeWidth="2" fill="none" />
            {/* pulse texture masked into the path (moves under reduced motion? no: LoopVideo falls back to a still) */}
            <foreignObject x="0" y="0" width={W} height={H} mask="url(#auto-mask)" style={{ opacity: 0.9 }}>
              <video muted loop playsInline autoPlay preload="none" poster="/media/pulse.jpg" width={W} height={H} className="w-full h-full object-cover" aria-hidden="true" style={{ display: reduce ? "none" : "block" }}>
                <source src="/media/pulse.webm" type="video/webm" /><source src="/media/pulse.mp4" type="video/mp4" />
              </video>
            </foreignObject>
            <path ref={pathRef} d={path} stroke="url(#auto-grad)" strokeWidth="3" fill="none" strokeLinecap="round" style={reduce ? undefined : { strokeDasharray: 4000, strokeDashoffset: 4000 }} />
            {NODES.map((n, i) => (
              <g key={n} className="auto-node" style={{ transformOrigin: `${XS[i]}px ${H / 2}px` }}>
                <circle cx={XS[i]} cy={H / 2} r="34" fill="#0A0A0B" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
                <circle cx={XS[i]} cy={H / 2} r="5" fill="#F5F1EA" />
                <text x={XS[i]} y={H / 2 + 72} textAnchor="middle" fill="#F5F1EA" fontSize="22" fontFamily="inherit" fontWeight="500" letterSpacing="-0.02em">{t(`nodes.${n}`)}</text>
              </g>
            ))}
          </svg>
        </div>
        <div className="auto-summary-bundle container-x lg:w-[640px] lg:shrink-0 lg:pl-16 mt-4 lg:mt-0">
          <ul className="divide-y divide-white/10 border-t border-line">
            {(["l1", "l2", "l3"] as const).map((k) => (
              <li key={k} className="py-5 text-[17px] max-w-[560px]">{t(k)}</li>
            ))}
          </ul>
          <button type="button" className="btn btn-primary mt-8" onClick={() => { track("cta_call_click", { place: "automations" }); openBooking(); }}>{t("cta")}</button>
        </div>
      </div>
    </section>
  );
}
