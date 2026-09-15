# Higgsfield prompt log

Every generated asset, its model, prompt, job id, and where it landed. Logo media IDs: mark transparent `28ee00f6-103d-4105-81d3-d1b266be3376`, lockup black `2bc2184a-5110-47d5-a830-94a10ad4974a`.

Account note: after the credit top-up the Higgsfield account changed, so the logos were re-uploaded: mark transparent `45de625e-1b68-491b-b98a-8407cbf020f4`, lockup black `bfde67e2-3251-4618-b30d-1c7a913cabd4`, mark black `c824011b-b25d-430b-8d26-71be4eba5931`, black 1254 frame `6c164a50-cff7-4bad-88dc-cfaefdb5e89b`.

Seedance kept recommending the "IN THE DARK" preset for black-background clips; every video below was submitted with `declined_preset_id: 24bae836-2c4a-48e0-89b6-49fcc0b21612` when needed.

## Stills (gpt_image_2_5, quality high, 1k)

| Asset | Job | Prompt (abridged) | Landed |
|---|---|---|---|
| Service still: websites (4:3) | fbbf3e12 | Dark product photograph on pure black: slim laptop showing a premium dark-mode website of blurred cream placeholder blocks, faint violet-coral-cyan reflection on the aluminium edge, no text, no people, no logos | start frame for svc-websites loop, poster |
| Service still: CRM (4:3) | 4840121d | Close-up of a dark CRM dashboard: one smooth revenue line rising with a violet→coral→cyan stroke, four stat tiles with blurred cream glyphs, 1px borders, no text | svc-crm |
| Service still: AI chat (4:3) | 0b16e5b1 | Dark chat detail: two dark bubbles with cream placeholder lines, typing indicator dots glowing violet/coral/cyan, thin cream send arrow, no text | svc-ai |
| Service still: automations (4:3) | 55ad53a4 | Six dark nodes connected by thin lines, one light pulse colouring the lines violet→coral→cyan as it passes, no text | svc-automations |
| Service still: software (4:3) | 2f32f246 | Smartphone upright with a dark app of placeholder blocks beside a dark code editor with blurred code, violet-to-cyan spill, no text | svc-software |
| Service still: AI SEO (4:3) | b3dcc961 | Dark search interface: wide search bar, three blurred result rows, AI-answer card with sparkle glyph, one upward arrow in the gradient, no readable text | svc-seo |
| Custom software still (16:9) | 5d2570f3 | Black studio: laptop, phone, tablet in an arc with the same dark interface family, gradient edge light, room for text on the left | custom-software |
| Hero mark stills ×4 (1:1) | c0cd21de, ae120136, ef83a7a8, ad9b0251 | Recreate the exact reference logo (mark transparent as image_references) on pure black: front view; rotated 6° clockwise from above; 6° counter-clockwise from below; glow peak | public/media/hero-still-1..4.jpg (iOS low-power fallback) |
| OG backdrop (16:9) | f1116af3 | Pure black backdrop with the reference lockup upper half, lower third empty | superseded: OG uses seo-bg-1 backdrop + the real lockup PNG composited by scripts/make-og.mjs so the mark is never redrawn |
| App icon source (1:1) | 33af05f8 | Reference mark centred on a pure black square at 78% width, tight glow, no reflection | public/icons/* via scripts/make-icons.mjs |
| Section/SEO backdrop 1 (4:3) | 11ade252 | Almost invisible violet/coral/cyan light field lower right, fine grain, everything else black | bg-proof.jpg, seo-bg-1.jpg, OG backdrop |
| Section/SEO backdrop 2 (4:3) | 88b4b8ed | One extremely faint diagonal streak violet→cyan, wide falloff | bg-process.jpg, seo-bg-2.jpg, email header backdrop |
| 404 visual (16:9) | af6d7d23 | Reference mark dimmed to 35%, two thirds visible bottom right, empty black left | not-found.jpg |
| Email header (21:9) | b8c0bcab | Reference lockup centred on black with faint bleed | superseded by make-og.mjs composite (real lockup) |
| Contact abstract (4:5) | 1e370642 | Single soft ribbon of light violet→coral→cyan curving downward, out of focus, no faces, no people | contact-abstract.jpg, bg-contact.jpg, /despre visual |
| Pulse texture (16:9) | 8a0209e2 | Horizontal band of small elongated glows travelling left to right, violet/coral/cyan, no hard edges | pulse.jpg, start frame for the pulse loop |

## Loops (seedance_2_5, omni_reference, start_image = still above, 1080p, no audio)

| Asset | Job | Prompt (abridged) | Result |
|---|---|---|---|
| svc-websites (4:3, 6 s) | 5e2e0a46 | Camera locked; the dark site scrolls up, new blocks enter, settles back to the first frame | ✓ encoded with 0.5 s loop crossfade |
| svc-crm (4:3, 6 s) | cdee4bf1 | Revenue line erases to the left edge then redraws left→right, colour flowing violet→coral→cyan | ✓ |
| svc-ai (4:3, 6 s) | 90051d67 | Typing dots pulse, bubble expands into a reply, send arrow glows, fades back | ✓ |
| svc-automations (4:3, 6 s) | 36a67e37 | Point of light travels node to node lighting segments, nodes pulse, returns to start | ✓ |
| svc-software (4:3, 6 s) | d24c3fe5 | Code lines appear, phone screen lights up with violet-to-cyan spill, settles | ✓ |
| svc-seo (4:3, 6 s) | 9cdeeae5 | Search bar pulses, rows materialise, AI card fills in, arrow climbs in the gradient | ✓ |
| custom-software (16:9, 8 s) | 95ccd41a | Very slow dolly left→right across the black studio, edge light breathes | ✓ 1 s crossfade |
| pulse (16:9, 4 s, 720p) | 74830132 | Glows drift left→right at constant speed, repeating | ✓ masked into the automations path |
| hero-mark v1 (1:1, 6 s) | 3ad25a3f | Rotate ±6°, light shifting violet→coral→cyan | ✗ rejected: Seedance swept the colours across the ribbon (frame 1 all violet) |
| hero-mark v2 (1:1, 6 s) | c0ae9fbb | Colour layout locked (violet left, coral centre, cyan right, never move), ±6° turn, glow breathes once, specular sheen | ✓ used as hero loop |
| hero-mark v3 (1:1, 6 s) | 4201ee30 | Same lock, gentle float and tilt | kept as spare (design/raw/hero-mark-v3.mp4) |

## Preloader reveal (kling3_0 pro, 1:1, 3 s, start_image = black frame, end_image = mark black)

| Take | Job | Prompt (abridged) | Result |
|---|---|---|---|
| A | 7148ed9c | Single point of cream light traces the w ribbon left→right, stroke glowing violet→coral→cyan, ends as the exact end-frame logo with one glow pulse | ✓ chosen (opens with the point of light); sped 2.5× and trimmed to 1.2 s |
| B | 56a6a20c | Point of light draws the ribbon, ends at the end-frame logo | spare |
| C | 799fab77 | Thin line of light thickens into the ribbon, settles into the logo | spare |

## Hero images (gpt_image_2_5, high, 2k, mark transparent as image_references), 2026-09-12

| Asset | Job | Prompt (abridged) | Result |
|---|---|---|---|
| Hero PC A (16:9) | 9f8b0e12 | Exact reference ribbon in the right half, centred vertically, ~55% frame height, glossy black floor with soft reflection, light fading toward the empty black left half, no text | ✓ chosen → public/media/hero-pc-{2688,1920,1280}.webp |
| Hero PC B (16:9) | 91c79ff5 | Same, no floor, atmospheric haze only | spare (design/raw/hero-pc-b.png) |
| Hero phone A (9:16) | cec48cc5 | Ribbon centred in the upper third, ~78% width, floor reflection, lower 60% black | spare (reflection reaches the headline area) |
| Hero phone B (9:16) | ca21190b | Ribbon centred in the upper third, ~80% width, wide soft halo, no floor, lower 60% black | ✓ chosen → public/media/hero-phone-{1520,1080,720}.webp |
