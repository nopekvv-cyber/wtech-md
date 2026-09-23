export type Market = "moldova" | "international";

const MOLDOVA_HOSTS = new Set(["wtech.md", "www.wtech.md", "localhost", "127.0.0.1", "::1"]);

export function cleanHost(value: string | null | undefined): string {
  return (value ?? "").split(",")[0]!.trim().toLowerCase().replace(/:\d+$/, "");
}

/** wtech.md is the Moldova site. Every additional production or preview host is the English international site. */
export function marketForHost(value: string | null | undefined): Market {
  const host = cleanHost(value);
  if (!host || MOLDOVA_HOSTS.has(host) || host.endsWith(".localhost")) return "moldova";
  return "international";
}

/** Public English URLs have no /en prefix on the international domain. */
export function internationalPublicPath(pathname: string): string {
  const path = pathname === "/en" ? "/" : pathname.replace(/^\/en(?=\/)/, "");
  return path
    .replace(/^\/servicii(?=\/|$)/, "/services")
    .replace(/^\/lucrari$/, "/work")
    .replace(/^\/preturi$/, "/pricing")
    .replace(/^\/despre$/, "/about")
    .replace(/^\/confidentialitate$/, "/privacy")
    .replace(/^\/termeni$/, "/terms")
    .replace(/^\/cookie-uri$/, "/cookies")
    .replace(/^\/rambursari$/, "/refunds")
    .replace(/^\/consimtamant-sms$/, "/sms-consent");
}

/** Map an international public URL to the existing English app route. */
export function internationalInternalPath(pathname: string): string {
  if (pathname === "/") return "/en";
  return "/en" + pathname
    .replace(/^\/services(?=\/|$)/, "/servicii")
    .replace(/^\/work$/, "/lucrari")
    .replace(/^\/pricing$/, "/preturi")
    .replace(/^\/about$/, "/despre")
    .replace(/^\/privacy$/, "/legal-privacy")
    .replace(/^\/terms$/, "/legal-terms")
    .replace(/^\/cookies$/, "/legal-cookies")
    .replace(/^\/refunds$/, "/legal-refunds")
    .replace(/^\/sms-consent$/, "/legal-sms-consent");
}

export function internationalRedirectPath(pathname: string): string | null {
  if (pathname === "/blog" || pathname.startsWith("/blog/") || pathname === "/en/blog" || pathname.startsWith("/en/blog/")) return "/";
  if (pathname === "/en" || pathname === "/ro" || pathname === "/ru") return "/";
  if (pathname.startsWith("/ro/") || pathname.startsWith("/ru/")) return "/";
  if (pathname.startsWith("/en/")) return internationalPublicPath(pathname);
  const translated: Record<string, string> = {
    "/servicii": "/services", "/uslugi": "/services",
    "/lucrari": "/work", "/raboty": "/work",
    "/preturi": "/pricing", "/ceny": "/pricing",
    "/despre": "/about", "/o-nas": "/about",
    "/confidentialitate": "/privacy", "/konfidentsialnost": "/privacy",
    "/termeni": "/terms", "/usloviya": "/terms",
    "/cookie-uri": "/cookies", "/fayly-cookie": "/cookies",
    "/rambursari": "/refunds", "/vozvraty": "/refunds",
    "/consimtamant-sms": "/sms-consent", "/sms-soglasie": "/sms-consent",
  };
  return translated[pathname] ?? null;
}

export function moldovaLegalRedirectPath(pathname: string): string | null {
  const translated: Record<string, string> = {
    "/privacy": "/confidentialitate",
    "/terms": "/termeni",
    "/cookies": "/cookie-uri",
    "/refunds": "/rambursari",
    "/sms-consent": "/consimtamant-sms",
    "/legal-privacy": "/confidentialitate",
    "/legal-terms": "/termeni",
    "/legal-cookies": "/cookie-uri",
    "/legal-refunds": "/rambursari",
    "/legal-sms-consent": "/consimtamant-sms",
  };
  return translated[pathname] ?? null;
}
