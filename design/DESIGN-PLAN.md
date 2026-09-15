# wtech.md design plan

## Design Read

Reading this as: B2B agency landing for Moldovan SRL owners (RO/RU/EN), with a premium dark product-led language, leaning toward Next.js + Tailwind v4 tokens + Outfit + GSAP/Motion orchestration, where the site itself is the demo.

## Dials

- `DESIGN_VARIANCE: 8` (asymmetric, left-aligned hero text column at 540px, 1200px container, big empty zones)
- `MOTION_INTENSITY: 7` (orchestrated load timeline, scrub pins on hero/services/automations, typewriters, draggable kanban; reduced-motion gives posters and stills)
- `VISUAL_DENSITY: 3` (160px desktop / 96px mobile section padding, rows separated by 1px lines, cards only inside the CRM demo)

Where the brief conflicts with the taste skill, the brief wins: true black `#000000` background, the em-dash character where the brief's literal copy uses it (hero subline, CRM title), Lucide for 16px functional icons, Framer Motion (`motion` package) plus GSAP in separate leaf components.

## Pass 1: the plan

### Foundation
- Stack: Next.js 15 App Router, TypeScript, Tailwind v4 (`@theme` tokens from §4), `motion/react` for layout/shared transitions, GSAP + ScrollTrigger for pins and scrubs, Lenis for smoothing (`lerp 0.1`), Recharts for the CRM chart and SEO sparkline, dnd-kit for the kanban, next-intl for RO/RU/EN.
- Fonts: Outfit 300/400/500/600 self-hosted via `next/font/local` (woff2 in `public/fonts`).
- Tokens: `--bg #000`, `--surface #0A0A0B`, `--border rgba(255,255,255,.08)`, `--text #F5F1EA`, `--text-dim rgba(245,241,234,.56)`, `--violet/--coral/--cyan`, `--grad`, radii 20/12. Gradient only on the mark's glow, the CRM chart stroke, the contact-form progress line, the ROI result underline, the automations path.
- Buttons: cream pill with black text; ghost = 1px border + cream text; hover = brightness 1.02 + 1px lift. Shape lock: pills for interactive, 20px for CRM panels and phone frames, 12px for inputs and kanban cards.
- Type: Outfit 500 headlines, `-0.02em`, sentence case. H1 clamp(40px, 6vw, 72px). No eyebrows anywhere except none; the only numbered sequence is the Process section.

