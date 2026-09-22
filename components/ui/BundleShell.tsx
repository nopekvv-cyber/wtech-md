"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";

type BundleShellProps = {
  children: ReactNode;
  className?: string;
  accent?: "violet" | "coral" | "cyan" | "mix";
  interactive?: boolean;
};

/** Shared WTECH bundle surface: scroll reveal, pointer light and restrained hover depth. */
export function BundleShell({ children, className = "", accent = "mix", interactive = false }: BundleShellProps) {
  const reduce = useReducedMotion();

  function moveLight(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--bundle-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--bundle-y", `${event.clientY - rect.top}px`);
  }

  return (
    <m.div
      className={`bundle-shell bundle-shell--${accent}${interactive ? " bundle-shell--interactive" : ""} ${className}`}
      style={{ "--bundle-x": "50%", "--bundle-y": "40%" } as CSSProperties}
      initial={reduce ? false : { opacity: 0, y: 26, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.025 }}
      whileHover={interactive && !reduce ? { y: -6 } : undefined}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={moveLight}
    >
      <span className="bundle-shell__light" aria-hidden="true" />
      <div className="bundle-shell__content">{children}</div>
    </m.div>
  );
}
