import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/site";

type Href = Parameters<typeof getPathname>[0]["href"];

/** Canonical + hreflang alternates for a route in every locale. */
export function alternatesFor(href: Href, locale: Locale): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = SITE_URL + getPathname({ href, locale: l });
  languages["x-default"] = SITE_URL + getPathname({ href, locale: "ro" });
  return { canonical: SITE_URL + getPathname({ href, locale }), languages };
}
