"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// Below-the-fold sections that carry heavy deps (recharts, dnd-kit, GSAP pins). They are client-only chunks that
// load when the user is within ~900px of them, so the first-load JS stays inside the budget.
const CrmDemoImpl = dynamic(() => import("@/components/crm/CrmDemo").then((m) => m.CrmDemo), { ssr: false });
const AiEmployeesImpl = dynamic(() => import("@/components/sections/AiEmployees").then((m) => m.AiEmployees), { ssr: false });
const AutomationsImpl = dynamic(() => import("@/components/sections/Automations").then((m) => m.Automations), { ssr: false });
const AiSeoImpl = dynamic(() => import("@/components/sections/AiSeo").then((m) => m.AiSeo), { ssr: false });

function Near({ id, minHeight, children }: { id: string; minHeight: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setNear(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: "900px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  // the id anchors (#crm, #ai, ...) live on the placeholder so nav links work before the chunk arrives
  return <div ref={ref} id={near ? undefined : id} style={near ? undefined : { minHeight }}>{near ? children : null}</div>;
}

export const CrmDemo = () => <Near id="crm" minHeight="100vh"><CrmDemoImpl /></Near>;
export const AiEmployees = () => <Near id="ai" minHeight="100vh"><AiEmployeesImpl /></Near>;
export const Automations = () => <Near id="automatizari" minHeight="80vh"><AutomationsImpl /></Near>;
export const AiSeo = () => <Near id="ai-seo" minHeight="80vh"><AiSeoImpl /></Near>;
