"use client";

import Script from "next/script";
import { useConsent } from "./ConsentProvider";

export function AnalyticsConsent({ url, websiteId, nonce }: { url: string; websiteId: string; nonce?: string }) {
  const { analytics } = useConsent();
  if (!analytics || !url || !websiteId) return null;
  return <Script src={`${url}/script.js`} data-website-id={websiteId} data-do-not-track="true" strategy="afterInteractive" nonce={nonce} />;
}
