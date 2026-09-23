"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const RATIO = 1.69; // trimmed mark aspect ratio (public/brand/wtech-mark-ui.png)

/** Lockup: the real mark PNG (never redrawn) + the wordmark set in the site face. */
export function Wordmark({ size = 28, className = "", id }: { size?: number; className?: string; id?: string }) {
  const t = useTranslations("common");
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        id={id}
        src="/brand/wtech-mark-ui.png"
        alt=""
        width={Math.round(size * RATIO)}
        height={size}
        className="object-contain"
        style={{ width: Math.round(size * RATIO), height: size }}
        priority
      />
      <span className="font-medium tracking-[-0.02em] text-ink" style={{ fontSize: Math.round(size * 0.72) }}>
        {t("brandAlt")}
      </span>
    </span>
  );
}
