import type { MetadataRoute } from "next";
import { requestOrigin } from "@/lib/market-server";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await requestOrigin();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] }],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
