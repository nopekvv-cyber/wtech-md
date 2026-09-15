"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useBrand } from "./BrandContext";
import { MARK_PATH, MARK_VIEWBOX } from "./MarkPath";

const MAX_MS = 1800;
const REDUCED_MS = 600;

/**
 * Brand moment + real loader. Fixed on top of the already-rendered hero (so LCP stays the H1).
 * Holds until Outfit + hero poster + hero video first frame are ready, capped at 1.8 s, skippable.
 * The mark carries layoutId="brand-mark"; the hero renders the same layoutId once released,
 * so Motion animates the mark from the stage into the hero position in one continuous shot.
 */
export function Preloader() {
  const { showLoader, release } = useBrand();
  const reduce = useReducedMotion();
  const t = useTranslations("preloader");
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"trace" | "fill">("trace");
  const [clipOk, setClipOk] = useState<boolean | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let done = false;
    const go = () => { if (!done) { done = true; setFontsReady(true); } };
    (document.fonts?.ready ?? Promise.resolve()).then(go, go);
    const t = setTimeout(go, 600);
    return () => clearTimeout(t);
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const released = useRef(false);

  useEffect(() => {
    if (!showLoader) return;
    let cancelled = false;
    const start = performance.now();
    const doRelease = () => {
      if (released.current || cancelled) return;
      released.current = true;
      release();
    };

    // Asset readiness: font + hero image. Each contributes half.
    const parts = { font: 0, poster: 0, video: 1 };
    const bump = () => setProgress(Math.min(1, (parts.font + parts.poster) / 2));

    document.fonts?.ready.then(() => { parts.font = 1; bump(); }).catch(() => { parts.font = 1; bump(); });
    const heroImg = document.querySelector<HTMLImageElement>("img[data-hero]");
    if (heroImg && heroImg.complete && heroImg.naturalWidth > 0) { parts.poster = 1; bump(); }
    else if (heroImg) {
      const onImg = () => { parts.poster = 1; bump(); };
      heroImg.addEventListener("load", onImg, { once: true });
      heroImg.addEventListener("error", onImg, { once: true });
    } else { parts.poster = 1; bump(); }

    const minMs = reduce ? REDUCED_MS : 1300; // let the trace finish before releasing
    const tick = setInterval(() => {
      const elapsed = performance.now() - start;
      const done = parts.font + parts.poster + parts.video === 3;
      if (elapsed >= MAX_MS || (done && elapsed >= minMs)) {
        clearInterval(tick);
        doRelease();
      }
    }, 50);

    const fill = setTimeout(() => setPhase("fill"), reduce ? 0 : 1100);
    const hardCap = setTimeout(doRelease, MAX_MS + 50); // belt and braces: a throttled tab must still release
    const skip = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key === "Tab") return;
      doRelease();
    };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      cancelled = true;
      clearInterval(tick);
      clearTimeout(fill);
      clearTimeout(hardCap);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, [showLoader, release, reduce]);

  return (
    <AnimatePresence>
      {showLoader ? (
        <m.div
          className="preloader-stage"
          role="status"
          aria-live="polite"
          aria-label={t("loading")}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.05 } }}
        >
          <div className="relative flex flex-col items-center gap-10">
            {/* on phones the stage mark stays smaller than the H1 block so the H1 remains the LCP element */}
            <m.div
              layoutId="brand-mark"
              className="relative w-[min(44vw,180px)] md:w-[320px] aspect-square"
              transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.9 }}
            >
              {/* Higgsfield reveal clip; SVG trace is the fallback and the first thing painted */}
              {!reduce && clipOk !== false ? (
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-contain"
                  muted
                  playsInline
                  autoPlay
                  preload="auto"
                  poster="/media/hero-mark.jpg"
                  onCanPlay={() => setClipOk(true)}
                  onError={() => setClipOk(false)}
                  aria-hidden="true"
                >
                  {fontsReady ? (
                    <>
                      <source src="/media/preloader.webm" type="video/webm" />
                      <source src="/media/preloader.mp4" type="video/mp4" />
                    </>
                  ) : null}
                </video>
              ) : null}
              <svg
                viewBox={MARK_VIEWBOX}
                className="absolute inset-[12%] w-[76%] h-[76%]"
                style={{ opacity: clipOk ? 0 : 1, transition: "opacity 300ms" }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="pl-grad" x1="56" y1="70" x2="456" y2="250" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#6E3BFF" />
                    <stop offset="0.5" stopColor="#FF7A6B" />
                    <stop offset="1" stopColor="#35E3F0" />
                  </linearGradient>
                  <filter id="pl-glow" x="-30%" y="-40%" width="160%" height="180%">
                    <feGaussianBlur stdDeviation="10" />
                  </filter>
                </defs>
                <m.path
                  d={MARK_PATH}
                  stroke="url(#pl-grad)"
                  strokeWidth="68"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  filter="url(#pl-glow)"
                  initial={{ pathLength: 0, opacity: 0.35 }}
                  animate={{ pathLength: 1, opacity: 0.55 }}
                  transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.3, ease: "easeInOut" }}
                />
                <m.path
                  d={MARK_PATH}
                  stroke="url(#pl-grad)"
                  strokeWidth="68"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : 0.3, ease: "easeInOut" }}
                />
              </svg>
              {/* the real PNG mark crossfades in once the trace completes */}
              <m.img
                src="/brand/wtech-mark-640.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-contain"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={phase === "fill" ? { opacity: 1, scale: [0.98, 1.02, 1] } : { opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                draggable={false}
              />
              {/* single point of light at t=0 */}
              {!reduce ? (
                <m.span
                  className="absolute left-1/2 top-1/2 w-[2px] h-[2px] rounded-full bg-ink"
                  style={{ boxShadow: "0 0 24px 6px rgba(110,59,255,0.6), 0 0 48px 12px rgba(255,122,107,0.35), 0 0 72px 18px rgba(53,227,240,0.25)" }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0] }}
                  transition={{ duration: 0.5, times: [0, 0.6, 1] }}
                />
              ) : null}
            </m.div>

            {/* 1px cream progress line, 160px, gradient runs along it as it fills */}
            <div className="relative h-px w-[160px] bg-white/10 overflow-hidden" aria-hidden="true">
              <div className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${Math.round(progress * 100)}%`, transition: "width 200ms linear" }} />
              <div className="absolute inset-y-0 left-0 w-[160px]" style={{ background: "var(--grad)", transform: `translateX(${-160 + progress * 160}px)`, transition: "transform 200ms linear", opacity: 0.9 }} />
            </div>
            <span className="text-dim text-[12px] tracking-wide">{t("loading")}</span>
          </div>
          <button type="button" onClick={release} className="absolute bottom-6 right-6 text-dim text-[13px] hover:text-ink">
            {t("skip")}
          </button>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
