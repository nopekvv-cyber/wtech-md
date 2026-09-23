import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // Pages are dynamic (per-request CSP nonce), so Next would stream <title>/<meta> into the body for any client it
  // does not list as an "HTML-limited bot" and rely on React hoisting them after hydration. JS-less crawlers (GPTBot,
  // ClaudeBot, PerplexityBot, link unfurlers) and Lighthouse 13 then see no description. Our metadata is synchronous
  // translations, so blocking it for every client costs nothing: match every user agent.
  htmlLimitedBots: /./,
  compress: true,
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { optimizePackageImports: ["lucide-react", "recharts"] },
  // Locale routing without middleware (the standalone runtime turns the middleware's absolute-URL rewrite into an
  // external fetch when the Host header differs, which loops). RO lives at "/", RU and EN are prefixed.
  async rewrites() {
    return {
      beforeFiles: [
        // localised segment names (i18n/routing.ts pathnames) -> internal route names
        { source: "/ru/uslugi", destination: "/ru/servicii" },
        { source: "/ru/uslugi/:slug", destination: "/ru/servicii/:slug" },
        { source: "/en/services", destination: "/en/servicii" },
        { source: "/en/services/:slug", destination: "/en/servicii/:slug" },
        { source: "/ru/raboty", destination: "/ru/lucrari" },
        { source: "/en/work", destination: "/en/lucrari" },
        { source: "/ru/ceny", destination: "/ru/preturi" },
        { source: "/en/pricing", destination: "/en/preturi" },
        { source: "/ru/o-nas", destination: "/ru/despre" },
        { source: "/en/about", destination: "/en/despre" },
        { source: "/confidentialitate", destination: "/ro/legal-privacy" },
        { source: "/termeni", destination: "/ro/legal-terms" },
        { source: "/cookie-uri", destination: "/ro/legal-cookies" },
        { source: "/rambursari", destination: "/ro/legal-refunds" },
        { source: "/consimtamant-sms", destination: "/ro/legal-sms-consent" },
        { source: "/ru/konfidentsialnost", destination: "/ru/legal-privacy" },
        { source: "/ru/usloviya", destination: "/ru/legal-terms" },
        { source: "/ru/fayly-cookie", destination: "/ru/legal-cookies" },
        { source: "/ru/vozvraty", destination: "/ru/legal-refunds" },
        { source: "/ru/sms-soglasie", destination: "/ru/legal-sms-consent" },
        { source: "/en/privacy", destination: "/en/legal-privacy" },
        { source: "/en/terms", destination: "/en/legal-terms" },
        { source: "/en/cookies", destination: "/en/legal-cookies" },
        { source: "/en/refunds", destination: "/en/legal-refunds" },
        { source: "/en/sms-consent", destination: "/en/legal-sms-consent" },
        // default locale lives at the root
        { source: "/", destination: "/ro" },
        { source: "/:path((?!ro$|ro/|ru$|ru/|en$|en/|api/|admin$|admin/|_next/|media/|brand/|fonts/|icons/)(?!.*\\.).*)", destination: "/ro/:path" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    return [
      { source: "/ro", destination: "/", permanent: false },
      { source: "/ro/:path*", destination: "/:path*", permanent: false },
      // internal names must not be reachable under the wrong locale
      { source: "/ru/servicii/:path*", destination: "/ru/uslugi/:path*", permanent: false },
      { source: "/ru/servicii", destination: "/ru/uslugi", permanent: false },
      { source: "/en/servicii/:path*", destination: "/en/services/:path*", permanent: false },
      { source: "/en/servicii", destination: "/en/services", permanent: false },
      { source: "/ru/lucrari", destination: "/ru/raboty", permanent: false },
      { source: "/en/lucrari", destination: "/en/work", permanent: false },
      { source: "/ru/preturi", destination: "/ru/ceny", permanent: false },
      { source: "/en/preturi", destination: "/en/pricing", permanent: false },
      { source: "/ru/despre", destination: "/ru/o-nas", permanent: false },
      { source: "/en/despre", destination: "/en/about", permanent: false },
      { source: "/ru/legal-privacy", destination: "/ru/konfidentsialnost", permanent: false },
      { source: "/ru/legal-terms", destination: "/ru/usloviya", permanent: false },
      { source: "/ru/legal-cookies", destination: "/ru/fayly-cookie", permanent: false },
      { source: "/ru/legal-refunds", destination: "/ru/vozvraty", permanent: false },
      { source: "/ru/legal-sms-consent", destination: "/ru/sms-soglasie", permanent: false },
      { source: "/en/legal-privacy", destination: "/en/privacy", permanent: false },
      { source: "/en/legal-terms", destination: "/en/terms", permanent: false },
      { source: "/en/legal-cookies", destination: "/en/cookies", permanent: false },
      { source: "/en/legal-refunds", destination: "/en/refunds", permanent: false },
      { source: "/en/legal-sms-consent", destination: "/en/sms-consent", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // the CMS: never indexed, never cached
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }, { key: "Cache-Control", value: "no-store" }],
      },
      { source: "/admin", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }, { key: "Cache-Control", value: "no-store" }] },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
