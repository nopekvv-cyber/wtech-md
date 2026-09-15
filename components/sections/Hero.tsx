"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { m, useReducedMotion } from "framer-motion";
import { useBrand } from "@/components/preloader/BrandContext";
import { serviceKeys } from "@/lib/services";
import { track } from "@/lib/analytics";

/**
 * Hero images (Higgsfield, the real mark composited by the model from the reference):
 * PC 16:9 with the ribbon in the right half over a glossy floor, phone 9:16 with the ribbon in the top third.
 * Both are drawn with object-fit: contain on pure black, so no viewport ever crops the mark.
 * The fractions below are the mark's bounding box inside each image (design/hero-bbox.json).
 */
const PC = { src: "/media/hero-pc", widths: [1280, 1920, 2688], ratio: 1.7684, mark: { l: 0.497, t: 0.248, r: 0.944, b: 0.645 } };
const PHONE = { src: "/media/hero-phone", widths: [720, 1080, 1520], ratio: 0.5655, mark: { l: 0.109, t: 0.114, r: 0.9, b: 0.393 } };
const LG = 1024; // below this the phone composition is used (portrait tablets included)

type Box = { left: number; top: number; width: number; height: number };

/** Where the contained image (and its mark) lands inside a container of w×h. */
function markBox(w: number, h: number, mobile: boolean): Box {
  const img = mobile ? PHONE : PC;
  let iw: number, ih: number;
  if (w / h > img.ratio) { ih = h; iw = h * img.ratio; } else { iw = w; ih = w / img.ratio; }
  // desktop: right-centre; phone: top-centre
  const x = mobile ? (w - iw) / 2 : w - iw;
  const y = mobile ? 0 : (h - ih) / 2;
  return { left: x + img.mark.l * iw, top: y + img.mark.t * ih, width: (img.mark.r - img.mark.l) * iw, height: (img.mark.b - img.mark.t) * ih };
}

type Intro = "visible" | "hidden" | "enter";
function useIntro(): Intro {
  const { showLoader, ready } = useBrand();
  const reduce = useReducedMotion();
  if (reduce) return "visible";
  if (showLoader) return "hidden";
  if (ready) return "enter";
  return "visible";
}

function Words({ text, delay, intro }: { text: string; delay: number; intro: Intro }) {
  const words = text.split(" ");
  // One text block for the LCP; split into words only while the intro runs (inline-block + baseline keeps the metrics).
  if (intro === "visible") return <>{text}</>;
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <m.span
            className="inline-block align-baseline"
            initial={false}
            animate={intro === "hidden" ? { y: 12, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={intro === "hidden" ? { duration: 0 } : { duration: 0.55, delay: intro === "enter" ? delay + i * 0.04 : 0, ease: [0.16, 1, 0.3, 1] }}
          >
            {w}
          </m.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const t = useTranslations("hero");
  const { ready, openBooking } = useBrand();
  const intro = useIntro();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pictureRef = useRef<HTMLDivElement>(null);
  const [handoffDone, setHandoffDone] = useState(false);
  const [box, setBox] = useState<Box | null>(null);

  // ?v=b swaps the headline for the benefit-led variant, read after mount so the H1 stays in the static HTML (it is the LCP).
  const [variantB, setVariantB] = useState(false);
  useEffect(() => {
    try { setVariantB(new URLSearchParams(window.location.search).get("v") === "b"); } catch {}
    if (variantB) track("hero_variant", { v: "b" });
  }, [variantB]);

  // Measure where the image's mark sits so the preloader mark can land exactly on it.
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const isMobile = window.innerWidth < LG;
      setBox(markBox(r.width, r.height, isMobile));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Repeat visits skip the preloader: nothing to hand off.
  useEffect(() => {
    if (!ready || handoffDone) return;
    const id = setTimeout(() => setHandoffDone(true), 1200);
    return () => clearTimeout(id);
  }, [ready, handoffDone]);

  // No scroll-driven motion between the hero and the sections below (removed after review).

  const facts = [t("facts.city"), t("facts.reply"), t("facts.price")];
  const h1 = variantB ? t("h1b") : t("h1");
  const fade = (delay: number) => ({
    initial: false as const,
    animate: intro === "hidden" ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 },
    transition: intro === "hidden" ? { duration: 0 } : { duration: 0.5, delay: intro === "enter" ? delay : 0, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  });
  const pcSet = PC.widths.map((w) => `${PC.src}-${w}.webp ${w}w`).join(", ");
  const phoneSet = PHONE.widths.map((w) => `${PHONE.src}-${w}.webp ${w}w`).join(", ");

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-bg">
      {/* backdrop: the mark lives in the image; contain on black never crops it */}
      <div ref={pictureRef} className="absolute inset-0 will-change-transform" style={{ opacity: intro === "hidden" ? 0 : 1, transition: "opacity 600ms ease" }} aria-hidden={handoffDone ? undefined : "true"}>
        <picture>
          <source media={`(max-width: ${LG - 1}px)`} type="image/webp" srcSet={phoneSet} sizes="100vw" />
          <source type="image/webp" srcSet={pcSet} sizes="100vw" />
          <img
            data-hero
            src="/media/hero-pc.jpg"
            alt={t("videoAlt")}
            width={2688}
            height={1520}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain object-[top_center] lg:object-[right_center]"
            draggable={false}
          />
        </picture>
      </div>

      {/* the preloader's mark flies here and fades into the image's own mark */}
      {ready && !handoffDone && box ? (
        <m.div
          layoutId="brand-mark"
          className="absolute z-[1] pointer-events-none"
          style={{ left: box.left, top: box.top, width: box.width, height: box.height }}
          transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.9 }}
          onLayoutAnimationComplete={() => setHandoffDone(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/wtech-mark-640.webp" alt="" className="w-full h-full object-contain" draggable={false} />
        </m.div>
      ) : null}

      <div className="container-x relative flex-1 grid lg:grid-cols-12 items-start lg:items-center pb-10 lg:pb-0">
        <div ref={textRef} className="pt-[calc(69.5vw+28px)] lg:pt-0 lg:col-span-6 max-w-[540px]">
          <h1 className="text-[clamp(34px,4.6vw,58px)] leading-[1.04]">
            <Words text={h1} delay={0.3} intro={intro} />
          </h1>
          <m.p className="text-dim text-[16px] md:text-[19px] mt-4 md:mt-6 max-w-[520px] text-balance" {...fade(0.75)}>{t("sub")}</m.p>
          <m.div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-3" {...fade(0.95)}>
            <button type="button" className="btn btn-primary" onClick={() => { track("cta_call_click", { place: "hero" }); openBooking(); }}>
              {t("primary")}
            </button>
            <a href="#crm" className="btn btn-ghost">{t("ghost")}</a>
          </m.div>
          <m.div {...fade(1.15)}>
            <p className="text-dim text-[14px] mt-4">{t("risk")}</p>
            <ul className="mt-5 md:mt-8 flex flex-wrap gap-x-5 gap-y-2 text-[13px] md:text-[14px] text-dim">
              {facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </m.div>
        </div>
      </div>

      {/* fold line */}
      <div className="container-x relative pb-6 lg:pb-8 hidden sm:block">
        <ul className="hairline pt-5 flex flex-wrap gap-x-8 gap-y-2 text-[14px] text-dim">
          {serviceKeys.map((k) => (
            <li key={k}>
              <a href={`#svc-${k}`} className="hover:text-ink transition-colors">{t(`fold.${k}`)}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
