import "server-only";
import { cache } from "react";
import { readSettings } from "./db";
import { contactDefaults, socialDefaults } from "./site";

/**
 * CMS-editable values (the former build-time placeholders): contact channels, the three proof numbers and socials.
 * Stored in Supabase (`settings` table) and edited at /admin; environment
 * NEXT_PUBLIC_* values remain the fallback so an existing .env keeps working. Read once per request through React
 * cache so the layout, Footer, Contact and translated copy share one Supabase settings result.
 */
export type Field = {
  key: string;
  group: "contact" | "proof" | "social";
  label: string;
  hint?: string;
  type: "text" | "tel" | "email" | "url" | "number";
  max?: number;
};

export const FIELDS: Field[] = [
  { key: "contact.legal_name", group: "contact", label: "Registered legal name", hint: "Exact name from the company register", type: "text", max: 160 },
  { key: "contact.phone", group: "contact", label: "Phone", hint: "+373 69 000 000", type: "tel", max: 24 },
  { key: "contact.whatsapp", group: "contact", label: "WhatsApp number", hint: "+373 69 000 000", type: "tel", max: 24 },
  { key: "contact.telegram", group: "contact", label: "Telegram username", hint: "@wtechmd", type: "text", max: 40 },
  { key: "contact.viber", group: "contact", label: "Viber number", hint: "+373 69 000 000", type: "tel", max: 24 },
  { key: "contact.email", group: "contact", label: "Email", type: "email", max: 120 },
  { key: "contact.address", group: "contact", label: "Address", hint: "str. …, Chișinău", type: "text", max: 160 },
  { key: "contact.idno", group: "contact", label: "IDNO", hint: "13 digits", type: "text", max: 20 },
  { key: "proof.n1", group: "proof", label: "Projects delivered in Moldova", hint: "e.g. 40+", type: "text", max: 12 },
  { key: "proof.n2", group: "proof", label: "Average AI reply time (minutes)", hint: "e.g. 2", type: "text", max: 12 },
  { key: "proof.n3", group: "proof", label: "Leads processed monthly", hint: "e.g. 3 000+", type: "text", max: 12 },
  { key: "social.facebook", group: "social", label: "Facebook URL", type: "url", max: 200 },
  { key: "social.instagram", group: "social", label: "Instagram URL", type: "url", max: 200 },
  { key: "social.linkedin", group: "social", label: "LinkedIn URL", type: "url", max: 200 },
];

export type Site = {
  contact: { legalName: string; phone: string; phoneHref: string; whatsapp: string; telegram: string; viber: string; email: string; address: string; idno: string };
  socials: { facebook: string; instagram: string; linkedin: string };
  proof: { n1: string; n2: string; n3: string };
};

/** Raw stored values merged over the environment fallbacks. */
export const loadSettings = cache(async (): Promise<Record<string, string>> => {
  const env: Record<string, string> = {
    "contact.legal_name": contactDefaults.legalName,
    "contact.phone": contactDefaults.phone,
    "contact.whatsapp": contactDefaults.whatsapp,
    "contact.telegram": contactDefaults.telegram,
    "contact.viber": contactDefaults.viber,
    "contact.email": contactDefaults.email,
    "contact.address": contactDefaults.address,
    "contact.idno": contactDefaults.idno,
    "social.facebook": socialDefaults.facebook,
    "social.instagram": socialDefaults.instagram,
    "social.linkedin": socialDefaults.linkedin,
  };
  let stored: Record<string, string> = {};
  try { stored = await readSettings(); } catch { stored = {}; } // database issues must not take the public site down
  const out = { ...env };
  for (const [k, v] of Object.entries(stored)) if (v !== "") out[k] = v; else delete out[k];
  return out;
});

export const getSite = cache(async (): Promise<Site> => {
  const s = await loadSettings();
  const g = (k: string) => s[k] ?? "";
  return {
    contact: {
      legalName: g("contact.legal_name"),
      phone: "+37369360663",
      phoneHref: "+37369360663", whatsapp: g("contact.whatsapp"), telegram: g("contact.telegram"),
      viber: g("contact.viber"), email: "hello@wtech.md", address: g("contact.address"), idno: g("contact.idno"),
    },
    socials: { facebook: g("social.facebook"), instagram: g("social.instagram"), linkedin: g("social.linkedin") },
    proof: { n1: g("proof.n1"), n2: g("proof.n2"), n3: g("proof.n3") },
  };
});

const TOKEN = /\[\[(proof\.n[123])\]\]/g;

/**
 * Replaces the typed tokens in the message tree with CMS values. A string that still has an unresolved token after
 * substitution falls back to its `<key>_short` sibling when one exists (copy written without the number), otherwise
 * the token is removed so nothing invented ever renders.
 */
export function resolveMessages<T>(messages: T, site: Site): T {
  const values: Record<string, string> = {
    "proof.n1": site.proof.n1, "proof.n2": site.proof.n2, "proof.n3": site.proof.n3,
  };
  const walk = (node: unknown): unknown => {
    if (typeof node === "string") return node.replace(TOKEN, (_, k: string) => values[k] ?? "");
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === "object") {
      const out: Record<string, unknown> = {};
      for (const [k, raw] of Object.entries(node as Record<string, unknown>)) {
        if (k.endsWith("_short")) continue;
        const short = (node as Record<string, unknown>)[`${k}_short`];
        const missing = typeof raw === "string" && [...raw.matchAll(TOKEN)].some((m) => !values[m[1]!]);
        out[k] = missing && typeof short === "string" ? short : walk(raw);
      }
      return out;
    }
    return node;
  };
  return walk(messages) as T;
}
