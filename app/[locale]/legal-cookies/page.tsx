import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalDocuments } from "@/content/legal";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> { const { locale } = await params; const d = legalDocuments[locale].cookies; return pageMetadata({ href: "/legal-cookies", locale, title: d.title, description: d.summary }); }
export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) { const { locale } = await params; return <LegalPage locale={locale} document="cookies" />; }
