import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { AuditForm } from "@/components/sections/AuditForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: { absolute: t("audit.title") }, description: t("audit.description"), alternates: alternatesFor("/audit", locale as Locale) };
}

export default async function AuditPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "audit" });
  return (
    <section className="section" style={{ paddingTop: "calc(var(--nav-h) + 64px)" }}>
      <div className="container-x grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <h1 className="text-[36px] md:text-[48px]">{t("title")}</h1>
          <p className="text-dim mt-4 text-lg">{t("sub")}</p>
        </div>
        <div className="lg:col-span-7">
          <Suspense fallback={null}><AuditForm place="audit-page" showAi /></Suspense>
        </div>
      </div>
    </section>
  );
}
