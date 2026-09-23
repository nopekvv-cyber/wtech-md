import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/site";
import { requestMarket, requestOrigin } from "@/lib/market-server";
import { internationalPublicPath } from "@/lib/market";

type Href = Parameters<typeof getPathname>[0]["href"];

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
