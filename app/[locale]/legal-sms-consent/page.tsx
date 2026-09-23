import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalDocuments } from "@/content/legal";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> { const { locale } = await params; const d = legalDocuments[locale].sms; return { title: d.title, description: d.summary, alternates: await alternatesFor("/legal-sms-consent", locale) }; }
export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) { const { locale } = await params; return <LegalPage locale={locale} document="sms" />; }
