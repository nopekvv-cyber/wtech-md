"use client";

import { useTranslations } from "next-intl";
import { useBrand } from "@/components/preloader/BrandContext";
import { BundleShell } from "@/components/ui/BundleShell";
import { Wordmark } from "@/components/ui/Wordmark";
import { track } from "@/lib/analytics";

const PLANS = [1, 2, 3, 4, 5] as const;
const ACCENTS = ["violet", "cyan", "coral", "violet", "mix"] as const;

/** Five cumulative commercial bundles; international prices are selected server-side from the visitor's country. */
export function Pricing({ standalone = false }: { standalone?: boolean }) {
  const t = useTranslations("pricing");
  const { openBooking } = useBrand();

  return (
    <section id="preturi" className="section" aria-labelledby="pricing-title">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-7 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <p className="pricing-eyebrow">{t("eyebrow")}</p>
            {standalone ? (
              <h1 id="pricing-title" className="text-[38px] md:text-[58px] max-w-[900px] mt-4">{t("title")}</h1>
            ) : (
              <h2 id="pricing-title" className="text-[34px] md:text-[48px] max-w-[900px] mt-4">{t("title")}</h2>
            )}
          </div>
          <p className="text-dim text-[17px] lg:col-span-4 lg:pb-1">{t("sub")}</p>
        </div>

        {t.has("marketName") ? (
          <p className="mt-5 text-[13px] text-dim" aria-live="polite">
            {t("marketLabel")}: <strong className="text-ink">{t("marketName")} · {t("currency")}</strong>
          </p>
        ) : null}

        <ol className="package-bundle-grid mt-12 md:mt-16">
          {PLANS.map((n, index) => {
            const complete = n === 5;
            return (
              <li key={n} className={`package-bundle package-bundle--${n}${complete ? " package-bundle--complete" : ""}`}>
                <BundleShell accent={ACCENTS[index]} interactive className="package-bundle__shell">
                  <article className="package-bundle__article">
                    <div className="package-bundle__topline">
                      <span className="package-bundle__index">WTECH / 0{n}</span>
                      {complete && <span className="package-bundle__badge">{t("customBadge")}</span>}
                    </div>

                    {complete && <Wordmark size={24} className="package-bundle__wordmark" />}
                    <h3 className="package-bundle__title">{t(`r${n}`)}</h3>

                    <div className="package-bundle__prices">
                      <div className="package-bundle__current">
                        <span className="package-bundle__from">{t("from")}</span>
                        <span className="package-bundle__amount tnum">{t(`r${n}p`)}</span>
                        <span className="package-bundle__currency">{t("currency")}</span>
                      </div>
                    </div>

                    {n > 1 && <p className="package-bundle__cumulative">+ {t("includesPrevious")}</p>}
                    <p className="package-bundle__description">{t(`r${n}i`)}</p>
                    {complete && <p className="package-bundle__variable">{t("r5note")}</p>}
                  </article>
                </BundleShell>
              </li>
            );
          })}
        </ol>

        <aside className="package-terms" aria-labelledby="package-terms-title">
          <div className="package-terms__intro">
            <span className="package-terms__kicker">WTECH / SCOPE</span>
            <h3 id="package-terms-title">{t("termsTitle")}</h3>
          </div>
          <div className="package-terms__items">
            <div><strong>{t("included")}</strong><p>{t("includedText")}</p></div>
            <div><strong>{t("separate")}</strong><p>{t("separateText")}</p></div>
            <div><strong>{t("individual")}</strong><p>{t("individualText")}</p></div>
          </div>
          <p className="package-terms__vat">{t("vat")}</p>
        </aside>

        <div className="mt-7 md:mt-9 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <button type="button" className="btn btn-primary" onClick={() => { track("cta_call_click", { place: "pricing" }); openBooking(); }}>{t("cta")}</button>
          <p className="text-dim text-[14px] max-w-[620px]">{t("note")}</p>
        </div>
      </div>
    </section>
  );
}
