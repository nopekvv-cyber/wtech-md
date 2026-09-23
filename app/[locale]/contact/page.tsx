import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Contact } from "@/components/sections/Contact";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ href: "/contact", locale: locale as Locale, title: t("contact.title"), description: t("contact.description") });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div style={{ paddingTop: "var(--nav-h)" }}>
      <Contact standalone />
    </div>
  );
}
