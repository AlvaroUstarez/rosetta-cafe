# Proposal: menu-redesign

> **Superseded by `menu-ledger-redesign`.** This change was never applied: its spec deltas were replaced by the ledger redesign, which is the change that reached the canonical specs. **Do not apply or archive these deltas** — they would reintroduce the card grammar, the responsive grid, the warm `--color-*` palette and Playfair Display on top of the current contracts. Kept as a record of the exploration and the rejected alternatives.

**Change**: `menu-redesign`
**Phase**: propose
**Status**: Proposed — three owner decisions locked, delivery shape locked, spec deltas not yet written
**Date**: 2026-10-24
**Source of truth for every measured fact**: `openspec/changes/menu-redesign/exploration.md` (r2, 2026-10-17)
**Brief (verbatim, ES)**: *"rediseña el menú teniendo en cuenta los colores de marca y las imágenes, que se vea minimalista y profesional, sin perder los colores de calidez"*

---

## 1. Summary

Redesign the Rosetta Café menu around the two things the brief names — brand colour and photography — by changing the **role and area** of each rather than replacing them.

The brand green stops being the page background and becomes the single accent. The warm near-white field returns, which also re-aligns the page with its own spec. Product cards stop being uniform rounded boxes: photographs carry their own aspect ratio, and the 43 imageless cards drawn from the 63 products without a photo get a deliberate glazed tile instead of an abstract gradient. The 31 existing photos and the hero move into Astro's image pipeline so the site stops shipping 746.9 KB average photographs with no dimensions, and the portrait hero stops being cropped by a landscape band. Six verified AA contrast failures are fixed numerically.

The typeface pairing is **reopened** and will be decided in `sdd-design`, governed by the project's `frontend-design` skill. Image optimization is **in scope for existing assets only**.

---

## 2. Why — the problem, measured

### 2.1 There is no single source of truth for colour

Four colour systems coexist and disagree (`exploration.md` §1.3):

1. Seven `:root` tokens in `src/styles/global.css` (L77–90). Use-site counts: `--color-secondary` 12, `--color-border` 11, `--color-primary` 10, `--color-text` 10, `--color-surface` 6, `--color-bg` 3, `--color-text-light` **1**.
2. `--section-accent`, written at **six sites** across the two pages (`src/pages/index.astro` L13–20, L35, L43 and `src/pages/en/index.astro` L12–19, L34, L42) — all six the same green `rgb(112, 140, 100)`.
3. `categoryGradients` in `src/data/category-visual.ts` — six gradients, **12 hex stops, zero overlap with the tokens**.
4. Loose literals outside the system: the same 12 gradient stops plus `#fdf8f3`, `#d4c5b5`, `#fff`, four white alphas, three black alphas, two dark alphas.

Three verified consequences:

- **The section alternation is dead.** Every `MenuSection`, `protocolo` included, receives a non-empty accent, so both `:nth-child` fallbacks in `global.css` L138–144 are unreachable. Seven lines of dead CSS, and every section is one flat green rectangle.
- **`--color-bg` is invisible.** `Hero` is `min-height: 100dvh` with a background image, every `MenuSection` paints its own inline accent, and `Footer` paints `--color-primary`. The `body` background only shows through a scroll bounce — which is why editing it "did nothing".
- **The page background and the six accents are the same value stored in seven places.** They will drift; they already drifted once (EN was aligned to ES in commit `1d1d1c2`).

### 2.2 The green is in the wrong role, and that is measurable

Over 32 brand photographs (`sharp` 0.34.5, 96 px sampling, 100,352 pixels):

- Green-dominant pixels: **3.7%** average, range 0.0–8.8%. Within 42 RGB units of `#708C64`: **5.4%** average, peak 9.6%.
- Warm pixels: **74.5%**. Mean of the 31 product-photo average colours: **`#876d59`**. Median luma 108; **47.5%** of pixels are dark.

Meanwhile the site paints that same green over roughly **70% of the visible area** (`exploration.md` §2.3). The defect is not the hue — it is a genuine, owner-authored desaturation chosen in two commits (`37acace`, `1d1d1c2`) — it is **area and role**. In the photography green is a scarce glaze object on warm wood and ceramic cream; on the page it is the dominant field while the colours that make up most of the photography are demoted to card fills and a footer. `categoryGradients.menus` even uses a *different* green (`#6B8E5A→#4A6B3A`), confirming there is no system behind it.

