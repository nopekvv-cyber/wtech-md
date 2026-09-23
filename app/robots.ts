import type { MetadataRoute } from "next";
import { requestOrigin } from "@/lib/market-server";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await requestOrigin();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] },
      // Search and answer-engine crawlers are named explicitly so the intended policy is unambiguous.
      { userAgent: "Googlebot", allow: "/", disallow: ["/api/", "/admin"] },
      { userAgent: "Bingbot", allow: "/", disallow: ["/api/", "/admin"] },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/api/", "/admin"] },
      { userAgent: "ChatGPT-User", allow: "/", disallow: ["/api/", "/admin"] },
      // Training crawlers are independent of search visibility, so keep search access without opting content into training.
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/", disallow: ["/api/", "/admin"] },
      { userAgent: "Claude-User", allow: "/", disallow: ["/api/", "/admin"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/api/", "/admin"] },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
