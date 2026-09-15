"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { m, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { Wordmark } from "@/components/ui/Wordmark";
import { useBrand } from "@/components/preloader/BrandContext";
import { useLocalizedHref } from "./useLocalizedHref";
import { track } from "@/lib/analytics";

const LANG_ORDER: Locale[] = ["ro", "ru", "en"]; // RO first, RU second: the order clients expect

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const { openBooking } = useBrand();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 24));

  // mobile menu: Escape closes and returns focus to the button; Tab stays inside while open
  useEffect(() => {
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); menuBtn.current?.focus(); return; }
      if (e.key !== "Tab" || !menuRef.current) return;
      const items = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a, button")).filter((el) => !el.hasAttribute("disabled"));
      const firstEl = items[0], lastEl = items[items.length - 1];
      if (!firstEl || !lastEl) return;
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const items: Array<{ href: "/servicii" | "/lucrari" | "/preturi" | "/contact" | { pathname: "/"; hash?: string }; label: string; anchor?: string }> = [
    { href: "/servicii", label: t("services") },
    { href: "/lucrari", label: t("work") },
    { href: { pathname: "/" }, label: t("process"), anchor: "#proces" },
    { href: "/preturi", label: t("pricing") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        solid || open ? "bg-black/70 backdrop-blur-xl border-b border-line" : "bg-transparent border-b border-transparent"
      }`}
      style={{ height: "var(--nav-h)" }}
    >
      <nav className="container-x h-full flex items-center justify-between gap-6" aria-label="Main">
        <Link href="/" className="shrink-0" title={t("home")}>
          <Wordmark size={28} id="nav-mark" />
        </Link>

        <ul className="hidden lg:flex items-center gap-7 text-[15px]">
          {items.map((it) => (
            <li key={it.label}>
              {it.anchor ? (
                <a href={it.anchor} className="text-dim hover:text-ink transition-colors">{it.label}</a>
              ) : (
                <Link href={it.href as "/servicii"} className={`transition-colors ${pathname === it.href ? "text-ink" : "text-dim hover:text-ink"}`}>
                  {it.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-5">
          <LangSwitch current={locale} />
          <button type="button" className="btn btn-primary btn-sm" onClick={() => { track("cta_call_click", { place: "nav" }); openBooking(); }}>
            {t("cta")}
          </button>
        </div>

        <button
          ref={menuBtn}
          type="button"
          className="lg:hidden inline-grid place-items-center w-11 h-11 rounded-full border border-line text-ink"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t("close") : t("menu")}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <m.div
            ref={menuRef}
            id="mobile-menu"
            className="lg:hidden absolute inset-x-0 top-full bg-black/95 backdrop-blur-xl border-b border-line"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="container-x py-4 divide-y divide-white/10">
              {items.map((it) => (
                <li key={it.label}>
                  {it.anchor ? (
                    <a href={it.anchor} className="block py-4 text-lg" onClick={() => setOpen(false)}>{it.label}</a>
                  ) : (
                    <Link href={it.href as "/servicii"} className="block py-4 text-lg" onClick={() => setOpen(false)}>{it.label}</Link>
                  )}
                </li>
              ))}
              <li className="py-4 flex items-center justify-between gap-4">
                <LangSwitch current={locale} />
                <button type="button" className="btn btn-primary btn-sm" onClick={() => { setOpen(false); track("cta_call_click", { place: "nav-mobile" }); openBooking(); }}>
                  {t("cta")}
                </button>
              </li>
            </ul>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

export function LangSwitch({ current, className = "" }: { current: Locale; className?: string }) {
  const hrefFor = useLocalizedHref(current);
  const t = useTranslations("nav");
  return (
    <ul className={`flex items-center gap-1 text-[13px] tracking-wide ${className}`} aria-label={t("language")}>
      {LANG_ORDER.filter((l) => locales.includes(l)).map((l, i) => (
        <li key={l} className="flex items-center">
          {i > 0 ? <span className="text-dim mx-1" aria-hidden="true">·</span> : null}
          <Link
            href={hrefFor(l)}
            locale={l}
            hrefLang={l}
            aria-current={l === current ? "true" : undefined}
            className={`px-1 py-2 uppercase transition-colors ${l === current ? "text-ink" : "text-dim hover:text-ink"}`}
            onClick={() => {
              try { document.cookie = `wtech_locale=${l}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`; } catch {}
            }}
          >
            {l}
          </Link>
        </li>
      ))}
    </ul>
  );
}
