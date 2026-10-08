"use client";

import { useEffect } from "react";
import { loadGsap } from "@/lib/gsap";

/** Lenis (lerp 0.1) wired to GSAP's ticker so ScrollTrigger and Lenis share one frame. Off under reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || window.matchMedia("(pointer: coarse)").matches) return;
    let cleanup: (() => void) | undefined;
    let disposed = false;
    Promise.all([import("lenis"), loadGsap()]).then(([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
      if (disposed) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    (window as unknown as { __lenis?: unknown }).__lenis = lenis;
    (window as unknown as { __ST?: typeof ScrollTrigger }).__ST = ScrollTrigger; // inspected by tests/smoke.spec.ts
    // Lazy sections and media change the document height after the triggers were measured: refresh on resize.
    let t: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); }, 120);
    });
    ro.observe(document.body);
    ro.observe(document.documentElement);
    const onLoad = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); };
    window.addEventListener("load", onLoad);
    cleanup = () => {
      gsap.ticker.remove(raf);
      ro.disconnect();
      window.removeEventListener("load", onLoad);
      clearTimeout(t);
      lenis.destroy();
      delete (window as unknown as { __lenis?: unknown }).__lenis;
    };
    });
    return () => { disposed = true; cleanup?.(); };
  }, []);
  return null;
}
