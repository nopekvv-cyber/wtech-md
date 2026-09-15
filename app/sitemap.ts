import type { MetadataRoute } from "next";
import { routing, locales, type Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/site";
import { serviceKeys, serviceSlugs } from "@/lib/services";
import { blogSlugs } from "@/lib/blog";

type P = Parameters<typeof getPathname>[0]["href"];

function entry(href: P, priority = 0.7): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = SITE_URL + getPathname({ href, locale: l });
  languages["x-default"] = SITE_URL + getPathname({ href, locale: routing.defaultLocale });
  return {
    url: SITE_URL + getPathname({ href, locale: routing.defaultLocale }),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [
    entry("/", 1),
    entry("/servicii", 0.9),
    entry("/lucrari", 0.7),
    entry("/preturi", 0.8),
    entry("/contact", 0.8),
    entry("/audit", 0.8),
    entry("/despre", 0.6),
    entry("/blog", 0.6),
  ];
  for (const key of serviceKeys) {
    // service slugs differ per locale; build alternates manually
    const languages: Record<string, string> = {};
    for (const l of locales as readonly Locale[]) {
      languages[l] = SITE_URL + getPathname({ href: { pathname: "/servicii/[slug]", params: { slug: serviceSlugs[key][l] } }, locale: l });
    }
    const ro = languages.ro ?? SITE_URL;
    languages["x-default"] = ro;
    out.push({ url: ro, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9, alternates: { languages } });
  }
  for (const slug of blogSlugs) {
    out.push(entry({ pathname: "/blog/[slug]", params: { slug } }, 0.5));
  }
  return out;
}
