import {preload} from "react-dom";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Proof } from "@/components/sections/Proof";
import { CustomSoftware } from "@/components/sections/CustomSoftware";
import { CrmDemo, AiEmployees, Automations, AiSeo } from "@/components/sections/lazy";
import { LeadMagnet } from "@/components/sections/LeadMagnet";
import { Process } from "@/components/sections/Process";
import { Pricing } from "@/components/sections/Pricing";
import {AskAnything} from "@/components/wtech/AskAnything";
import { Faq } from "@/components/sections/Faq";
import { FAQ_KEYS } from "@/lib/faq";
import { Contact } from "@/components/sections/Contact";
import { FaqSchema } from "@/components/seo/Schema";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ href: "/", locale: locale as Locale, title: t("home.title"), description: t("home.description") });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  preload("/brand/wtech-hero-mark-v2.webp",{as:"image",imageSrcSet:"/brand/wtech-hero-mark-mobile.webp 780w, /brand/wtech-hero-mark-v2.webp 1247w",imageSizes:"(max-width:480px) 102vw, (max-width:1023px) 660px, 56vw",fetchPriority:"high"});
  const tf = await getTranslations({ locale, namespace: "faq" });
  const faq = FAQ_KEYS.map((n) => ({ q: tf(`q${n}`), a: tf(`a${n}`) }));
  return (
    <>
      <Hero />
      <Services />
      <Proof />
      <CrmDemo />
      <AiEmployees />
      <Automations />
      <CustomSoftware />
      <AiSeo />
      <LeadMagnet />
      <Process />
      <Pricing />
      <Faq />
      <AskAnything />
      <Contact />
      <FaqSchema items={faq} />
    </>
  );
}
