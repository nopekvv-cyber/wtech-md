import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/components/site/MarketLink";
import type { Locale } from "@/i18n/routing";
import { serviceKeys, serviceMedia, serviceSlugs } from "@/lib/services";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { BundleShell } from "@/components/ui/BundleShell";

const ACCENTS = ["violet", "coral", "cyan", "cyan", "violet", "coral"] as const;

/** Six independent WTECH bundles. Video previews stay active while the surface reveals and reacts to hover. */
export function Services() {
  const t = useTranslations("services");
  const locale = useLocale() as Locale;
  return (
    <section id="servicii" className="section" aria-labelledby="services-title">
      <div className="container-x">
        <p className="bundle-kicker">WTECH bundles</p>
        <h2 id="services-title" className="text-[34px] md:text-[50px] max-w-[820px] mt-4">{t("title")}</h2>
        <div className="service-bundle-grid mt-12 lg:mt-16">
          {serviceKeys.map((k, i) => (
            <BundleShell key={k} accent={ACCENTS[i]} interactive className="service-bundle">
              <article id={`svc-${k}`}>
                <div className="service-bundle__media">
                  <LoopVideo base={serviceMedia[k].video.replace("/media/", "")} alt={t(`items.${k}.alt`)} className="w-full h-full" />
                </div>
                <div className="service-bundle__body">
                  <div className="flex items-center justify-between gap-4">
                    <span className="service-bundle__index">WTECH / 0{i + 1}</span>
                    <span className="w-2 h-2 rounded-full" style={{ background: `rgb(var(--bundle-accent))`, boxShadow: "0 0 18px rgb(var(--bundle-accent) / .65)" }} aria-hidden="true" />
                  </div>
                  <h3 className="text-[28px] md:text-[34px] mt-6">{t(`items.${k}.name`)}</h3>
                  <p className="text-dim mt-5 text-[16px]">{t(`items.${k}.before`)}</p>
                  <p className="mt-3 text-[18px] md:text-[20px] max-w-[520px]">{t(`items.${k}.after`)}</p>
                  <div className="mt-8">
                    <Link href={{ pathname: "/servicii/[slug]", params: { slug: serviceSlugs[k][locale] } }} className="link-inline">
                      {t(`items.${k}.cta`)} <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            </BundleShell>
          ))}
        </div>
      </div>
    </section>
  );
}
