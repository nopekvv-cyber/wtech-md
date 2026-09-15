# Pre-flight check (design-taste-frontend §14), run before every UI commit

Dials: `DESIGN_VARIANCE: 8` · `MOTION_INTENSITY: 7` · `VISUAL_DENSITY: 3`. Brief overrides the skill where they conflict (true black, the brief's literal em-dash copy, Lucide 16px icons).

## Run 2026-09-12 (after the first full visual pass at 1280×800 and 360×640)

| Check | Status | Note |
|---|---|---|
| Design Read declared | ✓ | design/DESIGN-PLAN.md |
| Dial values explicit | ✓ | 8 / 7 / 3 from the brief |
| Design system honest | ✓ | Tailwind v4 tokens + Motion + GSAP, no UI kit |
| Em-dashes | ✓ (brief) | Only in the brief's literal strings: hero sub, CRM title (RO/RU/EN). None elsewhere in copy or UI |
| Page theme lock | ✓ | Single dark theme, backgrounds are near-black Higgsfield bleeds |
| Colour consistency | ✓ | Cream on black; gradient only on mark glow, CRM chart stroke, contact progress line, ROI underline, automations path, SEO visibility underline |
| Shape lock | ✓ | Pills for interactive, 20px panels/bezel, 12px inputs/cards |
| Button contrast | ✓ | Cream pill + black text (>15:1); ghost cream on black |
| CTA wrap | ✓ | Longest label "Programează un apel de 30 min" fits on one line at 1024+ |
| Form contrast | ✓ | Placeholders 40% cream on surface (4.6:1), labels 56% |
| Serif discipline | ✓ | Outfit only (+ Onest for Cyrillic glyphs) |
| Hero fits viewport | ✓ | 3 lines at 1280 (RO headline is 56 chars), CTAs above the fold at 360×640 after compacting the mark to 128px |
| Hero top padding | ✓ | nav height only |
| Hero stack | ✓ (brief) | H1, sub, CTAs, risk line + three quiet facts required by the brief; fold line is navigation, hidden < 640px |
| Eyebrow count | ✓ | 0 |
| Split-header ban | ✓ | Headlines stack over body; FAQ uses a 4/8 split with the accordion as the right column |
| Zigzag cap | ✓ | Only /lucrari alternates (3 rows), homepage never |
| Duplicate CTA intent | ✓ | One call label; section CTAs are distinct intents; audit CTA identical in lead magnet, footer, exit |
| Logo wall | n/a | None (no invented clients) |
| Copy self-audit | ✓ | RO/RU/EN read natively; check-i18n rejects untranslated RU |
| Motion motivated | ✓ | Preloader = loader + brand; hero pin = mark handoff; services pin = one visual per row; CRM tilt = product feel; chat scrub = story; ROI tween = feedback; automations draw = the flow itself |
| Marquee | ✓ | none |
| Nav one line ≤ 80px | ✓ | 72px desktop, 64px mobile |
| Layout families | ✓ | 13 families across 15 sections |
| Real images | ✓ | Every visual is a Higgsfield generation or the real mark |
| No fake screenshots | ✓ | CRM and phones are real React, not images |
| Reduced motion | ✓ | Posters/stills, no pins, 0.6 s preloader, instant typewriters |
| No scroll listeners | ✓ | Motion useScroll, ScrollTrigger, IntersectionObserver only |
| useEffect cleanup | ✓ | gsap.context().revert, IO disconnect, Lenis destroy |
| Empty/loading/error states | ✓ | Forms: sending, sent, error, inline field errors; dynamic sections have height-reserving fallbacks |
| Icons | ✓ (brief) | Lucide 16px functional only |
| Core Web Vitals | ✓ | Lighthouse mobile (simulated slow 4G, 4× CPU) recorded below; first-load JS 169 kB gz |

## Changes after the first review (2026-09-12)
- The 150vh hero pin read as a "big blank space" between the hero and the next section: replaced by a short non-pinned parallax (image drifts and dims, text lifts) so the services start right after the hero. Services rows tightened from 60vh to 52vh.
- Hero visual is now a Higgsfield hero image per breakpoint (PC 16:9 with the mark right over a glossy floor, phone 9:16 with the mark in the top third), drawn with `object-fit: contain` on black so no viewport crops the mark. The preloader mark lands on the image's mark using the measured bounding box (`design/hero-bbox.json`). The hero video loop is retired (files kept in `public/media`).
- Phones: the automations diagram is a vertical flow with a gradient spine instead of a 1200px-wide SVG in a scroll box; hero CTAs stack full-width; the headline starts below the image mark.
- Preloader gained a hard release timeout so a throttled background tab can never hold it.

## Fixes made during the pass
- Sticky desktop CTA duplicated the nav pill under it: removed; the solid nav + pill is the desktop sticky CTA, mobile keeps the bottom bar.
- Services pinned visual mapped to the wrong row after fast scrolls: now picks the row nearest the viewport centre on every update.
- dnd-kit `aria-describedby` ids and Recharts' ResponsiveContainer caused hydration mismatches: fixed with a stable `DndContext id` and mounting the chart after hydration.
- Hero H1 reduced from 64px to 58px max so the RO headline stays at three lines in a 540px column.
- Trimmed transparent padding from the mark for small UI uses (`wtech-mark-ui.png`); the untouched master PNG is still used for the hero and preloader so it matches the Higgsfield frames.

## Lighthouse mobile, production standalone server, 2026-09-12 (final build)

| Run | Perf | A11y | Best practices | SEO | LCP (Lantern, slow 4G) | LCP observed | CLS | TBT | FCP | LCP element |
|---|---|---|---|---|---|---|---|---|---|---|
| en-services-ai-seo | 94 | 100 | 100 | 100 | 2.97 s | 89 ms | 0.007 | 112 ms | 0.91 s | video.w-full |
| home-run2 | 88 | 100 | 100 | 100 | 3.90 s | 126 ms | 0.000 | 28 ms | 0.91 s | h1.text-[clamp(34px,4.6vw,58px)] |
| home-run3 | 88 | 100 | 100 | 100 | 3.85 s | 193 ms | 0.000 | 72 ms | 0.96 s | h1.text-[clamp(34px,4.6vw,58px)] |
| home | 96 | 100 | 100 | 100 | 2.79 s | 186 ms | 0.000 | 44 ms | 0.92 s | h1.text-[clamp(34px,4.6vw,58px)] |
| ru | 87 | 100 | 100 | 100 | 3.98 s | 209 ms | 0.000 | 70 ms | 0.93 s | h1.text-[clamp(34px,4.6vw,58px)] |

Reading the numbers: accessibility, best practices and SEO are 100 on every page. CLS is 0.000 on the homepage and TBT is under 75 ms everywhere. First-load JS is 169 kB gzipped (budget 180). The LCP element is the hero H1 on phones, painted at about 130 to 190 ms observed. Lighthouse's Lantern simulation of that paint is bimodal on identical builds: 2.8 s (score 96) when the JS chunk requests had not started before the observed paint, 3.9 s (score 88) when they had, because Lantern then counts the whole 169 kB script download in the LCP graph. Five runs of the homepage gave 96, 88, 88, 96, 88. The remaining lever is the fixed React + Next runtime (~100 kB gz), not page code. Fonts are preloaded (Outfit; Onest only on RU), the mark image is preloaded at low priority, and hero media only attaches after `document.fonts.ready` so nothing competes with the H1 font.

## After the hero-image change (2026-09-12, later)
Homepage Lighthouse mobile after replacing the hero loop with the generated hero images: CLS 0.000, TBT under 40 ms, LCP element = the phone hero image (observed ~100 ms), first-load JS unchanged at 169 kB gz. Performance keeps the same simulator bimodality (96 / 87 on identical runs). Inlining the phone WebP into the HTML was tried and reverted: it did not remove the bimodality and added 34 kB of JS.
