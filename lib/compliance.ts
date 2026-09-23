export const PRIVACY_NOTICE_VERSION = "2026-09-23";

export function consentRecord(source: string, marketingConsent: boolean) {
  return `[Consent: privacy=yes; marketing=${marketingConsent ? "yes" : "no"}; notice=${PRIVACY_NOTICE_VERSION}; source=${source}; recorded=${new Date().toISOString()}]`;
}

export function appendConsent(message: string, source: string, marketingConsent: boolean) {
  return [message.trim(), consentRecord(source, marketingConsent)].filter(Boolean).join("\n\n");
}
