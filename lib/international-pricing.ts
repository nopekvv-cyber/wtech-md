export type PriceRegion = "us" | "canada" | "australia" | "uk" | "europe";

export type InternationalPriceBook = {
  region: PriceRegion;
  marketName: string;
  currency: string;
  prices: readonly [string, string, string, string, string];
};

const EUROPE_COUNTRIES = new Set([
  "AL", "AD", "AT", "BE", "BA", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IS", "IE", "IT", "XK", "LV", "LI", "LT", "LU", "MT", "MC", "ME", "NL", "MK", "NO",
  "PL", "PT", "RO", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "VA",
]);

const PRICE_BOOKS: Record<PriceRegion, InternationalPriceBook> = {
  us: {
    region: "us",
    marketName: "United States / international",
    currency: "USD",
    prices: ["1,490", "3,490", "6,900", "14,900", "29,900"],
  },
  canada: {
    region: "canada",
    marketName: "Canada",
    currency: "CAD",
    prices: ["1,990", "4,490", "8,990", "19,900", "39,900"],
  },
  australia: {
    region: "australia",
    marketName: "Australia",
    currency: "AUD",
    prices: ["2,190", "4,990", "7,990", "19,900", "39,900"],
  },
  uk: {
    region: "uk",
    marketName: "United Kingdom",
    currency: "GBP",
    prices: ["1,190", "2,790", "5,490", "11,900", "23,900"],
  },
  europe: {
    region: "europe",
    marketName: "Europe",
    currency: "EUR",
    prices: ["1,290", "2,990", "5,990", "12,900", "25,900"],
  },
};

export function priceRegionForCountry(value: string | null | undefined): PriceRegion {
  const country = (value ?? "").trim().toUpperCase();
  if (country === "CA") return "canada";
  if (country === "AU") return "australia";
  if (country === "GB") return "uk";
  if (EUROPE_COUNTRIES.has(country)) return "europe";
  return "us";
}

export function internationalPriceBook(country: string | null | undefined): InternationalPriceBook {
  return PRICE_BOOKS[priceRegionForCountry(country)];
}

type MessageTree = Record<string, unknown> & {
  pricing?: Record<string, unknown>;
  faq?: Record<string, unknown>;
  ai?: Record<string, unknown>;
  meta?: Record<string, unknown>;
  about?: Record<string, unknown>;
};

/** Add the visitor's fixed regional price book to a fresh international message tree. */
export function withInternationalPricing<T extends MessageTree>(messages: T, country: string | null | undefined): T {
  const book = internationalPriceBook(country);
  const pricing = { ...(messages.pricing ?? {}) };
  const faq = { ...(messages.faq ?? {}) };
  const ai = { ...(messages.ai ?? {}) };
  const chat = { ...((ai.chat as Record<string, unknown> | undefined) ?? {}) };
  const roi = { ...((ai.roi as Record<string, unknown> | undefined) ?? {}) };
  const meta = { ...(messages.meta ?? {}) };
  const pricingMeta = { ...((meta.pricing as Record<string, unknown> | undefined) ?? {}) };
  const about = { ...(messages.about ?? {}) };
  book.prices.forEach((price, index) => { pricing[`r${index + 1}p`] = price; });
  pricing.currency = book.currency;
  pricing.marketLabel = "Prices detected for";
  pricing.marketName = book.marketName;
  pricing.sub = `Every package includes the previous one. These are total project prices in ${book.currency}, localized for ${book.marketName}.`;
  pricing.r5note = `From ${book.currency} ${book.prices[4]}. This package is fully tailored; the final price varies with workflows, integrations, data migration, compliance and launch markets.`;
  faq.a1 = `International WTECH packages start at ${book.currency} ${book.prices[0]} for START, ${book.currency} ${book.prices[1]} for BUSINESS, ${book.currency} ${book.prices[2]} for BOOKING, ${book.currency} ${book.prices[3]} for CRM & AI and ${book.currency} ${book.prices[4]} for COMPLETE. Each package includes the previous one; applicable tax is added separately.`;
  chat.m2 = `Hi, Andrei! I have prepared a tailored proposal for the presentation website. The START package begins at ${book.currency} ${book.prices[0]} excluding applicable taxes, and delivery takes 2–3 weeks.`;
  roi.value = `Average order value (${book.currency})`;
  roi.result = `${book.currency} recovered per month`;
  pricingMeta.description = `Five cumulative WTECH packages for landing pages, business websites, booking systems, custom CRM, AI and mobile apps. International project prices from ${book.currency} ${book.prices[0]}.`;
  about.f3 = `Fixed project price in ${book.currency}`;
  ai.chat = chat;
  ai.roi = roi;
  meta.pricing = pricingMeta;
  return { ...messages, pricing, faq, ai, meta, about } as T;
}
