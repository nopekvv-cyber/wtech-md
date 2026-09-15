import localFont from "next/font/local";

// Outfit covers Latin (RO/EN). Outfit has no Cyrillic, so Onest (SIL OFL, geometric, same weight range)
// serves Russian glyphs per-glyph through the font stack. One visual family, no layout shift.
export const outfit = localFont({
  src: [
    { path: "../public/fonts/outfit-latin.woff2", weight: "300 700", style: "normal" },
    { path: "../public/fonts/outfit-latin-ext.woff2", weight: "300 700", style: "normal" },
  ],
  variable: "--font-outfit",
  display: "swap",
  preload: true,
  declarations: [{ prop: "unicode-range", value: "U+0000-00FF, U+0100-024F, U+0218-021B, U+1E00-1EFF, U+2000-206F, U+20AC, U+2122" }],
});

// Onest (Cyrillic) is declared in app/globals.css from /public/fonts so Russian pages can preload it by a stable URL.
export const ONEST_CYRILLIC = "/fonts/onest-cyrillic.woff2";
