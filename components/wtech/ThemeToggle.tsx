"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useLocale } from "next-intl";
export function ThemeToggle() {
  const [light, setLight] = useState(false);
  const locale = useLocale();
  useEffect(() => {
    setLight(document.documentElement.dataset.theme === "light");
  }, []);
  const label =
    locale === "ro"
      ? light
        ? "Activează tema întunecată"
        : "Activează tema luminoasă"
      : locale === "ru"
        ? light
          ? "Включить тёмную тему"
          : "Включить светлую тему"
        : light
          ? "Switch to dark theme"
          : "Switch to light theme";
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={label}
      aria-pressed={light}
      onClick={() => {
        const next = !light;
        setLight(next);
        document.documentElement.dataset.theme = next ? "light" : "dark";
        try {
          localStorage.setItem("wtech-appearance", next ? "light" : "dark");
        } catch {}
      }}
    >
      {light ? (
        <Moon size={20} aria-hidden="true" />
      ) : (
        <Sun size={20} aria-hidden="true" />
      )}
    </button>
  );
}
