import type { Locale } from "@/i18n/routing";

export type ServiceKey = "websites" | "crm" | "ai" | "automations" | "software" | "seo";

export const serviceKeys: ServiceKey[] = ["websites", "crm", "ai", "automations", "software", "seo"];

// Localised slugs per service (used by /servicii/[slug], /ru/uslugi/[slug], /en/services/[slug])
export const serviceSlugs: Record<ServiceKey, Record<Locale, string>> = {
  websites: { ro: "site-uri", ru: "sayty", en: "websites" },
  crm: { ro: "crm-dashboard", ru: "crm-dashboard", en: "crm-dashboards" },
  ai: { ro: "angajati-ai", ru: "ai-sotrudniki", en: "ai-employees" },
  automations: { ro: "automatizari", ru: "avtomatizacii", en: "automations" },
  software: { ro: "software-la-comanda", ru: "razrabotka-po", en: "custom-software" },
  seo: { ro: "ai-seo", ru: "ai-seo", en: "ai-seo" },
};

export function serviceFromSlug(locale: Locale, slug: string): ServiceKey | null {
  for (const key of serviceKeys) {
    if (serviceSlugs[key][locale] === slug) return key;
  }
  // tolerate any locale's slug to avoid 404s on shared links
  for (const key of serviceKeys) {
    if (Object.values(serviceSlugs[key]).includes(slug)) return key;
  }
  return null;
}

export const serviceMedia: Record<ServiceKey, { video: string; poster: string }> = {
  websites: { video: "/media/svc-websites", poster: "/media/svc-websites.jpg" },
  crm: { video: "/media/svc-crm", poster: "/media/svc-crm.jpg" },
  ai: { video: "/media/svc-ai", poster: "/media/svc-ai.jpg" },
  automations: { video: "/media/svc-automations", poster: "/media/svc-automations.jpg" },
  software: { video: "/media/svc-software", poster: "/media/svc-software.jpg" },
  seo: { video: "/media/svc-seo", poster: "/media/svc-seo.jpg" },
};
