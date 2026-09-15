"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type BrandState = {
  /** true once the preloader has released (or was skipped) */
  ready: boolean;
  /** true when the preloader should be shown this session */
  showLoader: boolean;
  release: () => void;
  bookingOpen: boolean;
  openBooking: () => void;
  closeBooking: () => void;
};

const Ctx = createContext<BrandState | null>(null);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  // SSR renders as "not ready, no loader"; the client decides on mount whether the loader runs.
  const [showLoader, setShowLoader] = useState(false);
  const [ready, setReady] = useState(false);
  const [decided, setDecided] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("wtech_seen") === "1";
    } catch {
      seen = true;
    }
    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isReload = navEntry?.type === "reload";
    if (seen && !isReload) {
      setReady(true);
    } else {
      setShowLoader(true);
    }
    setDecided(true);
  }, []);

  const release = useCallback(() => {
    try {
      sessionStorage.setItem("wtech_seen", "1");
    } catch {}
    setShowLoader(false);
    setReady(true);
  }, []);

  const value = useMemo<BrandState>(
    () => ({
      ready: decided ? ready : false,
      showLoader: decided ? showLoader : false,
      release,
      bookingOpen,
      openBooking: () => setBookingOpen(true),
      closeBooking: () => setBookingOpen(false),
    }),
    [decided, ready, showLoader, release, bookingOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBrand() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBrand outside BrandProvider");
  return v;
}
