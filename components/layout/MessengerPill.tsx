"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { AnaChat } from "@/components/chat/AnaChat";

/** Always-visible off-white pill (mark inside), bottom-right. Opens Ana, the AI chat; WhatsApp lives in the chat header. */
export function MessengerPill() {
  const t = useTranslations("pill");
  const tc = useTranslations("chat");
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="messenger-pill fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+12px)] lg:bottom-6 z-[45] transition-[bottom] duration-300">
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? tc("close") : tc("open")}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 h-14 pl-3 pr-4 rounded-full bg-ink text-black shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-px active:scale-[0.98]"
        >
          {open ? <X size={18} aria-hidden="true" /> : <Image src="/brand/wtech-mark-ui.png" alt="" width={36} height={21} className="object-contain w-9 h-auto" />}
          <span className="text-[15px] font-medium">{open ? tc("close") : t("label")}</span>
        </button>
      </div>
      <AnaChat open={open} onClose={() => setOpen(false)} />
    </>
  );
}
