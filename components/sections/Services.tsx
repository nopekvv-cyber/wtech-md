import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { serviceKeys, serviceMedia, serviceSlugs } from "@/lib/services";
import { LoopVideo } from "@/components/ui/LoopVideo";

/**
 * Six rows (BAB). Static by design: no pin, no scroll reveals, so the text is always there whether the visitor
 * scrolls, jumps to an anchor or lands mid-page. Each row carries its own loop on the right.
 */
export function Services() {
  const t = useTranslations("services");
  const locale = useLocale() as Locale;
  return (
    <section id="servicii" className="section" aria-labelledby="services-title">
      <div className="container-x">
        <h2 id="services-title" className="text-[32px] md:text-[44px] max-w-[760px]">{t("title")}</h2>
        <div className="mt-12 lg:mt-16 border-t border-line">
          {serviceKeys.map((k) => (
            <article key={k} id={`svc-${k}`} className="border-b border-line py-10 lg:py-14 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6">
                <h3 className="text-[28px] md:text-[32px]">{t(`items.${k}.name`)}</h3>
                <p className="text-dim mt-5 text-[17px]">{t(`items.${k}.before`)}</p>
                <p className="mt-3 text-[17px] md:text-[19px] max-w-[520px]">{t(`items.${k}.after`)}</p>
                <div className="mt-7">
                  <Link href={{ pathname: "/servicii/[slug]", params: { slug: serviceSlugs[k][locale] } }} className="link-inline">
                    {t(`items.${k}.cta`)} <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-6 rounded-[var(--radius-lg)] overflow-hidden border border-line bg-surface">
                <LoopVideo base={serviceMedia[k].video.replace("/media/", "")} alt={t(`items.${k}.alt`)} className="w-full h-full" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