`public/favicon.svg` is the only vector brand asset and it is monochrome. There is no logo file, no brand guide, and no documented brand hex anywhere except this codebase.

### 2.3 Six WCAG 2.1 AA failures, one of them on the most important text in a menu

| Element | Pair | Ratio | Need |
| --- | --- | --- | --- |
| **Price** (1rem/600) | `#c4956a` on `#f5ede4` | **2.31** | 4.5 |
| **Sub-category heading** | `#c4956a` on `#708c64` | **1.40** | 3.0 |
| **Sub-category heading** | `#c4956a` on `#f5ede4` | **2.31** | 3.0 |
| **Nav link hover** | `#fff` on `#c4956a` | **2.67** | 4.5 |
| **Footer copyright** | `rgba(255,255,255,.5)` on `#4a3728` | **4.12** | 4.5 |
| **List description** | `.65` alpha over `.4` white panel over green | **3.83** | 4.5 |

Two more pass by **0.01** and **0.02** (section heading 3.01, body 4.52) — legal, with no headroom for any design change. The same root cause produces "milky panel" mud: `rgba(255,255,255,.4)` and `.5` over saturated green give a desaturated grey-green that appears nowhere else.

### 2.4 The strongest asset — 31 photographs — is force-cropped and unoptimized

- **Coverage** (authoritative source is `image: ""` in `src/data/menu.ts`, not `faltan-imagenes.txt`): 94 products → **31** with a real photograph (33%), **43** rendered as a `categoryGradients` fill (58% of cards), **20** as text-list rows (21%). Per category (total/photo/gradient/text): `cafe` 22/7/9/6 · `sin-cafe` 14/0/0/14 · `pasteleria-panaderia` 22/9/13/0 · `opciones-saladas` 14/5/9/0 · `menus` 11/7/4/0 · `promos` 11/3/8/0. The most appetizing category is 59% abstract.
- **Weight**: 31 photos, **23,709,224 bytes**, **746.9 KB average**, served raw from `/public` with no `astro:assets`, no `<Image>`, no `srcset`, no `width`/`height` → LCP and CLS exposure. `ProductCard.astro` L70–75 forces every one into `height: 180px; object-fit: cover`, discarding each photo's composition and aspect.
- **Hero**: `hero.webp` is **3024×4032, aspect 0.750 (portrait 3:4)**, **1,614,004 bytes**, used as `background: … center / cover` on a `min-height: 100dvh` band. That discards **53%** of the image height at 1440×900, **58%** at 1280×720, and **38%** of the width at 390×844. A 2× desktop render needs about 2880×1800; 12.2 MP ship to be thrown away. There is no `srcset`, no preload, no `fetchpriority`.
- `ProductCard.astro` L27 uses an inline `onerror` to reveal a `display:none` gradient sibling: CSP-hostile, and it ships a hidden duplicate node behind all 31 real photos.

### 2.5 Structural debt the redesign will meet

- **Dead CSS**: `.sub-category__heading` (`global.css` L147–158) is defined and never referenced — 12 lines. `.section-nav` / `.section-nav__link` / `:hover` are duplicated in `global.css` L96–135 and `SectionNav.astro` L33–71; Astro's scoped copy wins, the global copy is ~40 dead lines. The `:nth-child` block is 7 dead lines.
- **Half-inert scroll offset**: `html { scroll-padding-top: 5rem }` works, but `scroll-margin-top: 6rem` sits on `.menu-section__heading` while anchors target `<section id="section-…">` — that declaration never applies.
- **No type system**: 13 hardcoded sizes, 6 ad-hoc breakpoints, no `clamp()`, no scale variable, and **no `tabular-nums`** anywhere — so the money column, the most characteristic graphic object a menu has, has never once been aligned.
- **Four dead i18n keys of 11**: `footer.location.text` (hardcoded JSX in `Footer.astro` L17–18), `nav.es` / `nav.en` (`SectionNav.astro` L28 hardcodes `otherLocale.toUpperCase()`), `protocolo.title` (resolved from `menu.ts`). Two silent-failure contracts to respect: `t()` falls back to the key itself, `tRecord()` returns `undefined` with no fallback.
- **Document head gaps** in `BaseLayout.astro` (29 lines): no `meta description`, no Open Graph/Twitter tags, no `theme-color`, no `hreflang` alternates, no canonical, no preload/`fetchpriority` for the LCP image.
- **Stale tracking file**: `faltan-imagenes.txt` lists 77 entries against 63 real gaps; 11 of its entries now have photos, 24 match no product. `AGENTS.md` repeats the stale claim. `README.md` says "88 productos" / "17 fotos"; reality is 94 / 31.

