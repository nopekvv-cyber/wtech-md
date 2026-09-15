import { getTranslations } from "next-intl/server";
import { SITE_URL, geo } from "@/lib/site";
import { getSite } from "@/lib/settings";
import { type Locale } from "@/i18n/routing";
import { serviceKeys, serviceSlugs } from "@/lib/services";

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
  const org = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
        "@id": `${SITE_URL}/#organization`,
        name: "wtech.md",
        url: SITE_URL,
        logo: `${SITE_URL}/brand/wtech-mark-black.png`,
        image: `${SITE_URL}/og-${locale}.png`,
        description: t("orgDescription"),
        ...(contact.phone ? { telephone: contact.phone } : {}),
        email: contact.email,
        address: { "@type": "PostalAddress", ...(contact.address ? { streetAddress: contact.address } : {}), addressLocality: "Chișinău", addressCountry: "MD" },
        geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng },
        areaServed: { "@type": "Country", name: t("areaServed") },
        priceRange: "MDL",
        currenciesAccepted: "MDL, EUR",
        openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" }],
        knowsLanguage: ["ro", "ru", "en"],
        sameAs,
        makesOffer: serviceKeys.map((k) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", "@id": `${SITE_URL}/#service-${k}`, name: ts(`${k}.name`), url: `${SITE_URL}/${locale === "ro" ? "" : locale + "/"}${locale === "ru" ? "uslugi" : locale === "en" ? "services" : "servicii"}/${serviceSlugs[k][locale]}` },
          priceCurrency: "MDL",
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "wtech.md",
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
  return <JsonLd data={org} />;
}

export function ServiceSchema({ name, description, url, locale }: { name: string; description: string; url: string; locale: Locale }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        url,
        inLanguage: locale,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Moldova" },
        offers: { "@type": "Offer", priceCurrency: "MDL", availability: "https://schema.org/InStock" },
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
