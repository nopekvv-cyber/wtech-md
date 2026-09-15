"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useInView, useReducedMotion } from "framer-motion";
import { ChevronLeft, MoreHorizontal, Users, FileText, CreditCard, BarChart3, MessageSquare, Zap, LayoutGrid, Settings } from "lucide-react";

const ITEMS = [{ k: "a1", Icon: Users }, { k: "a2", Icon: FileText }, { k: "a3", Icon: CreditCard }, { k: "a4", Icon: BarChart3 }] as const;

/** Right phone (Mockup 3): toggles + "Rulate azi: 47" counting up. Toggles are real controls. */
export function PhoneAutomations() {
  const t = useTranslations("ai.automations");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [count, setCount] = useState(reduce ? 47 : 0);
  const [on, setOn] = useState([true, true, true, true]);

  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      setCount(Math.round(47 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]);

  return (
    <div ref={ref} className="phone" aria-label={t("header")}>
      <div className="phone-notch" aria-hidden="true" />
      <div className="absolute inset-0 pt-12 pb-3 px-4 flex flex-col text-[12px]">
        <div className="flex items-center gap-2 pb-3">
          <ChevronLeft size={16} className="text-dim" aria-hidden="true" />
          <Image src="/brand/wtech-mark-ui.png" alt="" width={27} height={16} className="object-contain w-7 h-auto" />
          <span className="font-medium text-[13px]">{t("header")}</span>
          <MoreHorizontal size={16} className="ml-auto text-dim" aria-hidden="true" />
        </div>
        <div className="crm-panel p-3">
          <div className="text-[10px] text-dim uppercase tracking-wide">{t("ranToday")}</div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-[34px] leading-none mt-1 tnum">{count}</div>
              <div className="text-[10px] text-dim mt-1">{t("header").toLowerCase()}</div>
            </div>
            <div className="w-24">
              <div className="h-1 rounded-full bg-white/10 overflow-hidden"><div className="h-full" style={{ width: `${(count / 50) * 100}%`, background: "var(--grad)", transition: "width 120ms linear" }} /></div>
              <div className="text-[10px] text-dim mt-1 text-right">{t("of", { total: 50 })}</div>
            </div>
          </div>
        </div>
        <div className="font-medium text-[13px] mt-4 mb-2">{t("title")}</div>
        <ul className="grid gap-2">
          {ITEMS.map(({ k, Icon }, i) => (
            <li key={k} className="crm-panel p-3 flex items-center gap-3">
              <Icon size={16} className="text-dim shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1"><span className="block">{t(k)}</span><span className="block text-[10px] text-dim leading-tight">{t(`${k}s`)}</span></span>
              <span className="text-[10px] text-dim">{on[i] ? t("active") : ""}</span>
              <button
                type="button"
                role="switch"
                aria-checked={on[i]}
                aria-label={t(k)}
                className="toggle shrink-0"
                data-on={on[i]}
                onClick={() => setOn((s) => s.map((v, j) => (j === i ? !v : v)))}
              />
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-3 border-t border-line grid grid-cols-4 text-[9px] text-dim">
          {[{ k: "chat", Icon: MessageSquare }, { k: "automations", Icon: Zap }, { k: "crm", Icon: LayoutGrid }, { k: "settings", Icon: Settings }].map(({ k, Icon }, i) => (
            <span key={k} className={`flex flex-col items-center gap-1 ${i === 1 ? "text-ink" : ""}`}><Icon size={14} aria-hidden="true" style={i === 1 ? { color: "#6E3BFF" } : undefined} />{t(`tabs.${k}`)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