### 2.6 Evidence base and its limits

Every figure above is quoted from `exploration.md`; **no new measurement was taken in this phase**. Two inconsistencies in the source are recorded here rather than silently resolved:

- §0 says "the five AA failures"; §2.5 enumerates **six**. This proposal uses six, because six rows are individually derived.
- §4.4 states Direction C costs "2 spec deltas". That figure excludes the de-carding deltas §3.3 itself lists (`Product Cards`, `Responsive Product Grid`, `Typed Menu Data`). With the owner decisions below, the implied delta set is larger — see §7.

---

## 3. Owner decisions locked

| # | Decision | Consequence recorded here |
| --- | --- | --- |
| D1 | **Visual direction: C — "Acento verde".** Green demoted to a single accent; photography-led layout; a glaze-tile device for the 63 products without photos. | The palette, layout grammar, and glaze device are fixed. Green keeps its exact value `#708C64` but loses its field role. |
| D2 | **Typefaces MAY change.** The owner delegates the choice; the `frontend-design` skill governs it. | Direction C's original budget advantage ("no typeface change") is **spent**. The final pairing is decided in **`sdd-design`**, not in this phase. `homepage-layout` → *Typography* becomes a MODIFIED delta. |
| D3 | **Image optimization is in scope, scoped to existing assets only.** Migrate the 31 existing product photos and the hero to `astro:assets` — responsive `sizes`, modern formats, intrinsic `width`/`height` — and make the hero aspect-aware instead of cropping the portrait photograph. | Explicitly **out of scope: obtaining new photographs.** That is a content task, not this change. The archived `product-images` proposal's "Out of scope: image optimization … or responsive srcsets" is superseded for existing assets only. |

D1–D3 also retire the exploration's open questions 2 and 4, and resolve question 3 (green's role is the accent).

---

## 4. What changes

Behaviour and capability, not implementation:

**Colour and structure**

- One source of truth for colour. The page field, section markers, surfaces, text, and the accent resolve from a single token set; `--section-accent` as a per-page record disappears, and with it the seven-place duplication of one value.
- The warm near-white field is restored, which re-aligns the site with `homepage-layout` → *Warm Color Palette* ("Backgrounds SHOULD use cream/off-white tones") — a requirement the code already violates.
- Green keeps its exact value and is **promoted in role, demoted in area**: section markers, the active-nav marker, and glaze swatches. Green is never a text ground: `#fff` on `#708C64` is **3.73** and fails, so white-on-green does not survive the redesign.
- Section identity is carried by a hairline rule plus a green-ink label (`#4E6B44`, **5.41:1**) instead of a coloured rectangle. This repairs the dead alternation rather than re-creating it.
- All six AA failures are fixed by value or role changes within the owner's own palette. The gold stays the price *hue*, darkened to `#8A5A2B` (**5.31:1**) instead of `#c4956a` (**2.31**).
- A type scale exists: one modular scale on `clamp()` replacing 13 hardcoded sizes and 6 ad-hoc breakpoints, one line-height rhythm, a 65–75 character measure. The pairing itself is a design-phase decision (D2).
- The money column is aligned: `font-variant-numeric: tabular-nums` on every price, with the existing dotted leaders kept — they are a real menu/printer convention, not decoration.

**Photography**

- Product cards stop being cards. The photograph bleeds to the cell edge with no radius and no shadow, separated from its text by one hairline, at **its own aspect ratio** rather than a fixed 180 px box.
- The 43 imageless cards get a **glaze library**: 4–5 flat, ungraded swatches sampled from colours actually measured in the photography (ochre/gold at 9.4% share, green object colour at 3.7%, ceramic light `#d8d2bf`, walnut dark `#5b3c2b`), each with a 1 px inner rim — a glazed tile, not a broken image and not a linear gradient.
- All 31 existing product photos and the hero enter Astro's image pipeline: responsive `sizes`, modern output formats, intrinsic `width`/`height` (CLS), and no hidden duplicate node behind each photo. The inline `onerror` fallback is removed because a build-time-processed image cannot 404 at runtime.
- The hero becomes aspect-aware: the portrait photograph is re-framed rather than cropped by a landscape band. It remains the LCP element, so it carries an explicit priority hint instead of shipping 1.54 MiB unannounced.
- No non-user-triggered motion is added. The absence of entrance animations is a strength and is preserved; the identical hover lift on every card is removed.

