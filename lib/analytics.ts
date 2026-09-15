export type EventName =
  | "cta_call_click"
  | "cta_whatsapp_click"
  | "crm_demo_interact"
  | "roi_calc_used"
  | "audit_submit"
  | "form_step1"
  | "form_submit"
  | "exit_intent_shown"
  | "hero_variant"
  | "chat_open"
  | "chat_message";

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, unknown>) => void };
    __wtechEvents?: Array<{ name: string; data?: Record<string, unknown>; t: number }>;
  }
}

/** Fires an Umami event; also mirrors into window.__wtechEvents so QA can assert without a network. */
export function track(name: EventName, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  (window.__wtechEvents ??= []).push({ name, data, t: Date.now() });
  try {
    window.umami?.track(name, data);
  } catch {
    /* analytics must never break the UI */
  }
}
