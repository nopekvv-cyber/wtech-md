"use client";

import { createContext, useContext } from "react";

const InternationalMarketContext = createContext(false);

export function MarketProvider({ international, children }: { international: boolean; children: React.ReactNode }) {
  return <InternationalMarketContext.Provider value={international}>{children}</InternationalMarketContext.Provider>;
}

export function useInternationalMarket() {
  return useContext(InternationalMarketContext);
}
