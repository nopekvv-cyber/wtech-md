import { defineRouting } from "next-intl/routing";

export const locales = ["ro", "ru", "en"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "ro",
  localePrefix: "as-needed",
  localeDetection: false, // never redirect on Accept-Language; a banner suggests, the user decides
  localeCookie: { name: "wtech_locale", maxAge: 60 * 60 * 24 * 365 },
  pathnames: {
    "/": "/",
    "/servicii": { ro: "/servicii", ru: "/uslugi", en: "/services" },
    "/servicii/[slug]": { ro: "/servicii/[slug]", ru: "/uslugi/[slug]", en: "/services/[slug]" },
    "/lucrari": { ro: "/lucrari", ru: "/raboty", en: "/work" },
    "/preturi": { ro: "/preturi", ru: "/ceny", en: "/pricing" },
    "/contact": "/contact",
    "/audit": "/audit",
    "/despre": { ro: "/despre", ru: "/o-nas", en: "/about" },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/legal-privacy": { ro: "/confidentialitate", ru: "/konfidentsialnost", en: "/privacy" },
    "/legal-terms": { ro: "/termeni", ru: "/usloviya", en: "/terms" },
    "/legal-cookies": { ro: "/cookie-uri", ru: "/fayly-cookie", en: "/cookies" },
    "/legal-refunds": { ro: "/rambursari", ru: "/vozvraty", en: "/refunds" },
    "/legal-sms-consent": { ro: "/consimtamant-sms", ru: "/sms-soglasie", en: "/sms-consent" },
  },
});
