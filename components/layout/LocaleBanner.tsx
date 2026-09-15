"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocalizedHref } from "./useLocalizedHref";
import type { Locale } from "@/i18n/routing";

/**
 * Suggests the browser's language in a small bar. Never redirects. The choice (or dismissal) is remembered
 * in the wtech_locale cookie. Runs client-side so every page stays statically prerendered.
 */
export function LocaleBanner({ current }: { current: Locale }) {
  const t = useTranslations("localeBanner");
  const hrefFor = useLocalizedHref(current);
  const [suggested, setSuggested] = useState<Locale | null>(null);

  useEffect(() => {
    try {
      if (/(?:^|;\s*)wtech_locale=/.test(document.cookie)) return;
      const langs = (navigator.languages?.length ? navigator.languages : [navigator.language]).map((l) => l.toLowerCase().slice(0, 2));
      const first = langs.find((l) => l === "ro" || l === "ru" || l === "en") as Locale | undefined;
      if (first && first !== current) setSuggested(first);
    } catch {}
  }, [current]);

  const remember = (l: Locale | "dismiss") => {
    try { document.cookie = `wtech_locale=${l}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`; } catch {}
    setSuggested(null);
  };
  if (!suggested) return null;
  return (
    <div role="status" className="fixed left-1/2 -translate-x-1/2 top-[calc(var(--nav-h)+8px)] z-40 max-w-[calc(100%-32px)] flex items-center gap-3 px-4 py-2 rounded-full border border-line bg-black/80 backdrop-blur-xl text-[14px]">
      <span className="text-dim">{t("text", { language: t(suggested) })}</span>
      <Link href={hrefFor(suggested)} locale={suggested} className="text-ink font-medium underline-offset-4 hover:underline" onClick={() => remember(suggested)}>
        {t("switch")}
      </Link>
      <button type="button" className="text-dim hover:text-ink" onClick={() => remember("dismiss")}>{t("dismiss")}</button>
    </div>
  );
}
