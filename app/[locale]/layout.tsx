import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { headers } from "next/headers";
import { routing, type Locale } from "@/i18n/routing";
import { preload } from "react-dom";
import { outfit, ONEST_CYRILLIC } from "@/lib/fonts";
import { umami } from "@/lib/site";
import { requestMarket, requestOrigin } from "@/lib/market-server";
import { getSite } from "@/lib/settings";
import { SiteProvider } from "@/components/site/SiteContext";
import { BrandProvider } from "@/components/preloader/BrandContext";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { StickyCta } from "@/components/layout/StickyCta";
import { MessengerPill } from "@/components/layout/MessengerPill";
import { ExitIntent } from "@/components/layout/ExitIntent";
import { BookingModal } from "@/components/layout/BookingModal";
import { OrganizationSchema } from "@/components/seo/Schema";
import { ConsentProvider } from "@/components/privacy/ConsentProvider";
import { AnalyticsConsent } from "@/components/privacy/AnalyticsConsent";
import "../globals.css";

// Supabase-backed CMS values must be read on every request so /admin changes appear immediately.
export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const origin = await requestOrigin();
  return {
    metadataBase: new URL(origin),
    title: { default: t("home.title"), template: "%s | wtech.md" },
    description: t("home.description"),
    applicationName: "wtech.md",
    icons: {
      icon: [
        { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/site.webmanifest",
    openGraph: {
      type: "website",
      siteName: "wtech.md",
      locale: locale === "ro" ? "ro_RO" : locale === "ru" ? "ru_RU" : "en_US",
      images: [{ url: `/og-${locale}.png`, width: 1200, height: 630, alt: "wtech.md" }],
    },
    twitter: { card: "summary_large_image", images: [`/og-${locale}.png`] },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const site = await getSite();
  const international = (await requestMarket()) === "international";
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const tc = await getTranslations({ locale, namespace: "common" });
  // Russian headlines paint in Onest: preload it so the H1 (the LCP) does not wait for a late font request.
  if (locale === "ru") preload(ONEST_CYRILLIC, { as: "font", type: "font/woff2", crossOrigin: "anonymous", fetchPriority: "high" });

  return (
    <html lang={locale} className={outfit.variable} suppressHydrationWarning>
      <body>
        {process.env.NEXT_PUBLIC_PERF_DEBUG === "1" ? (
          <Script id="lcp-debug" strategy="beforeInteractive" nonce={nonce}>{`window.__lcp=[];try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){window.__lcp.push({t:Math.round(e.startTime),size:e.size,tag:e.element?e.element.tagName:null,cls:e.element?String(e.element.className).slice(0,40):null,url:(e.url||'').slice(-40)})})}).observe({type:'largest-contentful-paint',buffered:true})}catch(e){}`}</Script>
        ) : null}
        {process.env.NODE_ENV === "development" ? (
          <Script id="dev-err" strategy="beforeInteractive" nonce={nonce}>{`window.__errs=[];(function(){function push(m){try{window.__errs.push(String(m).slice(0,6000))}catch(e){}}var o=console.error;console.error=function(){push(Array.prototype.map.call(arguments,function(a){return typeof a==='string'?a:(a&&a.message)||String(a)}).join(' '));o.apply(console,arguments)};window.addEventListener('error',function(e){push('[error] '+((e.error&&e.error.message)||e.message))});window.addEventListener('unhandledrejection',function(e){push('[rejection] '+((e.reason&&e.reason.message)||e.reason))})})();`}</Script>
        ) : null}
        <NextIntlClientProvider messages={messages}>
          <ConsentProvider>
          <SiteProvider site={site}>
          <BrandProvider>
          <MotionProvider>
            <a href="#main" className="skip-link">{tc("skip")}</a>
            <SmoothScroll />
            <Nav showLanguages={!international} />
            <main id="main">{children}</main>
            <Footer showLanguages={!international} showBlog={!international} />
            <StickyCta />
            <MessengerPill />
            <ExitIntent />
            <BookingModal />
          </MotionProvider>
          </BrandProvider>
          </SiteProvider>
          <AnalyticsConsent url={umami.url} websiteId={umami.websiteId} nonce={nonce} />
          </ConsentProvider>
        </NextIntlClientProvider>
        <OrganizationSchema locale={locale as Locale} />
      </body>
    </html>
  );
}
