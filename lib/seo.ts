import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/site";
import { requestMarket, requestOrigin } from "@/lib/market-server";
import { internationalPublicPath } from "@/lib/market";

type Href = Parameters<typeof getPathname>[0]["href"];

const OG_LOCALES: Record<Locale, string> = { ro: "ro_MD", ru: "ru_MD", en: "en_US" };

/** Canonical + hreflang alternates for a route in every locale. */
export async function alternatesFor(href: Href, locale: Locale): Promise<NonNullable<Metadata["alternates"]>> {
  if ((await requestMarket()) === "international") {
    const origin = await requestOrigin();
    const canonical = origin + internationalPublicPath(getPathname({ href, locale: "en" }));
    return { canonical, languages: { en: canonical, "x-default": canonical } };
  }
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = SITE_URL + getPathname({ href, locale: l });
  languages["x-default"] = SITE_URL + getPathname({ href, locale: "ro" });
  return { canonical: SITE_URL + getPathname({ href, locale }), languages };
}

/** Complete, consistent metadata for every public page. */
export async function pageMetadata({
  href,
  locale,
  title,
  description,
  index = true,
}: {
  href: Href;
  locale: Locale;
  title: string;
  description: string;
  index?: boolean;
}): Promise<Metadata> {
  const alternates = await alternatesFor(href, locale);
  return metadataWithAlternates({ locale, title, description, alternates, index });
}

export function metadataWithAlternates({
  locale,
  title,
  description,
  alternates,
  index = true,
}: {
  locale: Locale;
  title: string;
  description: string;
  alternates: NonNullable<Metadata["alternates"]>;
  index?: boolean;
}): Metadata {
  const canonical = String(alternates.canonical);
  return {
    title: { absolute: title },
    description,
    alternates,
    robots: { index, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: "wtech.md",
      locale: OG_LOCALES[locale],
      images: [{ url: `/og-${locale}.png`, width: 1200, height: 630, alt: `${title} — wtech.md` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og-${locale}.png`],
    },
  };
}
