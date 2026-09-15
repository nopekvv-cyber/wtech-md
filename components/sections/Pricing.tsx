"use client";

import { useTranslations } from "next-intl";
import { useBrand } from "@/components/preloader/BrandContext";
import { track } from "@/lib/analytics";

/** Three "starting from" rows in MDL. Not a price table. Prices come from the CMS; an unset one reads "on request". */
export function Pricing({ standalone = false }: { standalone?: boolean }) {
  const t = useTranslations("pricing");
  const { openBooking } = useBrand();
  const rows = [1, 2, 3] as const;
  return (
    <section id="preturi" className="section" aria-labelledby="pricing-title">
      <div className="container-x">
        {standalone ? <h1 id="pricing-title" className="text-[36px] md:text-[52px] max-w-[760px]">{t("title")}</h1> : <h2 id="pricing-title" className="text-[32px] md:text-[44px] max-w-[760px]">{t("title")}</h2>}
        <p className="text-dim mt-4 text-lg max-w-[620px]">{t("sub")}</p>
        <ul className="mt-14 border-t border-line divide-y divide-white/10">
          {rows.map((n) => (
            <li key={n} className="py-8 grid md:grid-cols-12 gap-4 md:gap-8 items-baseline">
              <h3 className="md:col-span-4 text-[24px] md:text-[28px]">{t(`r${n}`)}</h3>
              <div className="md:col-span-3 text-[15px]">
                {t(`r${n}p`) ? (
                  <><span className="text-dim">{t("from")} </span><span className="text-[26px] tnum">{t(`r${n}p`)}</span> <span className="text-dim">{t("currency")}</span></>
                ) : (
                  <span className="text-[20px]">{t("onRequest")}</span>
                )}
              </div>
              <p className="md:col-span-5 text-dim">{t(`r${n}i`)}</p>
            </li>
          ))}
        </ul>
        <p className="text-dim text-[14px] mt-6 max-w-[620px]">{t("note")}</p>
        <button type="button" className="btn btn-primary mt-8" onClick={() => { track("cta_call_click", { place: "pricing" }); openBooking(); }}>{t("cta")}</button>
      </div>
    </section>
  );
}
