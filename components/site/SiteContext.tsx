"use client";

import { createContext, useContext } from "react";
import type { Site } from "@/lib/settings";

const Ctx = createContext<Site | null>(null);

/** CMS values (contact channels, prices, proof numbers) for client components; provided once by the locale layout. */
export function SiteProvider({ site, children }: { site: Site; children: React.ReactNode }) {
  return <Ctx.Provider value={site}>{children}</Ctx.Provider>;
}

export function useSite(): Site {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSite outside SiteProvider");
  return v;
}
