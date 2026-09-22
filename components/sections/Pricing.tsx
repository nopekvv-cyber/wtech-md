"use client";

import { useTranslations } from "next-intl";
import { useBrand } from "@/components/preloader/BrandContext";
import { Wordmark } from "@/components/ui/Wordmark";
import { track } from "@/lib/analytics";

/** WTECH offer architecture: three configurable entry points plus a fully custom EUR tier. */
export function Pricing({ standalone = false }: { standalone?: boolean }) {
  const t = useTranslations("pricing");
  const { openBooking } = useBrand();
  const plans = [1, 2, 3, 4] as const;
  return (
    <section id="preturi" className="section" aria-labelledby="pricing-title">
      <div className="container-x">
        <div className="grid lg:grid-cols-12 gap-7 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <p className="pricing-eyebrow">{t("eyebrow")}</p>
            {standalone ? <h1 id="pricing-title" className="text-[38px] md:text-[58px] max-w-[820px] mt-4">{t("title")}</h1> : <h2 id="pricing-title" className="text-[34px] md:text-[48px] max-w-[820px] mt-4">{t("title")}</h2>}
          </div>
          <p className="text-dim text-[17px] lg:col-span-4 lg:pb-1">{t("sub")}</p>
        </div>

        <ol className="pricing-plans mt-12 md:mt-16">
          {plans.map((n) => {
            const custom = n === 4;
            const price = t(`r${n}p`);
            const currency = custom ? t("r4c") : t("currency");
            return (
              <li key={n} className={custom ? "pricing-plan pricing-plan--custom" : "pricing-plan"}>
                <div className="pricing-plan__topline">
                  <span className="pricing-plan__index">WTECH / 0{n}</span>
                  {custom && <span className="pricing-plan__badge">{t("customBadge")}</span>}
                </div>

                {custom && <Wordmark size={24} className="pricing-plan__wordmark" />}
                <h3 className="pricing-plan__title">{t(`r${n}`)}</h3>

                <div className="pricing-plan__price">
                  {price ? (
                    <>
                      <span className="pricing-plan__from">{t("from")}</span>
                      <span className="pricing-plan__amount tnum">{price}</span>
                      <span className="pricing-plan__currency">{currency}</span>
                    </>
                  ) : (
                    <span className="pricing-plan__request">{t("onRequest")}</span>
                  )}
                </div>

                <p className="pricing-plan__description">{t(`r${n}i`)}</p>
                {custom && <p className="pricing-plan__variable">{t("r4note")}</p>}
              </li>
            );
          })}
        </ol>

        <div className="mt-7 md:mt-9 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <button type="button" className="btn btn-primary" onClick={() => { track("cta_call_click", { place: "pricing" }); openBooking(); }}>{t("cta")}</button>
          <p className="text-dim text-[14px] max-w-[560px]">{t("note")}</p>
        </div>
      </div>
    </section>
  );
}
