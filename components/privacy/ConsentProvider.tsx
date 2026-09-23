"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Categories = { analytics: boolean; external: boolean };
type ConsentContextValue = Categories & { openSettings: () => void };
const ConsentContext = createContext<ConsentContextValue | null>(null);
const STORAGE_KEY = "wtech_consent_v1";

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("cookieBanner");
  const [decided, setDecided] = useState(false);
  const [categories, setCategories] = useState<Categories>({ analytics: false, external: false });
  const [draft, setDraft] = useState<Categories>({ analytics: false, external: false });
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as { choice?: "necessary" | "optional"; analytics?: boolean; external?: boolean; version?: number } | null;
      if (saved?.version === 2) {
        const next = { analytics: saved.analytics === true, external: saved.external === true };
        setCategories(next); setDraft(next); setDecided(true);
      } else if (saved?.version === 1 && (saved.choice === "necessary" || saved.choice === "optional")) {
        const enabled = saved.choice === "optional";
        const next = { analytics: enabled, external: enabled };
        setCategories(next); setDraft(next); setDecided(true);
      } else if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) {
        setDecided(true);
      }
    } catch {}
    setReady(true);
  }, []);

  const save = useCallback((next: Categories) => {
    const removedLoadedCategory = (categories.analytics && !next.analytics) || (categories.external && !next.external);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, ...next, updatedAt: new Date().toISOString() }));
    setCategories(next); setDraft(next); setDecided(true); setSettingsOpen(false);
    if (removedLoadedCategory) window.location.reload();
  }, [categories]);
  const openSettings = useCallback(() => { setDraft(categories); setSettingsOpen(true); }, [categories]);
  const value = useMemo(() => ({ ...categories, openSettings }), [categories, openSettings]);
  const visible = ready && (!decided || settingsOpen);

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {visible ? (
        <div className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-[760px] max-h-[calc(100vh-24px)] overflow-y-auto rounded-[20px] border border-white/15 bg-[#0a0a0b]/[0.98] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.75)] md:p-6" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-description">
          <h2 id="cookie-title" className="text-[20px]">{t("title")}</h2>
          <p id="cookie-description" className="text-dim mt-2 text-[14px] leading-relaxed">{t("body")}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
            <Link href="/legal-privacy" className="link-inline">{t("privacy")}</Link>
            <Link href="/legal-cookies" className="link-inline">{t("cookies")}</Link>
          </div>
          <fieldset className="mt-5 grid gap-3 border-0 p-0">
            <legend className="sr-only">{t("title")}</legend>
            <div className="flex items-start gap-3 rounded-[12px] border border-line p-3">
              <input id="consent-analytics" type="checkbox" checked={draft.analytics} onChange={(e) => setDraft((old) => ({ ...old, analytics: e.target.checked }))} className="mt-1 h-4 w-4 shrink-0 accent-[#F5F1EA]" aria-labelledby="consent-analytics-label" aria-describedby="consent-analytics-description" />
              <span><span id="consent-analytics-label" className="block font-medium text-ink">{t("analytics")}</span><span id="consent-analytics-description" className="text-dim text-[13px]">{t("analyticsDescription")}</span></span>
            </div>
            <div className="flex items-start gap-3 rounded-[12px] border border-line p-3">
              <input id="consent-external" type="checkbox" checked={draft.external} onChange={(e) => setDraft((old) => ({ ...old, external: e.target.checked }))} className="mt-1 h-4 w-4 shrink-0 accent-[#F5F1EA]" aria-labelledby="consent-external-label" aria-describedby="consent-external-description" />
              <span><span id="consent-external-label" className="block font-medium text-ink">{t("external")}</span><span id="consent-external-description" className="text-dim text-[13px]">{t("externalDescription")}</span></span>
            </div>
          </fieldset>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" className="btn btn-ghost" onClick={() => save({ analytics: false, external: false })}>{t("necessary")}</button>
            <button type="button" className="btn btn-ghost" onClick={() => save(draft)}>{t("save")}</button>
            <button type="button" className="btn btn-primary" onClick={() => save({ analytics: true, external: true })}>{t("accept")}</button>
          </div>
        </div>
      ) : null}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const value = useContext(ConsentContext);
  if (!value) throw new Error("useConsent must be used inside ConsentProvider");
  return value;
}