### Homepage sections (layout family per section, so no family repeats)
1. **Preloader** (fixed stage): point of light, W ribbon trace (Higgsfield clip, SVG `stroke-dashoffset` fallback), crossfade to the PNG mark, 160px progress line reflecting font + hero poster + hero video first frame, localised "Se încarcă". Released with Motion `layoutId="mark"` into the hero mark. Once per session, max 1.8 s, skippable.
2. **Nav**: transparent to blurred black, lockup 28px, Servicii / Lucrări / Proces / Prețuri / Contact, `RO · RU · EN`, primary pill. One line, 72px.
3. **Hero** (asymmetric split, 540px text column left, 520px glowing mark right): H1 PAS, subline, primary + ghost CTA, risk-reversal line, three quiet facts. Fold line of six services in `--text-dim`. Scroll pin 150vh: mark scales to 0.55 and travels to the nav lockup; headline fades.
4. **Services** (six pinned rows, BAB): name 32px, "before" line, "after" line, inline text link CTA; right side Higgsfield 4:3 loop crossfading per row; divider draws left to right.
5. **Proof band** (full-width statement over subtle Higgsfield background): three `[[x]]` numbers and one sentence. Build fails on `[[`.
6. **CRM demo** (monitor bezel, real React): sidebar, four stat tiles, Recharts revenue line with gradient stroke drawing on, kanban Nou / Contactat / Ofertă / Câștigat with dnd-kit, "Ana" panel typing today's follow-ups. ±4° tilt on mouse. AIDA title and CTA "Vreau un CRM ca acesta". `crm_demo_interact` on first drag.
7. **AI employees** (two CSS phone frames + calculator below): left chat scrubbed to scroll, right automation toggles with "Rulate azi: 47" count-up; ROI calculator with animated MDL result and gradient underline.
8. **Automations** (horizontal pinned strip): SVG node diagram Lead → CRM → Ofertă → WhatsApp → Factură → Raport, gradient path drawn with scroll, pulse texture masked into the path; three lines on 1C, Facebook Lead Ads, Gmail, WhatsApp Business, Telegram, bănci/PayNet.
9. **Custom software** (full-bleed 16:9 clip + short paragraph): one CTA.
10. **AI SEO** (split: simulated AI answer panel left, ranking mini-dashboard right): typed answer to the localised question, keyword rows with position arrows, "Vizibilitate AI" score with gradient underline, sparkline; three lines; CTA to `/audit`.
11. **Lead magnet** (single row form): URL, email, WhatsApp. Success: "Trimis. Primești auditul mâine."
12. **Process** (numbered 1-4 vertical steps with the 48h promise).
13. **Pricing signals** (three rows, "de la [[price]] MDL" + what's included).
14. **FAQ** (accordion, FAQPage schema, 8 objections).
15. **Contact** (two-step micro-commitment form left, human + channels right).
16. **Footer**: lockup, services, `RO EN RU`, IDNO placeholder, © 2026.
- Persistent: sticky mini-CTA after hero leaves viewport (desktop top-right, mobile bottom bar "Apel" + "WhatsApp"), WhatsApp/Telegram floating pill on mobile with the mark inside, exit-intent on desktop once per session.

### Subpages
`/servicii/[slug]` ×6, `/lucrari` (three Concept entries using the mockups), `/preturi`, `/contact`, `/audit`, `/despre` (entity page), `/blog` with 3 seed posts per locale marked `[[review]]`. Localised slugs via next-intl `pathnames`.

### Assets (all Higgsfield, logged in `design/higgsfield-prompts.md`)
Hero loop + 4 stills, six 4:3 service loops, automations pulse texture, custom-software 16:9 clip, OG backdrop, favicon source, AI SEO backdrops ×2, 404, email header, three section backgrounds, contact abstract, preloader reveal clip. WebM VP9 + MP4 H.264, ≤ 1080p, ≤ 6 s, poster JPG, ≤ 1.5 MB.

### Motion (§8 of the brief)
Hero load timeline: glow 1.2 s, headline words +12px 40 ms stagger, buttons, trust line. Services row pin 60vh with clip-path line reveals. CRM: bezel 0.92→1, rotateX 8°→0°, chart draw, cards drop 60 ms stagger, Ana types. Phones: scrubbed chat, parallax, ROI tween. Automations: horizontal pin, dashoffset draw. Sticky CTA slides in after the hero. Reduced motion: posters/stills, no scrub, 0.6 s preloader.

### Conversion + measurement
Umami events: `cta_call_click`, `cta_whatsapp_click`, `crm_demo_interact`, `roi_calc_used`, `audit_submit`, `form_step1`, `form_submit`. `?v=b` swaps the hero H1 to the benefit-led variant.

## Pass 2: review against the brief and critique

- **Hero fits the fold?** H1 is two lines at 1280px (clamp keeps it ≤ 64px), subline ≤ 20 words in RO (18), CTAs above the fold at 360×640. The three quiet facts are the one small text element allowed; the fold line of six services sits at the bottom edge as the brief demands and is styled as `--text-dim` navigation, not a decoration strip.
- **Layout families**: split hero, pinned rows, full-width statement, framed product, phone pair + calculator, horizontal strip, full-bleed media, split panels, single-row form, numbered vertical steps, three rows, accordion, two-column contact. Thirteen families for fifteen sections; only "three rows" repeats the row rhythm of services, which the brief explicitly wants.
- **Eyebrows**: zero. Section headings carry the message.
- **Gradient discipline**: checked per component in pre-flight; buttons, headings and backgrounds never use it.
- **CTA intent**: primary "Programează un apel de 30 min" is the only call intent; contextual CTAs under each section are different intents (see CRM, see phones, get the audit). The audit CTA appears twice (lead magnet, footer) as the brief asks; label is identical both times.
- **Fake numbers**: none. Every unknown number is a `[[x]]` placeholder and `scripts/check-placeholders.mjs` fails the build if any remains. Company names in the CRM demo are plausible Moldovan SRL names, labelled as demo data in code.
- **Performance risk**: three pinned sections plus Lenis. Mitigation: pins created in separate GSAP contexts with `invalidateOnRefresh`, hero video is the only eager media, everything else `preload="none"` with posters, GSAP/Recharts/dnd-kit loaded through `next/dynamic` below the fold, JS budget checked with the bundle analyzer.
- **LCP**: the H1 renders under the fixed preloader and is the LCP element; preloader is decorative overlay only.
- **Mobile**: 360px checked for the pill, sticky bar, form, and phone frames (stack vertically). Kanban drag works with touch sensors and 44px targets.
- **i18n**: every string in `messages/{ro,ru,en}.json`; `scripts/check-i18n.mjs` fails on missing keys; RU written natively in the вы register.

## Pre-flight check (run before every UI commit)

See `design/PREFLIGHT.md` for the checklist and the latest run.
