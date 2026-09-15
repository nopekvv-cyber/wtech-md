"use client";

import { useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { loadGsap } from "@/lib/gsap";
import { PhoneChat } from "@/components/phones/PhoneChat";
import { PhoneAutomations } from "@/components/phones/PhoneAutomations";
import { RoiCalculator } from "./RoiCalculator";


export function AiEmployees() {
  const t = useTranslations("ai");
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);

  // Parallax: the two phones drift at different speeds
  useLayoutEffect(() => {
    if (reduce || !wrap.current) return;
    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;
    let cleanup: (() => void) | undefined;
    let disposed = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
    if (disposed) return;
    const ctx = gsap.context(() => {
      gsap.to(".phone-l", { y: -40, ease: "none", scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.to(".phone-r", { y: 40, ease: "none", scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, wrap);
    const rid = requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
    cleanup = () => { cancelAnimationFrame(rid); ctx.revert(); };
    });
    return () => { disposed = true; cleanup?.(); };
  }, [reduce]);

  return (
    <section id="ai" className="section" aria-labelledby="ai-title">
      <div className="container-x">
        <h2 id="ai-title" className="text-[32px] md:text-[44px] max-w-[760px]">{t("title")}</h2>
        <p className="text-dim mt-4 text-lg max-w-[560px]">{t("sub")}</p>
      </div>
      <div ref={wrap} className="container-x mt-14 md:mt-20 grid md:grid-cols-2 gap-10 md:gap-6 justify-items-center">
        <div className="phone-l md:justify-self-end md:mr-4"><PhoneChat /></div>
        <div className="phone-r md:justify-self-start md:ml-4 md:mt-16"><PhoneAutomations /></div>
      </div>
      <div className="container-x mt-20 md:mt-28">
        <div className="hairline pt-14 md:pt-20">
          <RoiCalculator />
        </div>
      </div>
    </section>
  );
}
