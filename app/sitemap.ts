import type { MetadataRoute } from "next";
import { routing, locales, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/site";
import { serviceKeys, serviceSlugs } from "@/lib/services";
import { internationalPublicPath } from "@/lib/market";
import { requestMarket, requestOrigin } from "@/lib/market-server";

type P = Parameters<typeof getPathname>[0]["href"];

export const dynamic = "force-dynamic";

// Keep lastmod honest and stable. A timestamp that changes on every request tells crawlers every page changed.
const CONTENT_UPDATED_AT = new Date(process.env.NEXT_PUBLIC_CONTENT_UPDATED_AT ?? "2026-09-23T00:00:00.000Z");

function moldovaEntry(href: P, priority = 0.7): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[locale] = SITE_URL + getPathname({ href, locale });
  languages["x-default"] = SITE_URL + getPathname({ href, locale: routing.defaultLocale });
  return {
    url: SITE_URL + getPathname({ href, locale: routing.defaultLocale }),
    lastModified: CONTENT_UPDATED_AT,
    changeFrequency: "weekly",
    priority,
    alternates: { languages },
  };
}

function internationalEntry(origin: string, path: string, priority = 0.7): MetadataRoute.Sitemap[number] {
  const url = origin + internationalPublicPath(path);
  return {
    url,
    lastModified: CONTENT_UPDATED_AT,
    changeFrequency: "weekly",
    priority,
    alternates: { languages: { en: url, "x-default": url } },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if ((await requestMarket()) === "international") {
    const origin = await requestOrigin();
    const out: MetadataRoute.Sitemap = [
      internationalEntry(origin, "/", 1),
      internationalEntry(origin, "/servicii", 0.9),
      internationalEntry(origin, "/lucrari", 0.7),
      internationalEntry(origin, "/preturi", 0.8),
      internationalEntry(origin, "/contact", 0.8),
      internationalEntry(origin, "/audit", 0.8),
      internationalEntry(origin, "/despre", 0.6),
      internationalEntry(origin, "/privacy", 0.3),
      internationalEntry(origin, "/terms", 0.3),
      internationalEntry(origin, "/cookies", 0.3),
      internationalEntry(origin, "/refunds", 0.3),
      internationalEntry(origin, "/sms-consent", 0.3),
    ];
    for (const key of serviceKeys) {
      const internalPath = getPathname({ href: { pathname: "/servicii/[slug]", params: { slug: serviceSlugs[key].en } }, locale: "en" });
      out.push(internationalEntry(origin, internalPath, 0.9));
    }
    return out;
  }

  const out: MetadataRoute.Sitemap = [
    moldovaEntry("/", 1),
    moldovaEntry("/servicii", 0.9),
    moldovaEntry("/lucrari", 0.7),
    moldovaEntry("/preturi", 0.8),
    moldovaEntry("/contact", 0.8),
    moldovaEntry("/audit", 0.8),
    moldovaEntry("/despre", 0.6),
    moldovaEntry("/legal-privacy", 0.3),
    moldovaEntry("/legal-terms", 0.3),
    moldovaEntry("/legal-cookies", 0.3),
    moldovaEntry("/legal-refunds", 0.3),
    moldovaEntry("/legal-sms-consent", 0.3),
  ];
  for (const key of serviceKeys) {
    const languages: Record<string, string> = {};
    for (const locale of locales as readonly Locale[]) {
      languages[locale] = SITE_URL + getPathname({ href: { pathname: "/servicii/[slug]", params: { slug: serviceSlugs[key][locale] } }, locale });
    }
    const ro = languages.ro ?? SITE_URL;
    languages["x-default"] = ro;
    out.push({ url: ro, lastModified: CONTENT_UPDATED_AT, changeFrequency: "monthly", priority: 0.9, alternates: { languages } });
  }
  return out;
}
