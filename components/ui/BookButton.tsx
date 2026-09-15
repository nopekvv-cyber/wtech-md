"use client";

import { useBrand } from "@/components/preloader/BrandContext";
import { track } from "@/lib/analytics";

export function BookButton({ children, className = "btn btn-primary", place }: { children: React.ReactNode; className?: string; place: string }) {
  const { openBooking } = useBrand();
  return (
    <button type="button" className={className} onClick={() => { track("cta_call_click", { place }); openBooking(); }}>
      {children}
    </button>
  );
}
