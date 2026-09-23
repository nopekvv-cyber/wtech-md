import "server-only";
import { headers } from "next/headers";
import { INTERNATIONAL_SITE_URL, SITE_URL } from "./site";
import { marketForHost, type Market } from "./market";

export async function requestMarket(): Promise<Market> {
  const h = await headers();
  const tagged = h.get("x-wtech-market");
  if (tagged === "international" || tagged === "moldova") return tagged;
  return marketForHost(h.get("x-forwarded-host") ?? h.get("host"));
}

export async function requestOrigin(): Promise<string> {
  if ((await requestMarket()) === "moldova") return SITE_URL;
  // Keep one public international entity even when the app is reached through
  // a Vercel deployment or preview alias.
  return INTERNATIONAL_SITE_URL;
}

export async function requestCountry(): Promise<string | null> {
  return (await headers()).get("x-vercel-ip-country");
}
