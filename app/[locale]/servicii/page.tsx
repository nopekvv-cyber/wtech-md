import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/components/site/MarketLink";
import { type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { serviceKeys, serviceMedia, serviceSlugs } from "@/lib/services";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { BookButton } from "@/components/ui/BookButton";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ href: "/servicii", locale: locale as Locale, title: t("services.title"), description: t("services.description") });
}

export default async function ServicesIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });
  const th = await getTranslations({ locale, namespace: "hero" });
  return (
    <section className="section" style={{ paddingTop: "calc(var(--nav-h) + 64px)" }}>
      <div className="container-x">
        <h1 className="text-[36px] md:text-[52px] max-w-[760px]">{t("title")}</h1>
        <ul className="mt-14 border-t border-line divide-y divide-white/10">
          {serviceKeys.map((k) => (
            <li key={k} className="py-10 grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                <h2 className="text-[28px] md:text-[32px]">{t(`items.${k}.name`)}</h2>
                <p className="text-dim mt-3">{t(`items.${k}.before`)}</p>
                <p className="mt-2 max-w-[520px]">{t(`items.${k}.after`)}</p>
                <Link href={{ pathname: "/servicii/[slug]", params: { slug: serviceSlugs[k][locale as Locale] } }} className="link-inline mt-6">{t(`items.${k}.cta`)} <ArrowUpRight size={16} aria-hidden="true" /></Link>
              </div>
              <div className="md:col-span-5 rounded-[var(--radius-md)] overflow-hidden border border-line">
                <LoopVideo base={serviceMedia[k].video.replace("/media/", "")} alt={t(`items.${k}.alt`)} className="w-full" />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-12"><BookButton place="services-index">{th("primary")}</BookButton><p className="text-dim text-[14px] mt-3">{th("risk")}</p></div>
      </div>
    </section>
  );
}