**Chrome, head, and copy plumbing**

- The sticky nav becomes plain text on the field with a 2 px green rule under the active section; its duplicated global CSS block is deleted. Nav hover contrast stops being 2.67.
- The footer keeps its dark ground as one decision — wood ground, light text from tokens, no hardcoded `#d4c5b5` / `#fff`, and its copyright text stops failing at 4.12.
- The document head gains `meta description`, Open Graph/Twitter tags (the hero photograph is the obvious `og:image`), `theme-color`, and `hreflang` alternates between ES and EN. This is invisible to the eye and is the cheapest "professional" upgrade available.
- The four dead i18n keys are resolved: `footer.location.text` is **wired** (the spec requires footer text to resolve via i18n, and today it does not), while `nav.es`, `nav.en`, and `protocolo.title` are removed because their strings legitimately come from elsewhere. Key parity across locales is preserved.
- Dead CSS is removed: `.sub-category__heading` (12 lines), the unreachable `:nth-child` block (7 lines), the duplicated nav block (~40 lines). The inert `scroll-margin-top` is either made to apply or removed — one offset, not two.

---

## 5. What does NOT change (non-goals)

- **No backend, no CMS, no API, no server rendering.** Still a static two-page site.
- **No new locale.** ES and EN only; locale stays threaded manually as a prop, and `astro.config.mjs` keeps `es` as default with no prefix.
- **No new product content.** `src/data/menu.ts` keeps its 94 products, prices, categories, sub-categories, and `protocolo` entry. Only the `image` field's semantics and the gradient module's shape may change (§7).
- **No new photographs.** Acquiring the 63 missing product photos is a content task outside this change; the glaze tile is the answer *until* those photos exist.
- **No test framework.** There is no runner in this project (`openspec/config.yaml`: `runner: none`) and none will be added.
- **No lint gate.** `npx biome check src/` exits `-1073741515` (`0xC0000135`, missing DLL) on this machine. That is an environment failure, never a finding, and no CI or verification step will depend on it. Formatting is manual per `biome.json`: 2-space indent, LF, double quotes.
- **No dark mode, no theme switcher, no animation library, no analytics.**
- **No documentation rewrite.** `README.md`, `AGENTS.md`, and `faltan-imagenes.txt` stay as they are; the stale numbers in them are noted, not fixed here.
- **No new pages or routes.** Two pages, same URLs, same anchors.

---

## 6. Scope

### In scope

1. **Design tokens** — one colour source of truth, re-roled; a type scale; contrast fixes verified numerically.
2. **Menu body** — section identity by rule and label; de-carded product cells at native aspect ratio; glaze tile for imageless products; aligned money column; list rows.
3. **Chrome** — hero re-framing, sticky nav, footer.
4. **Imagery pipeline (existing assets only)** — 31 product photos + hero through `astro:assets`, responsive `sizes`, modern formats, intrinsic dimensions, hero priority hint.
5. **Document head** — description, OG/Twitter, `theme-color`, `hreflang` alternates.
6. **i18n hygiene** — resolve the four dead keys; keep key parity; do not mix the two translation systems.
7. **Dead-code removal** — the three identified dead CSS blocks and the inert scroll offset, only where the redesign touches them.

### Out of scope

1. New photographs or any content acquisition.
2. New products, categories, prices, or copy beyond what the redesign's structure requires.
3. A new locale, i18n framework, or Astro i18n helpers.
4. Tests, lint gates, CI, visual-regression tooling.
5. Backend, CMS, forms, ordering, reservations.
6. Refreshing `README.md`, `AGENTS.md`, or `faltan-imagenes.txt` (their staleness is recorded, not repaired).
7. Repo hygiene unrelated to the change — notably `.codegraph/`, which is untracked and **not** in `.gitignore`, and the already-modified `openspec/config.yaml`. Neither may be swept into a slice.

---

## 7. Impact on existing specs

The redesign is **not spec-neutral**. The code already drifts from its specs, and the owner decisions add deltas. Deltas themselves are written in the `spec` phase — this is the implied surface only.

