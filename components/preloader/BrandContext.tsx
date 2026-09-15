"use client";

import { createContext, useContext, useMemo, useState } from "react";

type BrandState = {
  bookingOpen: boolean;
  openBooking: () => void;
  closeBooking: () => void;
};

const Ctx = createContext<BrandState | null>(null);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);

  const value = useMemo<BrandState>(
    () => ({
      bookingOpen,
      openBooking: () => setBookingOpen(true),
      closeBooking: () => setBookingOpen(false),
    }),
    [bookingOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBrand() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBrand outside BrandProvider");
  return v;
}
