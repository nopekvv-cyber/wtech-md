"use client";

import { useEffect, useState } from "react";

/** Types `text` when `start` is true. Respects reduced motion (renders instantly). */
export function Typewriter({ text, start, speed = 18, className = "", onDone }: { text: string; start: boolean; speed?: number; className?: string; onDone?: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(text.length); onDone?.(); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) { clearInterval(id); onDone?.(); }
    }, speed);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, text, speed]);
  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}</span>
      {n < text.length && start ? <span aria-hidden="true" className="inline-block w-[1px] h-[1em] align-[-0.15em] bg-ink/70 ml-px animate-pulse" /> : null}
    </span>
  );
}