| Spec | Requirement | Implied delta | Driver |
| --- | --- | --- | --- |
| `homepage-layout` | **Warm Color Palette** (L53) | **MODIFIED** — one token source; cream field restored; accent and heading colours constrained to the measured earth family; green re-roled to accent. Re-aligns a requirement the code currently violates. | D1 |
| `homepage-layout` | **Typography** (L99) | **MODIFIED** — the "MUST use Playfair Display … and Inter" becomes a pairing chosen in `sdd-design` under the `frontend-design` skill. Fallback-stack and Google-Fonts-loading constraints survive as MUSTs. | D2 |
| `homepage-layout` | **Hero Section Branding** (L9) | **MODIFIED (probable)** — "SHOULD occupy the full viewport height" relaxed so the menu starts sooner; the hero is aspect-aware. Height is still an open question (§10). | D3 + Q6 |
| `homepage-layout` | **Institutional Footer** (L70) | **MODIFIED (small)** — footer text must resolve via i18n; today the location is hardcoded JSX. Dark ground retained. | i18n hygiene |
| `homepage-layout` | **Responsive Mobile-First Layout** (L34) | **Review only** — page order (hero → sticky nav → sections → footer) and the single-column mobile stack are unchanged. No delta expected. | — |
| `product-menu` | **Section Visual Identity** (L149) | **MODIFIED** — per-section background blocks abolished; the decorative device is a hairline rule plus a green-ink label. The scenario asserting a "visually distinct background from adjacent sections" must be rewritten, since the current implementation already fails it. | D1 |
| `product-menu` | **Product Cards** (L33) | **MODIFIED** — de-carded cells; `<Image>` from `astro:assets` instead of a raw `<img>`; a flat glaze tile instead of a gradient `<div>`; no hover lift; `Product.image` semantics may change (asset import vs public path). | D1 + D3 |
| `product-menu` | **Responsive Product Grid** (L66) | **MODIFIED** — "1 / 2 / 3 uniform columns with consistent cell height" is incompatible with aspect-preserving cells. Exact column behaviour is a design-phase decision; the requirement must stop mandating equal cell height. | D1 |
| `product-menu` | **Typed Menu Data** (L84) | **MODIFIED** — `categoryGradients: Record<Category, string>` is replaced by a glaze-token map (a shape change, not a value change); `image` field semantics; the stale "~88 products" corrected to 94. `tRecord`'s contract must survive untouched. | D1 + D3 |
| `product-menu` | **Sticky Nav Section Navigation** (L9) | **Review only** — behaviour and anchor targets unchanged; contrast and duplicated-CSS cleanup are implementation detail. | — |
| `product-menu` | **Sub-Category Dividers** (L130) | **Review only** — dividers persist; only their visual treatment changes. | — |
| `product-menu` | **Empty Category State** (L118) | **No delta** — not touched by this change. | — |
| `i18n` | **UI Translation Files** (L34) | **MODIFIED (small)** — four dead keys resolved (one wired, three removed); "keys MUST be identical across locales" retained. | i18n hygiene |
| `i18n` | *new* — locale alternates and document head metadata | **ADDED (candidate)** — no existing requirement covers `hreflang`, description, OG/Twitter, or `theme-color`. Whether it belongs to `i18n` or `homepage-layout` is a `spec`-phase decision. | Head gaps |
| `i18n` | **Locale Helper**, **Language Switcher Mechanism**, **HTML Lang Attribute**, **Astro i18n Routing** | **No delta** — both translation systems keep their contracts and are not mixed. | — |

**Residual risk carried into `spec`**: if any MUST above cannot be relaxed, the change degrades to a palette-and-contrast retune plus de-carding removal. That is still worth shipping — it fixes six AA failures — but it does not deliver the brief's "redesign". This is the exploration's R1 and it is only partly retired by D2 and D3.

---

## 8. Delivery plan shape

**The change does not fit one review.** The exploration forecast **~510 changed lines (range 420–560)** across three slices before D2 and D3; a typeface change and an image-pipeline migration both add work. No re-forecast is made in this phase — that is `sdd-tasks`' job — but the direction of the change is upward, not downward.

