import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Faq } from "@/components/sections/Faq";
import { FAQ_KEYS } from "@/lib/faq";
import { FaqSchema } from "@/components/seo/Schema";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: { absolute: t("pricing.title") }, description: t("pricing.description"), alternates: alternatesFor("/preturi", locale as Locale) };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tf = await getTranslations({ locale, namespace: "faq" });
  const faq = FAQ_KEYS.map((n) => ({ q: tf(`q${n}`), a: tf(`a${n}`) }));
  return (
    <div style={{ paddingTop: "var(--nav-h)" }}>
      <Pricing standalone />
      <Process />
      <Faq />
      <FaqSchema items={faq} />
    </div>
  );
}
