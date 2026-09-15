import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { getSite, resolveMessages } from "@/lib/settings";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const raw = (await import(`../messages/${locale}.json`)).default;
  return {
    locale,
    // prices and proof numbers come from the CMS at request time (pages are dynamic already)
    messages: resolveMessages(raw, await getSite()),
    timeZone: "Europe/Chisinau",
  };
});
