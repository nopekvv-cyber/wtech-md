// GSAP + ScrollTrigger are loaded on demand so they stay out of the first-load bundle.
// Every effect that needs them awaits loadGsap(); the module is cached after the first call.
import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

export type GsapBundle = { gsap: typeof GsapType; ScrollTrigger: typeof ScrollTriggerType };

let cache: Promise<GsapBundle> | null = null;

export function loadGsap(): Promise<GsapBundle> {
  if (!cache) {
    cache = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
      g.gsap.registerPlugin(st.ScrollTrigger);
      return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
    });
  }
  return cache;
}
