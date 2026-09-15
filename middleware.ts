import { NextResponse, type NextRequest } from "next/server";

/**
 * Header-only middleware: a per-request nonce for the Content-Security-Policy. It never rewrites or redirects
 * (the standalone runtime turned an earlier absolute-URL rewrite into a loop behind the proxy).
 * Static security headers live in next.config.ts.
 */
export function middleware(req: NextRequest) {
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString("base64");
  const umami = process.env.NEXT_PUBLIC_UMAMI_URL ? safeOrigin(process.env.NEXT_PUBLIC_UMAMI_URL) : "";
  const cal = process.env.NEXT_PUBLIC_CAL_URL ? safeOrigin(process.env.NEXT_PUBLIC_CAL_URL) : "";
  const dev = process.env.NODE_ENV !== "production";
  // only ask browsers to upgrade sub-resources when the page itself arrived over TLS: WebKit applies the directive
  // to localhost / plain-HTTP previews too and then fails every asset with a TLS error
  const proto = req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
  const https = proto.split(",")[0]?.trim() === "https";
  const csp = [
    `default-src 'self'`,
    // nonce + strict-dynamic covers Next's own inline runtime scripts; dev needs eval for React refresh
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}${umami ? ` ${umami}` : ""}`,
    // Tailwind v4 runtime-free, but Motion/GSAP set inline style attributes: styles only
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob:`,
    `media-src 'self' blob:`,
    `font-src 'self'`,
    `connect-src 'self'${umami ? ` ${umami}` : ""}${dev ? " ws: wss:" : ""}`,
    `frame-src ${cal ? cal : "'none'"}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    ...(https ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("content-security-policy", csp);
  return res;
}

function safeOrigin(u: string): string {
  try { return new URL(u).origin; } catch { return ""; }
}

export const config = {
  // pages only; API routes and static files get the static headers from next.config.ts
  matcher: ["/((?!api|_next/static|_next/image|media|brand|fonts|icons|favicon.ico|robots.txt|sitemap.xml|llms.txt|site.webmanifest|og-).*)"],
};