- **Review budget: 400 changed lines per review** (`openspec/config.yaml`). Every review must land under it.
- **Delivery is chained / stacked PR slices.** Final slice boundaries are **defined in `sdd-tasks`**, not here.
- Two structural properties the slicing must preserve, from the exploration:
  1. **Slice 1 changes token values and roles, never token names.** Keeping `--color-primary`, `--color-secondary`, `--color-bg`, `--color-surface`, `--color-text`, `--color-border` means the palette and all six contrast fixes ship alone, before any layout change. Renaming tokens in slice 1 would fuse every slice into one PR.
  2. **Once slice 1 lands, the remaining slices are independent**, so a reviewer can take either first. The hero geometry fix is self-contained.
- The image-pipeline migration is the one slice with a hard ordering constraint of its own: moving 31 files into the build graph and changing `Product.image` semantics must not be split across reviews, because a partial migration breaks the build.
- Each slice must independently hold `npx astro check` at **0 errors** (baseline: 14 files, 0 errors, 0 warnings, 0 hints) and `npm run build` at **2 pages**.

---

## 9. Risks and mitigations

| # | Risk | Mitigation |
| --- | --- | --- |
| **R1** | **Spec surface is the dominant risk, not the CSS.** D2 and D3 each convert a MUST into a delta; if the owner refuses any relaxation, the change collapses to a retune. | Delta set enumerated up front (§7). The spec phase happens before any code. Fallback scope is defined, so a refusal is a smaller change rather than a stalled one. |
| **R2** | **Six AA failures exist today.** Any direction that keeps `#c4956a` as a text colour re-ships a 2.31:1 defect on the most important text in a menu. | Verification asserts the new ratios numerically, not visually. `#8A5A2B` = 5.31, `#4E6B44` = 5.41, `#2C1810` = 15.25, `#4A3728` = 10.16. Green is decorative/large-text only at 3.38, and never a text ground. |
| **R3** | **The hero is a portrait image in a landscape frame and it is the LCP element.** 53% of its height is cropped on desktop; 1.54 MiB ships with no `srcset`, preload, or dimensions. Enlarging photography makes this worse. | D3 puts `astro:assets`, responsive `sizes`, intrinsic dimensions, and an aspect-aware hero explicitly in scope, superseding the archived out-of-scope note for existing assets only. `sharp` 0.34.5 is already in the tree, so the transformer exists. |
| **R4** | **Direction A's `--line #C9554E` was unverified brand evidence.** | Retired: D1 selects C, whose six tokens are 2 owner values and 3 documented derivations, with **zero unverified colours**. |
| **R5** | **No brand guide exists.** "Green is the brand colour" is an inference from two owner commits plus a monochrome favicon, not a document. §2.2 measures the *photographic corpus*, not the brand — a café can own a green that appears on its awning and in none of its food photos. | Direction C is defensible on provenance either way: it keeps the owner's exact `#708C64` and shrinks its area, so the change is safe under both readings. Confirmation still requested (§10/Q1). |
| **R6** | **Instrumentation asymmetry.** No test runner; Biome is broken on this machine. | Verification is `npx astro check` + `npm run build` only. Formatting is manual. No lint gate is proposed anywhere in this change. |
| **R7** | **Untracked work in the tree.** `.codegraph/` exists, is untracked, and is **not** in `.gitignore`. `openspec/config.yaml` already carries uncommitted modifications. | Named as out of scope (§6). Slices must stage explicit paths, never `git add -A`. |
| **R8** | **`faltan-imagenes.txt` and `AGENTS.md` are stale.** Sizing the glaze device from that file would target 77 missing photos instead of 63, 11 of which exist. | The glaze device is sized from `image: ""` in `src/data/menu.ts` — **63**. The file is not repaired in this change; its staleness is recorded. |
| **R9** | **The typeface decision is deferred, so the type delta is a live unknown.** A new pairing changes the font link, the fallback stacks, the payload, and the perceived CLS budget — and it spends C's original budget advantage. | Deferred to `sdd-design` deliberately, governed by `frontend-design` (one family or two clearly distinct; no default families; no ALL-CAPS labels; a real scale). The `Typography` delta is written in `spec` with the constraint that loading and fallbacks stay explicit. Design must state the pairing and its roles before tasks are cut. |
| **R10** | **`astro:assets` needs assets in the build graph; `public/` files are served raw.** Moving 31 photos plus the hero changes every `image` path in `menu.ts` and the `Product.image` contract. | Treated as one atomic slice with a hard ordering constraint (§8). `Product.image` semantics are a `Typed Menu Data` delta (§7). The exact mechanism is a design-phase decision, not a proposal one. |
| **R11** | **No visual regression exists in this project.** Nothing mechanically proves the page still looks right. | Verification is types, build, and asserted contrast math; visual correctness rests on review. Each slice states what a reviewer should look at. This is a known limit, not a gap to close with new tooling. |

