"use client";

import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("./motion-features").then((res) => res.default);

/** Strict LazyMotion: components use the `m` element so layout/drag/gesture code arrives in an async chunk. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
