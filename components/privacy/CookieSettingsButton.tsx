"use client";

import { useTranslations } from "next-intl";
import { useConsent } from "./ConsentProvider";

export function CookieSettingsButton({ className = "" }: { className?: string }) {
  const t = useTranslations("footer");
  const { openSettings } = useConsent();
  return <button type="button" className={className} onClick={openSettings}>{t("cookieSettings")}</button>;
}
