import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/site";
import { requestMarket, requestOrigin } from "@/lib/market-server";
import { internationalPublicPath } from "@/lib/market";
import { serviceFromSlug, serviceMedia, serviceSlugs } from "@/lib/services";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { BookButton } from "@/components/ui/BookButton";
import { BreadcrumbSchema, ServiceSchema } from "@/components/seo/Schema";
import { Faq } from "@/components/sections/Faq";
import { FAQ_KEYS } from "@/lib/faq";
import { FaqSchema } from "@/components/seo/Schema";
import { LeadMagnet } from "@/components/sections/LeadMagnet";
import { RoiCalculator } from "@/components/sections/RoiCalculator";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const key = serviceFromSlug(locale as Locale, slug);
  if (!key) return {};
  const t = await getTranslations({ locale, namespace: "services.items" });
  const international = (await requestMarket()) === "international";
  const origin = international ? await requestOrigin() : SITE_URL;
  if (international) {
    const canonical = origin + internationalPublicPath(getPathname({ href: { pathname: "/servicii/[slug]", params: { slug: serviceSlugs[key].en } }, locale: "en" }));
    return { title: `${t(`${key}.name`)}`, description: t(`${key}.intro`), alternates: { canonical, languages: { en: canonical, "x-default": canonical } } };
  }
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = SITE_URL + getPathname({ href: { pathname: "/servicii/[slug]", params: { slug: serviceSlugs[key][l] } }, locale: l });
  languages["x-default"] = languages.ro ?? "";
  return {
    title: `${t(`${key}.name`)}`,
    description: t(`${key}.intro`),
    alternates: { canonical: languages[locale] ?? languages.ro, languages },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const key = serviceFromSlug(locale as Locale, slug);
  if (!key) notFound();
  const t = await getTranslations({ locale, namespace: "services.items" });
  const th = await getTranslations({ locale, namespace: "hero" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tf = await getTranslations({ locale, namespace: "faq" });
  const international = (await requestMarket()) === "international";
  const origin = international ? await requestOrigin() : SITE_URL;
  const path = getPathname({ href: { pathname: "/servicii/[slug]", params: { slug } }, locale: locale as Locale });
  const url = origin + (international ? internationalPublicPath(path) : path);
  const homeUrl = origin + (international ? "/" : getPathname({ href: "/", locale: locale as Locale }));
  const servicesUrl = origin + (international ? "/services" : getPathname({ href: "/servicii", locale: locale as Locale }));
  const faq = FAQ_KEYS.map((n) => ({ q: tf(`q${n}`), a: tf(`a${n}`) }));
  return (
    <>
      <section className="section" style={{ paddingTop: "calc(var(--nav-h) + 64px)" }}>
        <div className="container-x grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <h1 className="text-[36px] md:text-[56px]">{t(`${key}.name`)}</h1>
            <p className="text-dim mt-5 text-lg max-w-[560px]">{t(`${key}.intro`)}</p>
            <div className="mt-8 flex flex-wrap gap-3 items-center">
              <BookButton place={`service-${key}`}>{th("primary")}</BookButton>
            </div>
            <p className="text-dim text-[14px] mt-3">{th("risk")}</p>
          </div>
          <div className="lg:col-span-6 rounded-[var(--radius-lg)] overflow-hidden border border-line">
            <LoopVideo base={serviceMedia[key].video.replace("/media/", "")} alt={t(`${key}.alt`)} className="w-full" eager />
          </div>
        </div>
        <div className="container-x mt-16 md:mt-24">
          <h2 className="text-[28px] md:text-[36px] max-w-[640px]">{t(`${key}.after`)}</h2>
          <ul className="mt-10 border-t border-line divide-y divide-white/10 max-w-[760px]">
            {(["b1", "b2", "b3", "b4", "b5"] as const).map((b) => <li key={b} className="py-5 text-[17px]">{t(`${key}.${b}`)}</li>)}
          </ul>
        </div>
        {key === "ai" ? <div className="container-x mt-20"><div className="hairline pt-14"><RoiCalculator /></div></div> : null}
      </section>
      <LeadMagnet />
      <Faq />
      <FaqSchema items={faq} />
      <ServiceSchema name={t(`${key}.name`)} description={t(`${key}.intro`)} url={url} locale={locale as Locale} />
      <BreadcrumbSchema items={[{ name: "wtech.md", url: homeUrl }, { name: tn("services"), url: servicesUrl }, { name: t(`${key}.name`), url }]} />
    </>
  );
}
