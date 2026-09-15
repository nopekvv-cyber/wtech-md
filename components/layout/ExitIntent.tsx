"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { m, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AuditForm } from "@/components/sections/AuditForm";
import { track } from "@/lib/analytics";

/** Desktop only, once per session, offering the free audit. Nothing on touch devices. */
export function ExitIntent() {
  const t = useTranslations("exit");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches;
    if (!finePointer) return;
    let shown = false;
    try { shown = sessionStorage.getItem("wtech_exit") === "1"; } catch { shown = true; }
    if (shown) return;
    const armAt = Date.now() + 8000; // don't fire on an immediate bounce
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 8 || Date.now() < armAt) return;
      try { sessionStorage.setItem("wtech_exit", "1"); } catch {}
      setOpen(true);
      track("exit_intent_shown");
      document.removeEventListener("mouseout", onLeave);
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/70 backdrop-blur-sm p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <m.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-title"
            className="relative w-full max-w-[560px] bg-surface border border-line rounded-[var(--radius-lg)] p-8"
            initial={{ y: 16, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 16, scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="absolute top-4 right-4 w-10 h-10 grid place-items-center text-dim hover:text-ink" aria-label={t("close")} onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
            <h2 id="exit-title" className="text-[28px] pr-10">{t("title")}</h2>
            <p className="text-dim mt-3">{t("sub")}</p>
            <div className="mt-6">
              <AuditForm compact place="exit" />
            </div>
            <button type="button" className="mt-4 text-dim text-[14px] hover:text-ink" onClick={() => setOpen(false)}>{t("close")}</button>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