---

## 10. Open questions and assumptions

D1–D3 retired the exploration's questions 2, 3, and 4. What remains is carried below; the proposal proceeds on a stated assumption in each case, so none of these blocks the `spec` phase.

| # | Question (from exploration §7) | Status | Assumption the proposal proceeds on |
| --- | --- | --- | --- |
| **Q1** | **Is `#708C64` the brand green** (signage, awning, packaging, uniforms), or was it sampled from the hero photograph? | Open. Confirmation requested; not blocking. | It is brand evidence — two owner commits plus the favicon lineage. If refuted, C still holds: it keeps the owner's value and only changes its area, so the worst case is that the accent's *provenance* argument weakens, not the design. |
| **Q5** | **Do more photographs exist or are they coming?** 63 of 94 products have none, including 13 of 22 in pastry & bakery and 8 of 11 in promos. | Open. Shapes the glaze device's share, not its design. | **No new photos arrive during this change** (D3's explicit boundary). The glaze device is sized for 63 products and designed to look deliberate, not provisional. If photos arrive later, each tile is replaced by a photograph with no structural change. |
| **Q6** | **Hero height.** The spec says full viewport; the menu should start sooner. Confirm, and confirm the portrait photo should be re-framed rather than cropped. | Partly resolved. Re-framing is locked by D3; height is not. | The hero stops being pinned to `100dvh` and becomes aspect-aware, so the menu begins within the first screen on a laptop. The exact height is a `sdd-design` decision, and the `Hero Section Branding` delta is written to permit it. |
| **Q7** | **How Salta-specific?** Balcarce 350, specialty café and artisan bakery. Lean into the locale, or stay internationally neutral? | Open. Affects copy and ornament only. | **Internationally neutral.** No new copy, no locale-specific ornament, no new content — the brief asks for a visual redesign, and new copy would expand scope past the 400-line budget. If the owner wants Salta-specific voice, it is a separate content change. |

**Not open, recorded for the record**: the typeface pairing (D2, decided in `sdd-design`); the green's role (D1, the accent); image optimization (D3, existing assets only).

---

## 11. Verification

- **Types**: `npx astro check` — must stay at **0 errors** (baseline: 14 files, 0 errors, 0 warnings, 0 hints).
- **Build**: `npm run build` — must stay at **2 pages** (`/index.html`, `/en/index.html`).
- **Contrast**: every new foreground/background pair asserted numerically against WCAG 2.1; no pair ships below its threshold.
- **No tests.** No runner exists and none is proposed.
- **No Biome gate.** Its failure code is an environment fault, never a result. Manual formatting per `biome.json`.
- **Manual review points per slice**: the six former failures are legible; prices align down the column; each photograph keeps its aspect; imageless products read as tiles; the hero is not cropped; both locales render identically in structure; no `undefined` or key-name text appears anywhere.

---

## 12. Success criteria

- [ ] One colour source of truth; `--section-accent` and its six call sites are gone.
- [ ] Zero AA failures among the pairs enumerated in §2.3, each verified numerically.
- [ ] Green appears only as accent, marker, or glaze swatch — never as a page or section field, never as a text ground.
- [ ] All 31 existing product photographs render at their own aspect ratio, with `srcset`/`sizes` and intrinsic `width`/`height`.
- [ ] The hero is not cropped by a landscape frame, and the LCP image is not shipped unoptimized and unannounced.
- [ ] The 43 gradient cards are replaced by glaze tiles sized from the 63 real gaps in `menu.ts`.
- [ ] Prices are right-aligned on `tabular-nums`; the dotted leaders survive.
- [ ] Section identity is a rule plus a label, and adjacent sections are distinguishable without a background block.
- [ ] The four dead i18n keys are resolved; ES/EN key parity holds; the two translation systems are not mixed.
- [ ] `hreflang`, description, OG/Twitter, and `theme-color` are present in the document head on both pages.
- [ ] Three dead CSS blocks and the inert scroll offset are gone.
- [ ] `npx astro check` 0 errors; `npm run build` 2 pages; every review under 400 changed lines.
