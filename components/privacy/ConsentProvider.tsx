"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Link } from "@/components/site/MarketLink";

type Categories = { analytics: boolean; external: boolean };
type ConsentContextValue = Categories & { openSettings: () => void };
const ConsentContext = createContext<ConsentContextValue | null>(null);
const STORAGE_KEY = "wtech_consent_v1";

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("cookieBanner");
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [decided, setDecided] = useState(false);
  const [categories, setCategories] = useState<Categories>({
    analytics: false,
    external: false,
  });
  const [draft, setDraft] = useState<Categories>({
    analytics: false,
    external: false,
  });
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as {
        choice?: "necessary" | "optional";
        analytics?: boolean;
        external?: boolean;
        version?: number;
      } | null;
      if (saved?.version === 2) {
        const next = {
          analytics: saved.analytics === true,
          external: saved.external === true,
        };
        setCategories(next);
        setDraft(next);
        setDecided(true);
      } else if (
        saved?.version === 1 &&
        (saved.choice === "necessary" || saved.choice === "optional")
      ) {
        const enabled = saved.choice === "optional";
        const next = { analytics: enabled, external: enabled };
        setCategories(next);
        setDraft(next);
        setDecided(true);
      } else if (
        (navigator as Navigator & { globalPrivacyControl?: boolean })
          .globalPrivacyControl
      ) {
        setDecided(true);
      }
    } catch {}
    setReady(true);
  }, []);

  const save = useCallback(
    (next: Categories) => {
      const removedLoadedCategory =
        (categories.analytics && !next.analytics) ||
        (categories.external && !next.external);
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            version: 2,
            ...next,
            updatedAt: new Date().toISOString(),
          }),
        );
      } catch {}
      setCategories(next);
      setDraft(next);
      setDecided(true);
      setSettingsOpen(false);
      if (removedLoadedCategory) window.location.reload();
    },
    [categories],
  );
  useEffect(() => {
    if (!settingsOpen) return;
    previousFocus.current = document.activeElement as HTMLElement;
    panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSettingsOpen(false);
        previousFocus.current?.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [settingsOpen]);
  const openSettings = useCallback(() => {
    setDraft(categories);
    setSettingsOpen(true);
  }, [categories]);
  const value = useMemo(
    () => ({ ...categories, openSettings }),
    [categories, openSettings],
  );
  const visible = ready && (!decided || settingsOpen);

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {visible ? (
        <div
          data-lenis-prevent
          ref={panelRef}
          className="cookie-panel"
          role={settingsOpen ? "dialog" : "region"}
          aria-modal={settingsOpen ? false : undefined}
          aria-labelledby="cookie-title"
          aria-describedby="cookie-description"
        >
          <div className="cookie-heading">
            <h2 id="cookie-title">{t("compactTitle")}</h2>
            {settingsOpen ? (
              <button
                type="button"
                aria-label={t("close")}
                onClick={() => {
                  setSettingsOpen(false);
                  previousFocus.current?.focus();
                }}
              >
                <X size={18} />
              </button>
            ) : null}
          </div>
          <p
            id="cookie-description"
            className="text-dim mt-2 text-[14px] leading-relaxed"
          >
            {t("compactBody")}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
            <Link href="/legal-privacy" className="link-inline">
              {t("privacy")}
            </Link>
            <Link href="/legal-cookies" className="link-inline">
              {t("cookies")}
            </Link>
          </div>
          {settingsOpen ? (
            <fieldset className="mt-4 grid gap-3 border-0 p-0">
              <legend className="sr-only">{t("title")}</legend>
              <label
                htmlFor="consent-analytics"
                className="flex items-start gap-3 rounded-[12px] border border-line p-3 cursor-pointer"
              >
                <input
                  id="consent-analytics"
                  type="checkbox"
                  checked={draft.analytics}
                  onChange={(e) =>
                    setDraft((old) => ({ ...old, analytics: e.target.checked }))
                  }
                  className="mt-1 h-4 w-4 shrink-0 accent-[#F5F1EA]"
                  aria-labelledby="consent-analytics-label"
                  aria-describedby="consent-analytics-description"
                />
                <span>
                  <span
                    id="consent-analytics-label"
                    className="block font-medium text-ink"
                  >
                    {t("analytics")}
                  </span>
                  <span
                    id="consent-analytics-description"
                    className="text-dim text-[13px]"
                  >
                    {t("analyticsDescription")}
                  </span>
                </span>
              </label>
              <label
                htmlFor="consent-external"
                className="flex items-start gap-3 rounded-[12px] border border-line p-3 cursor-pointer"
              >
                <input
                  id="consent-external"
                  type="checkbox"
                  checked={draft.external}
                  onChange={(e) =>
                    setDraft((old) => ({ ...old, external: e.target.checked }))
                  }
                  className="mt-1 h-4 w-4 shrink-0 accent-[#F5F1EA]"
                  aria-labelledby="consent-external-label"
                  aria-describedby="consent-external-description"
                />
                <span>
                  <span
                    id="consent-external-label"
                    className="block font-medium text-ink"
                  >
                    {t("external")}
                  </span>
                  <span
                    id="consent-external-description"
                    className="text-dim text-[13px]"
                  >
                    {t("externalDescription")}
                  </span>
                </span>
              </label>
            </fieldset>
          ) : null}
          <div className="cookie-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => save({ analytics: false, external: false })}
            >
              {t("necessary")}
            </button>
            {settingsOpen ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => save(draft)}
              >
                {t("save")}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={openSettings}
              >
                {t("settings")}
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => save({ analytics: true, external: true })}
            >
              {t("accept")}
            </button>
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
