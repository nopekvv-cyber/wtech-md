import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { headers } from "next/headers";
import { routing } from "./routing";
import { getSite, resolveMessages } from "@/lib/settings";
import { withInternationalPricing } from "@/lib/international-pricing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const requestHeaders = await headers();
  const international = requestHeaders.get("x-wtech-market") === "international";
  const locale = international ? "en" : hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const imported = international
    ? (await import("../messages/en-intl.json")).default
    : (await import(`../messages/${locale}.json`)).default;
  const raw = international
    ? withInternationalPricing(structuredClone(imported), requestHeaders.get("x-vercel-ip-country"))
    : imported;
  return {
    locale,
    // Proof numbers and contact data come from the CMS; international prices are selected from the IP country.
    messages: resolveMessages(raw, await getSite()),
    timeZone: "Europe/Chisinau",
  };
});
