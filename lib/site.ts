import type { Locale } from "@/i18n/routing";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://wtech.md").replace(/\/$/, "");
export const INTERNATIONAL_SITE_URL = (process.env.NEXT_PUBLIC_INTERNATIONAL_SITE_URL ?? "https://wtech.to").replace(/\/$/, "");

// Contact details: the admin-managed Supabase settings win. These environment values are fallbacks.
// Empty means "not set" and the site hides the line. Runtime values come from lib/settings.ts.
export const contactDefaults = {
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME ?? "",
  phone: "+37369360663",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  telegram: process.env.NEXT_PUBLIC_TELEGRAM ?? "",
  viber: process.env.NEXT_PUBLIC_VIBER ?? "",
  email: "hello@wtech.md",
  address: process.env.NEXT_PUBLIC_ADDRESS ?? "",
  idno: process.env.NEXT_PUBLIC_IDNO ?? "",
};

export const geo = { lat: 47.0105, lng: 28.8638 };
export const calUrl = process.env.NEXT_PUBLIC_CAL_URL ?? "";

export function whatsappHref(locale: Locale, number: string) {
  const text: Record<Locale, string> = {
    ro: "Bună! Vreau să discutăm despre un proiect.",
    ru: "Здравствуйте! Хочу обсудить проект.",
    en: "Hi! I'd like to talk about a project.",
  };
  return `https://wa.me/${number.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text[locale])}`;
}

export function telegramHref(handle: string) {
  return `https://t.me/${handle.replace(/^@/, "").replace(/^https?:\/\/t\.me\//, "")}`;
}

export function viberHref(number: string) {
  return `viber://chat?number=${encodeURIComponent(number)}`;
}

export const socialDefaults = {
  facebook: process.env.NEXT_PUBLIC_FACEBOOK ?? "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN ?? "",
};

export const umami = {
  url: process.env.NEXT_PUBLIC_UMAMI_URL ?? "",
  websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? "",
};
