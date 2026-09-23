"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/components/site/MarketLink";

export function FormConsent({ id, privacyAccepted, marketingConsent, error, onPrivacyChange, onMarketingChange, showMarketing = true }: { id: string; privacyAccepted: boolean; marketingConsent: boolean; error?: string; onPrivacyChange: (value: boolean) => void; onMarketingChange: (value: boolean) => void; showMarketing?: boolean }) {
  const t = useTranslations("consent");
  return (
    <fieldset className="grid gap-3 border-0 p-0 m-0">
      <legend className="sr-only">{t("legend")}</legend>
      <label className="flex items-start gap-3 text-[14px] text-ink/85">
        <input id={`${id}-privacy`} type="checkbox" checked={privacyAccepted} onChange={(e) => onPrivacyChange(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#F5F1EA]" required aria-invalid={error ? "true" : undefined} aria-describedby={error ? `${id}-privacy-error` : undefined} />
        <span>{t("privacyBefore")} <Link href="/legal-privacy" className="link-inline">{t("privacyLink")}</Link>{t("privacyAfter")}</span>
      </label>
      {error ? <p id={`${id}-privacy-error`} className="error-text" role="alert">{error}</p> : null}
      {showMarketing ? (
        <label className="flex items-start gap-3 text-[14px] text-dim">
          <input id={`${id}-marketing`} type="checkbox" checked={marketingConsent} onChange={(e) => onMarketingChange(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[#F5F1EA]" />
          <span>{t("marketingBefore")} <Link href="/legal-sms-consent" className="link-inline">{t("smsLink")}</Link>{t("marketingAfter")}</span>
        </label>
      ) : null}
    </fieldset>
  );
}
