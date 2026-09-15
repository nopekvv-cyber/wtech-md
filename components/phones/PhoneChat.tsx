"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { loadGsap } from "@/lib/gsap";
import { ChevronLeft, MoreHorizontal, FileText, ChevronRight, Calendar, CheckCircle2, Paperclip, ArrowUp } from "lucide-react";


/** Left phone (Mockup 3): the conversation is scrubbed to scroll and rewindable. */
export function PhoneChat({ progressRef }: { progressRef?: React.MutableRefObject<number> }) {
  const t = useTranslations("ai.chat");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(reduce ? 6 : 0);

  useLayoutEffect(() => {
    if (reduce || !ref.current) { setStep(6); return; }
    let cleanup: (() => void) | undefined;
    let disposed = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
    if (disposed || !ref.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current!.closest("section") ?? ref.current!,
        start: "top 70%",
        end: "bottom 60%",
        scrub: true,
        onUpdate: (self) => {
          const s = Math.min(6, Math.floor(self.progress * 7));
          setStep(s);
          if (progressRef) progressRef.current = self.progress;
        },
      });
    }, ref);
    const rid = requestAnimationFrame(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
    cleanup = () => { cancelAnimationFrame(rid); ctx.revert(); };
    });
    return () => { disposed = true; cleanup?.(); };
  }, [reduce, progressRef]);

  const show = (n: number) => step >= n;
  const bubble = "rounded-[16px] px-3.5 py-2.5 text-[12.5px] leading-snug";
  const enter = (n: number) => `transition-all duration-500 ${show(n) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`;

  return (
    <div ref={ref} className="phone" aria-label={t("header")}>
      <div className="phone-notch" aria-hidden="true" />
      <div className="absolute inset-0 pt-12 pb-4 px-4 flex flex-col text-[12px]">
        <div className="flex items-center gap-2 pb-3 border-b border-line">
          <ChevronLeft size={16} className="text-dim" aria-hidden="true" />
          <Image src="/brand/wtech-mark-ui.png" alt="" width={27} height={16} className="object-contain w-7 h-auto" />
          <span className="font-medium text-[13px]">{t("header")}</span>
          <MoreHorizontal size={16} className="ml-auto text-dim" aria-hidden="true" />
        </div>
        <div className="flex-1 overflow-hidden pt-3 grid gap-3 content-start">
          <div className={`flex gap-2 ${enter(1)}`}>
            <span className="w-7 h-7 rounded-full bg-white/10 grid place-items-center text-[9px] shrink-0">AC</span>
            <div className="min-w-0">
              <div className="text-[10px] text-dim">{t("client")} · {t("clientRole")} · 09:12</div>
              <div className={`${bubble} bg-white/[0.07] mt-1`}>{t("m1")}</div>
            </div>
          </div>
          <div className={`flex gap-2 ${enter(2)}`}>
            <Image src="/brand/wtech-mark-ui.png" alt="" width={27} height={16} className="object-contain w-7 h-auto shrink-0 mt-1" />
            <div className="min-w-0">
              <div className="text-[10px] text-dim">{t("header")} · 09:13</div>
              <div className={`${bubble} bg-white/[0.07] mt-1`}>
                {t("m2")}
                <div className={`mt-2 flex items-center gap-2 rounded-[10px] border border-line p-2 ${enter(3)}`}>
                  <FileText size={16} aria-hidden="true" />
                  <span className="min-w-0"><span className="block truncate">{t("file")}</span><span className="block text-[10px] text-dim">{t("fileMeta")}</span></span>
                  <ChevronRight size={14} className="ml-auto text-dim" aria-hidden="true" />
                </div>
              </div>
              <div className={`${bubble} bg-white/[0.07] mt-2 ${enter(3)}`}>{t("m3")}</div>
            </div>
          </div>
          <div className={`flex justify-end ${enter(4)}`}>
            <div className={`${bubble} bg-ink text-black max-w-[80%]`}>{t("m4")}</div>
          </div>
          <div className={`crm-panel p-3 flex items-center gap-3 ${enter(5)}`}>
            <Calendar size={18} aria-hidden="true" />
            <span className="min-w-0"><span className="block font-medium">{t("meeting")}</span><span className="block text-dim text-[11px]">{t("meetingWhen")}</span><span className="block text-dim text-[11px]">{t("meetingWhere")}</span></span>
            <ChevronRight size={14} className="ml-auto text-dim" aria-hidden="true" />
          </div>
          <div className={`rounded-[12px] p-3 flex items-center gap-3 ${enter(6)}`} style={{ background: "rgba(53,227,240,0.12)" }}>
            <CheckCircle2 size={18} style={{ color: "#35E3F0" }} aria-hidden="true" />
            <span><span className="block font-medium">{t("sent")}</span><span className="block text-dim text-[11px]">{t("sentSub")}</span></span>
          </div>
        </div>
        <div className="crm-panel h-11 px-3 flex items-center gap-2 text-dim">
          <Paperclip size={14} aria-hidden="true" /><span className="flex-1">{t("input")}</span>
          <span className="w-8 h-8 rounded-full grid place-items-center" style={{ background: "#6E3BFF" }}><ArrowUp size={14} className="text-white" aria-hidden="true" /></span>
        </div>
      </div>
    </div>
  );
}
