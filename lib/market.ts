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
    .replace(/^\/despre$/, "/about");
}

/** Map an international public URL to the existing English app route. */
export function internationalInternalPath(pathname: string): string {
  if (pathname === "/") return "/en";
  return "/en" + pathname
    .replace(/^\/services(?=\/|$)/, "/servicii")
    .replace(/^\/work$/, "/lucrari")
    .replace(/^\/pricing$/, "/preturi")
    .replace(/^\/about$/, "/despre");
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
  };
  return translated[pathname] ?? null;
}
