import { getTranslations } from "next-intl/server";
import { SITE_URL, geo } from "@/lib/site";
import { getSite } from "@/lib/settings";
import { type Locale } from "@/i18n/routing";
import { serviceKeys, serviceSlugs } from "@/lib/services";
import { requestCountry, requestMarket, requestOrigin } from "@/lib/market-server";
import { internationalPublicPath } from "@/lib/market";
import { internationalPriceBook } from "@/lib/international-pricing";
import { getPathname } from "@/i18n/navigation";

function JsonLd({ data }: { data: unknown }) {
  // JSON-LD is data, not executed script; still escape "<" so no translated string can break out of the tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export async function OrganizationSchema({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "schema" });
  const ts = await getTranslations({ locale, namespace: "services.items" });
  const { contact, socials } = await getSite();
  const sameAs = Object.values(socials).filter(Boolean);
  const international = (await requestMarket()) === "international";
  const origin = international ? await requestOrigin() : SITE_URL;
  const brand = international ? "WTECH" : "wtech.md";
  const priceBook = internationalPriceBook(international ? await requestCountry() : null);
  const organizationType = contact.address ? ["Organization", "ProfessionalService"] : "Organization";
  const organization = {
    "@type": organizationType,
    "@id": `${origin}/#organization`,
    name: brand,
    alternateName: international ? ["wtech.to", "WTECH"] : "WTECH",
    url: origin,
    logo: { "@type": "ImageObject", url: `${origin}/brand/wtech-mark-black.png`, width: 1024, height: 1024 },
    image: `${origin}/${international ? "og-intl.png" : `og-${locale}.png`}`,
    description: t("orgDescription"),
    ...(contact.legalName ? { legalName: contact.legalName } : {}),
    ...(contact.phone ? { telephone: contact.phone } : {}),
    email: contact.email,
    ...(contact.address ? {
      address: { "@type": "PostalAddress", streetAddress: contact.address, addressLocality: "Chișinău", addressCountry: "MD" },
      geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng },
    } : {}),
    areaServed: international ? [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Australia" },
      { "@type": "AdministrativeArea", name: "Europe" },
    ] : { "@type": "Country", name: t("areaServed") },
    priceRange: international ? `${priceBook.prices[0]}–${priceBook.prices[4]} ${priceBook.currency}` : "600–12,000 EUR",
    currenciesAccepted: international ? "USD, EUR, CAD, AUD, GBP" : "EUR",
    knowsLanguage: ["ro", "ru", "en"],
    knowsAbout: ["web development", "custom CRM development", "AI agents", "business automation", "mobile applications", "technical SEO"],
    sameAs,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t("catalogName"),
      itemListElement: serviceKeys.map((k) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": `${origin}/#service-${k}`,
          name: ts(`${k}.name`),
          url: international ? origin + internationalPublicPath(getPathname({ href: { pathname: "/servicii/[slug]", params: { slug: serviceSlugs[k].en } }, locale: "en" })) : `${origin}/${locale === "ro" ? "" : locale + "/"}${locale === "ru" ? "uslugi" : locale === "en" ? "services" : "servicii"}/${serviceSlugs[k][locale]}`,
        },
      })),
    },
  };
  const org = {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: origin,
        name: international ? "wtech.to" : "wtech.md",
        inLanguage: locale,
        publisher: { "@id": `${origin}/#organization` },
      },
    ],
  };
  return <JsonLd data={org} />;
}

export async function ServiceSchema({ name, description, url, locale }: { name: string; description: string; url: string; locale: Locale }) {
  const international = (await requestMarket()) === "international";
  const origin = international ? await requestOrigin() : SITE_URL;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        serviceType: name,
        description,
        url,
        inLanguage: locale,
        provider: { "@id": `${origin}/#organization` },
        areaServed: international ? [
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "Canada" },
          { "@type": "Country", name: "Australia" },
          { "@type": "AdministrativeArea", name: "Europe" },
        ] : { "@type": "Country", name: "Moldova" },
        availableLanguage: international ? ["English"] : ["Romanian", "Russian", "English"],
      }}
    />
  );
}

export function FaqSchema({ items }: { items: Array<{ q: string; a: string }> }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
      }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: Array<{ name: string; url: string }> }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
      }}
    />
  );
}

export function ArticleSchema({ title, description, url, date, locale }: { title: string; description: string; url: string; date: string; locale: Locale }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url,
        inLanguage: locale,
        datePublished: date,
        dateModified: date,
        image: `${SITE_URL}/og-${locale}.png`,
        author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "wtech.md" },
        publisher: { "@id": `${SITE_URL}/#organization` },
      }}
    />
  );
}
