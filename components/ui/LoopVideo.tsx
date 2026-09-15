"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** basename under /media, e.g. "svc-crm" -> svc-crm.webm / .mp4 / .jpg */
  base: string;
  alt: string;
  className?: string;
  eager?: boolean;
  /** extra attributes for the video element */
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>;
  aspect?: string;
};

/**
 * Lazy looping video with poster. preload="none" unless eager. Falls back to the poster under
 * reduced motion or when autoplay is refused (iOS low-power mode).
 */
export function LoopVideo({ base, alt, className = "", eager = false, videoProps, aspect = "4 / 3" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  // intrinsic size from the aspect ratio so the browser reserves the box before the poster/first frame arrives
  const [aw, ah] = aspect.split("/").map((n) => Number(n.trim()));
  const width = 960;
  const height = Math.round((width * (ah || 3)) / (aw || 4));
  const [fallback, setFallback] = useState(false);
  const [reduce, setReduce] = useState(false);
  // browsers fetch `poster` eagerly even with preload="none"; six section posters competed with the hero image for
  // mobile bandwidth (Lighthouse simulated LCP +1 s). The poster is attached when the loop is near the viewport.
  const [near, setNear] = useState(eager);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setNear(true);
            if (v.preload === "none") v.preload = "auto";
            v.play().catch(() => setFallback(true));
          } else {
            v.pause();
          }
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  if (reduce || fallback) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/media/${base}.jpg`} alt={alt} width={width} height={height} className={className} style={{ aspectRatio: aspect, objectFit: "cover" }} loading={eager ? "eager" : "lazy"} decoding="async" />;
  }

  return (
    <video
      ref={ref}
      width={width}
      height={height}
      className={className}
      style={{ aspectRatio: aspect, objectFit: "cover" }}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      poster={near ? `/media/${base}.jpg` : undefined}
      aria-label={alt}
      {...videoProps}
    >
      <source src={`/media/${base}.webm`} type="video/webm" />
      <source src={`/media/${base}.mp4`} type="video/mp4" />
    </video>
  );
}
