import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

/**
 * Catch-all under the locale segment: an unknown path such as /ru/net-takoi or /nu-exista (rewritten to
 * /ro/nu-exista by next.config.ts) lands here and renders app/[locale]/not-found.tsx inside the locale layout,
 * so the 404 keeps the nav, the brand and the visitor's language. Without it Next falls back to the root
 * not-found, which has no layout.
 */
export default async function CatchAll({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
