# WTECH public asset register

Last reviewed: 23 September 2026

This register records what the repository contains. It is not proof that WTECH owns every asset. Keep invoices, source exports, generation receipts, stock licences, model releases and provider terms with the project records.

| Asset group | Repository paths | Site use | Current evidence | Required owner action |
|---|---|---|---|---|
| WTECH logo and brand marks | `public/brand/*` | Brand identity, hero, icons and interface decoration | Local source files are present; no licence or commissioning record is stored in the repository | Retain the original design/source files and the agreement or generation receipt that grants commercial use |
| Hero artwork and motion | `public/media/hero-*`, `public/media/preloader.*` | Decorative hero media | Files are served locally; no remote hotlink is used; provenance record is absent | Keep the Higgsfield/provider job receipt, prompt/output record and applicable commercial-use terms |
| Service and background media | `public/media/svc-*`, `bg-*`, `seo-bg-*`, `custom-software.*`, `pulse.*` | Decorative and explanatory service visuals | Files are served locally; descriptive alternatives are present for meaningful service visuals; documentary licence proof is absent | Record creator/provider, creation date and commercial-use basis for each source group |
| Work concept images | `public/media/work-1.jpg` through `work-3.jpg` | Portfolio concepts | The website labels these as concepts, not client projects or endorsements | Retain source files; do not remove the concept label unless a real client approves the case study in writing |
| Onest and Outfit fonts | `public/fonts/*` and Next font output | Interface typography | Font files are local; licence text is not bundled with the repository | Keep the applicable font licence and download/source record with project documents |
| Generated icons and Open Graph images | `public/icons/*`, `public/og-*.png` | Browser icons and social previews | Derived from the WTECH identity | Covered only if the underlying WTECH identity is cleared |

## Review result

- No remote third-party image hotlinks were found in the application source.
- Decorative images use empty alternative text so screen readers skip them.
- Service and work visuals use localized descriptive alternative text.
- No stock licence files, creator releases or generation receipts are stored in this repository, so copyright clearance remains an owner documentation task.
