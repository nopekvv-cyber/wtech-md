import "server-only";
import { headers } from "next/headers";
import { SITE_URL } from "./site";
import { marketForHost, type Market } from "./market";

export async function requestMarket(): Promise<Market> {
  const h = await headers();
  const tagged = h.get("x-wtech-market");
  if (tagged === "international" || tagged === "moldova") return tagged;
  return marketForHost(h.get("x-forwarded-host") ?? h.get("host"));
}

export async function requestOrigin(): Promise<string> {
  const h = await headers();
  if ((await requestMarket()) === "moldova") return SITE_URL;
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(",")[0]!.trim();
  if (!host) return SITE_URL;
  const proto = (h.get("x-forwarded-proto") ?? "https").split(",")[0]!.trim();
  return `${proto}://${host}`;
}

export async function requestCountry(): Promise<string | null> {
  return (await headers()).get("x-vercel-ip-country");
}
