"use client";

import { createContext, useContext, useMemo, useState } from "react";

type BrandState = {
  bookingOpen: boolean;
  bookingContext: {message?:string};
  openBooking: (context?:{message?:string}) => void;
  closeBooking: () => void;
};

const Ctx = createContext<BrandState | null>(null);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingContext,setBookingContext]=useState<{message?:string}>({});

  const value = useMemo<BrandState>(
    () => ({
      bookingOpen,
      bookingContext,
      openBooking: (context={}) => {setBookingContext(context);setBookingOpen(true)},
      closeBooking: () => setBookingOpen(false),
    }),
    [bookingOpen,bookingContext],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBrand() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBrand outside BrandProvider");
  return v;
}
