# Design: menu-redesign

**Change**: `menu-redesign`
**Phase**: design
**Status**: Complete — six design decisions resolved, no code written
**Date**: 2026-10-24
**Scope authority**: `openspec/changes/menu-redesign/proposal.md` (D1 direction C, D2 typefaces may change, D3 image optimization in scope)
**Measured-fact source**: `openspec/changes/menu-redesign/exploration.md` (r2). Numbers quoted from it are not re-derived here. Numbers introduced by this phase are labelled **[measured in design]** and were taken read-only from the working tree.
**Language**: English. Repository strings, keys, and identifiers are verbatim.

---

## 1. Decisions at a glance

| # | Decision | Resolution |
| --- | --- | --- |
| 1 | Typeface pairing | **Petrona** (headings) + **Archivo** (body, UI, prices). One modular `clamp()` scale, ratio 1.25, base 16 → 17.5 px. One Google Fonts `<link>`, four faces, `display=swap`. No new dependency. |
| 2 | Hero geometry | Two-column hero from 768 px up (text left, 3:4 photograph right at `clamp(16rem, 26vw, 22rem)` wide); single column below 768 px with the photograph full-bleed. Height is content-derived: no `vh` unit of any kind on the hero. `priority` on the `<Image>`. Menu starts at **607 px** on a 1280×720 viewport. |
| 3 | Grid column model | Explicit 1 / 2 / 3 columns at the spec breakpoints, `align-items: start`, `grid-auto-rows: auto`. Cells keep their own height; the row gap absorbs the difference. Worst-case intra-row slack is **222 px** at ≥1100 px, and it is accepted rather than paid for with a crop. |
| 4 | `astro:assets` mechanism | Assets move to `src/assets/hero.webp` and `src/assets/products/*.webp`; `menu.ts` statically imports all 31; `Product.image` becomes `ImageMetadata \| ""`; `<Image>` with `widths`/`sizes`; WebP at quality 80. **Atomic** — it cannot be split across reviews. |
| 5 | Glaze tile library | `src/data/category-visual.ts` exports `glazeTiles: Record<Category, GlazeToken>` with four flat fills drawn from measured photographic colours and one derived rim each; 1 px inner rim via `box-shadow: inset 0 0 0 1px`. No gradient, no `<img>`, no `onerror`. |
| 6 | `t` vs `tRecord` | `tRecord(value, locale)` for every inline `{ es, en }` record; `t(key, locale)` only for keys in `src/i18n/{locale}.json`. The two `t(record, locale)` occurrences in the spec set are documentation defects and must not be copied into code. |

Two decisions carry a flag for the owner: the recommended explicit `sharp` declaration (§13, §14) and one interpretation of the palette's "no green product-cell background" scenario (§7.4). Neither blocks implementation.

---

## 2. Ground truth this design is built on

Everything below is the state of the tree at design time.

### 2.1 Files that change

| File | Current state that matters |
| --- | --- |
| `src/styles/global.css` | `:root` block at L77–90 holds 7 colour tokens, 2 font stacks, `--max-width`. Duplicated `.section-nav*` block L96–135. Unreachable `:nth-child` block L138–144. Dead `.sub-category__heading` L147–157. `body` L160–164. |
| `src/layouts/BaseLayout.astro` | 29 lines. One Google Fonts `<link>` (Playfair Display + Inter) L19–24. No description, OG, Twitter, `theme-color`, or `hreflang`. `title` prop defaults to `"Rosetta Café"` and no page passes it. |
| `src/components/Hero.astro` | `min-height: 100dvh` L21; `background: linear-gradient(...) , url("/images/hero.webp") center / cover` L26–28; hardcoded `#fdf8f3` L40 and `#d4c5b5` L48; three hardcoded font sizes L39, L56, L66. |
| `src/components/MenuSection.astro` | Paints `background: var(--section-accent, ...)` L85; centred heading L88–95 with an inert `scroll-margin-top` L94; grid L97–103 with `repeat(2, 1fr)` L176 and `repeat(3, 1fr)` L190; milky `rgba(255,255,255,.4)` L108 and `.5` L160 panels; sub-heading in `--color-secondary` L117. |
| `src/components/ProductCard.astro` | Imports `categoryGradients` L2; raw `<img src={product.image}>` with inline `onerror` L22–28 and a hidden gradient sibling L29–34; card container L53–63 (surface, 12 px radius, shadow, hover lift L65–68); fixed `height: 180px; object-fit: cover` L70–75; price in `--color-secondary` L106. |
| `src/components/ProductListItem.astro` | Dotted leader L60–65 (keep); price L67–73; description with `opacity: .65` L78. |
| `src/components/SectionNav.astro` | Duplicates the global nav block L33–71; pill chrome L51; hover `background: --color-secondary; color: #fff` L65–71 (2.67:1); dead `--active` class L25/L97–101 — `locale === otherLocale` is never true. |
| `src/components/Footer.astro` | Hardcoded location JSX L16–19 although `footer.location.text` exists; `#fff` L109; `#d4c5b5` L117/L133; `rgba(255,255,255,.1)` L141; `.15` divider L148; copyright `rgba(255,255,255,.5)` L153 (4.12:1). |
| `src/pages/index.astro`, `src/pages/en/index.astro` | `sectionAccents` record L13–20 / L12–19, all six `rgb(112, 140, 100)`; passed at L35/L43 and L34/L42; a `protocolo` accent literal at L43 / L42. |
| `src/data/menu.ts` | `Product.image: string` L18; 6 categories L33–66; `protocolo` L68–74; 94 products from L76. |
| `src/data/category-visual.ts` | 10 lines: `categoryGradients: Record<Category, string>` L3–10, six `linear-gradient` strings. |
| `src/i18n/index.ts` | `t(key, locale)` L10–12 (falls back to the key itself); `tRecord(value, locale)` L14–20 (no fallback, returns `undefined` for a missing locale). |
| `src/i18n/es.json`, `src/i18n/en.json` | 11 keys each. Dead: `nav.es`, `nav.en`, `protocolo.title`. Present but never rendered: `footer.location.text`. |
| `astro.config.mjs` | `output: "static"`; `i18n` with `es` default, no prefix. No image service configuration needed. |
| `package.json` | Astro 6.3.7. No `sharp`; `sharp` 0.34.5 is installed as an **optional dependency of `astro`** (`^0.34.0`). |

### 2.2 Assets **[measured in design]**

Read with `sharp` 0.34.5 metadata only; no image was decoded, converted, or written.

- `public/images/hero.webp` — 3024 × 4032, ratio 0.7500, 1,614,004 bytes.
- `public/images/products/` — 31 files, 23,709,224 bytes total.
- Aspect distribution: **25 of 31 are exactly 0.7500** (3024×4032 or 4284×5712); the other six are `roll-frutos-rojos` 1.0144, `menu-chipa-prensado` 1.0858, `croissant-oreo` 1.1239, `espresso-leche-grande` 1.3080, `promo-chipa-xl` 1.3333, `espresso-leche-mediano` 1.4538.
- `src/data/espresso-leche-grande.HEIC` — 1,539,086 bytes, stray, not referenced by `menu.ts`, **not touched** by this change.

The aspect distribution is the single most load-bearing new fact in this design: the grid must survive a 0.75 next to a 1.45 in the same row.

---

## 3. Decision 1 — Typeface pairing

### 3.1 Resolution

```css
--font-heading: "Petrona", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
--font-body: "Archivo", "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
```

- **Petrona** — serif, weights 100–900 variable on Google Fonts, OFL. Its own published description is the argument: "uppercase glyphs have heavy asymmetric serifs and arms with inverted angles, which combine with lowercase designs that share a big x-height, pronounced ascenders, and **soft curves of low stroke contrast**". It is a *low-contrast* serif with cut-by-hand irregularities, i.e. the opposite construction from Playfair Display's Didone thick-thin.
- **Archivo** — grotesque, weights 100–900 and widths 62–125 variable, OFL. "Originally designed for highlights and headlines … reminiscent of late nineteenth century American typefaces." That lineage — newspaper headlines, price boards, grocery signage — is the vernacular of a printed price list, which is what a menu is.

Roles:

| Role | Family | Weight | Size token |
| --- | --- | --- | --- |
| Hero `h1` | Petrona | 500 | `--text-3xl`, `--text-4xl` at ≥768 px |
| Section label `h2` | Petrona | 500 | `--text-2xl` |
| Sub-category label `h3` | Petrona | 500 | `--text-lg` |
| Product name `h3` | Petrona | 500 | `--text-lg` |
| List-row name | Petrona | 500 | `--text-base` |
| Hero tagline | Archivo | 400 | `--text-lg` |
| Nav links, lang toggle | Archivo | 500 | `--text-base` |
| Product description, list description | Archivo | 400 | `--text-sm` |
| Body prose (protocolo) | Archivo | 400 | `--text-base` |
| **Price** | Archivo | 600 | `--text-base`, `font-variant-numeric: tabular-nums` |
| Footer heading / body / copyright | Petrona 500 / Archivo 400 / Archivo 400 | — | `--text-base` / `--text-base` / `--text-sm` |

Four faces only: Petrona 500; Archivo 400, 500, 600.

### 3.2 Type scale

One fluid base, six derived steps. The ratio is 1.25 at every viewport because the steps are computed from the base rather than clamped independently.

```css
--text-base: clamp(1rem, 0.9633rem + 0.163vw, 1.0938rem); /* 16.0 px @360 → 17.5 px @1280 */
--text-sm:   calc(var(--text-base) / 1.25);    /* 12.80 → 14.00 */
--text-lg:   calc(var(--text-base) * 1.25);    /* 20.00 → 21.88 */
--text-xl:   calc(var(--text-base) * 1.5625);  /* 25.00 → 27.34 */
--text-2xl:  calc(var(--text-base) * 1.9531);  /* 31.25 → 34.18 */
--text-3xl:  calc(var(--text-base) * 2.4414);  /* 39.06 → 42.72 */
--text-4xl:  calc(var(--text-base) * 3.0518);  /* 48.83 → 53.41 */
```

Computed values at 360 / 768 / 1280 px viewport: base 16.00 / 16.67 / 17.50; `2xl` 31.25 / 32.55 / 34.18; `4xl` 48.83 / 50.86 / 53.41. Every role above resolves from this ladder; no component declares a `font-size` value of its own. The one per-breakpoint override (`h1` from `3xl` to `4xl` at 768 px) switches between ladder steps, not to an ad-hoc size.

Rhythm: `--leading: 1.5` for every reading role; `--leading-display: 1.15` for `h1`/`h2`/`h3` only. This is **one two-step rhythm**, declared in the single token block — not per-component line-heights. The `Typography` requirement's "one line-height rhythm" is read as one rhythm *system*; a 53 px heading at 1.5 leading would be 80 px per line, which no type system would ship.

Measure: `--measure: 68ch`, applied to running prose (the protocolo paragraph and any full-column text). Cell descriptions are bounded by the grid column at ≈38–42 ch and MUST NOT be widened to reach the measure — the grid is the constraint, not a defect. This interpretation is recorded because a mechanical reading of "65–75 characters" would otherwise fail every product cell.

### 3.3 Loading strategy

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Petrona:wght@500&display=swap"
/>
```

- **One stylesheet request** covering both families (limit is two), `display=swap` present, verified against the Google Fonts CSS2 endpoint during design.
- Four font files maximum, latin subset only, served by `unicode-range`.
- Fallback stacks are explicit per role and satisfy the spec's "display/serif fallback for headings, sans-serif or system fallback for body".
- No `@font-face` is authored locally, so no metric overrides (`size-adjust`, `ascent-override`) are possible. Accepted cost: one swap reflow. The hero photograph carries intrinsic dimensions and the h1 is short, so the reflow is bounded to a line of text, not a layout jump.

### 3.4 Justification against the `frontend-design` skill

| Skill rule | How this pairing satisfies it |
| --- | --- |
| "Choose your typefaces deliberately, not the default families you would reach for on any other project." | Playfair Display + Inter is the single most common "elegant restaurant" default, and the exploration already flagged it as the commonest tell. Both families are replaced. |
| "if two, make them clearly distinct" | Different construction (serif vs grotesque), different contrast (low-contrast wedge serifs vs uniform grotesque strokes), different rhythm (large x-height serif vs condensed-ish grotesque). |
| Tell 1: "warm cream background with a **high-contrast** serif display and a terracotta accent" | The accent is the owner's green, not terracotta, and Petrona is explicitly a low-stroke-contrast serif. The tell's silhouette — Didone thick-thin on cream — is removed at the type axis, not defended. |
| "When type is used as a headline or visual element, use the type treatment itself as an active part of the design." | The graphic device is the money column: 94 prices, Archivo 600, tabular figures, right-aligned, with the leader dots that already exist. That is the type doing structural work on content the page actually has. |
| "Avoid … using all caps for labels", "accenting just a single word in a headline", "unnecessary typographic labels above content" | No uppercase labels (the `ES`/`EN` toggle is an acronym, unavoidable). The h1 is uniformly styled. No eyebrows. |
| "Spend boldness in one place." | Boldness is the photography plus the aligned price column. Type is otherwise quiet: two families, four faces, no display weights above 500. |

### 3.5 Alternatives rejected

| Alternative | Why rejected |
| --- | --- |
| Keep Playfair Display + Inter | Zero cost, but it is the catalogued default for this exact subject, and D2 spent the budget to change it. It also keeps a Didone display face whose high contrast is tell 1's most recognisable feature. |
| One family only (Archivo for everything) | Cheaper (2 faces, one request) and the money column would be perfect, but the `Typography` requirement demands that headings use a family whose voice is distinguishable from the body family. One family makes that MUST vacuous. |
| Self-host via `@fontsource/petrona` + `@fontsource/archivo` | Better: no third-party request, exact version pinning, and metric overrides are possible so the swap reflow disappears. Cost: **two new dev dependencies** and a local `@font-face` block, which needs owner approval and expands the review surface. Rejected in favour of the CDN the project already uses; recorded as the upgrade path if the swap reflow proves visible. |
| A single variable family with a display axis (e.g. Fraunces) | Fraunces' `SOFT`/`WONK` axes are the current AI-design default serif; it would trade one catalogued tell for a newer one. |

**Dependency impact: none.** No package is added, removed, or upgraded by this decision.

### 3.6 The one unproven property

`font-variant-numeric: tabular-nums` is a MUST in the spec, and neither Google Fonts' metadata nor the CSS API reports OpenType feature coverage. The property is inert if Archivo's figures are proportional-only, and the money column then fails its whole purpose. This is the only decision that cannot be proven from source.

- **Gate** (in §12.6): render `1111` and `9999` in the price style in the built page and compare widths. Equal within 0.5 px proves tabular figures.
- **Contingency if the gate fails**: move the price role to Petrona 500 (already loaded, no new request, no new dependency — Petrona's published description states it ships "all kinds of numerals"), and keep Archivo for descriptions and nav. Cost: one token-level family change in the price rule, no structural change.

---

## 4. Decision 2 — Hero geometry

### 4.1 Model

```
≥768 px                                    <768 px
┌──────────────────────────────┬────────┐  ┌──────────────────┐
│ Rosetta Café de Especialidad │ ┌────┐ │  │ Rosetta Café de  │
│ Donde cada grano cuenta su   │ │3:4 │ │  │ Especialidad     │
│ historia                     │ │photo│ │  │ Donde cada grano │
│                              │ └────┘ │  └──────────────────┘
└──────────────────────────────┴────────┘  ┌──────────────────┐
   text column 1fr             photo clamp  │  3:4 photograph  │  full-bleed
                                            │  (375 × 500 px)  │
                                            └──────────────────┘
```

```css
.hero { padding-block: clamp(2rem, 5vw, 3.5rem); }        /* no height, no min-height */
.hero__inner { display: grid; gap: clamp(1.5rem, 4vw, 3rem); align-items: center; }
@media (min-width: 768px) {
  .hero__inner { grid-template-columns: minmax(0, 1fr) clamp(16rem, 26vw, 22rem); }
}
.hero__media { width: 100%; }
.hero__media img { width: 100%; height: auto; display: block; }
@media (max-width: 767px) {
  .hero__media {
    width: calc(100% + 2 * var(--gutter));
    margin-inline: calc(-1 * var(--gutter));
  }
}
```

- The photograph occupies the space by **width**: its height is whatever the 3:4 ratio produces at that width. `object-fit` does not appear in `Hero.astro` at all — there is nothing to fit, because the frame and the photograph are the same shape.
- No `vh`/`dvh`/`svh`/`lvh` unit of any kind on the hero. The height is `auto` and derives from the text block and the photograph.
- The mobile full-bleed uses `calc(100% + 2 * var(--gutter))` with negative inline margins, not `100vw`, so a desktop scrollbar can never produce horizontal overflow.
- Text precedes the photograph in DOM order on mobile: the brand name must be the first thing read on a phone, and the photograph then bleeds edge to edge as the "keep scrolling" cue.

### 4.2 Measured geometry **[measured in design]**

`--gutter: clamp(1.25rem, 4vw, 2rem)`, hero padding-block `clamp(2rem, 5vw, 3.5rem)`, media width `clamp(16rem, 26vw, 22rem)`.

| Viewport | Gutter | Padding | Photograph | Hero height | Menu begins (hero + nav ≈ 51 px) |
| --- | --- | --- | --- | --- | --- |
| 375 | 20 | 32 | 375 × 500 (full-bleed) | ≈724 incl. text block | below the fold — deliberate |
| 768 | 30.7 | 38.4 | 256 × 341 | 418 | 469 |
| 1024 | 32 | 51.2 | 266 × 355 | 457 | 508 |
| **1280 × 720** | 32 | 56 | 333 × 444 | **556** | **607 → 113 px of the first section visible** |
| 1440 × 900 | 32 | 56 | 352 × 469 | 581 | 632 |

The spec's "menu begins within the first viewport on 1280×720" is satisfied with 113 px to spare, and the sticky nav plus the first section's rule and label are both visible.

At 375×667 the hero is ≈724 px, so the photograph's bottom edge sits ~57 px below the fold. That is the honest cost of never cropping a 3:4 photograph on a 3:4 device; a shorter hero at that width would require either a crop or a background-image, and both are forbidden.

### 4.3 LCP strategy

```astro
<Image
  src={heroImage}
  alt=""
  priority
  widths={[320, 480, 640, 960]}
  sizes="(min-width: 1440px) 352px, (min-width: 768px) 27vw, 100vw"
  format="webp"
  quality={80}
/>
```

- `priority` sets `loading="eager"`, `decoding="sync"`, `fetchpriority="high"` in one prop (documented Astro behaviour) — the spec's explicit high fetch priority and eager loading.
- `widths` + `sizes` produce `srcset`; `width`/`height` come from the source metadata, so the emitted ratio is exactly 3024:4032 and the browser reserves the correct box before the bytes arrive (no CLS).
- `alt=""` is deliberate: the photograph is atmosphere, the `h1` carries the brand, and an empty alt avoids inventing a new i18n key (new copy is out of scope).
- `og:image` is generated in `BaseLayout.astro` with `getImage({ src: heroImage, width: 900, format: "webp", quality: 80 })` and referenced by its emitted `.src`. The file therefore exists in `dist/` by construction, which is what the `i18n` delta requires.
- Rejected: a `<link rel="preload" as="image" imagesrcset imagesizes>` for the hero. It duplicates the srcset string in two places, and the image is discovered in the first HTML parse anyway.

### 4.4 Alternatives rejected

| Alternative | Why rejected |
| --- | --- |
| `min-height: 56vh` on the hero | The letter of the spec only forbids `100vh`/`100dvh`, but any viewport unit re-introduces the dependency the requirement exists to remove: the photograph's rendered size would change with browser chrome. |
| `object-fit: cover` inside a fixed 3:4 frame | Cropping a 3:4 photograph into a 3:4 frame crops nothing, so the property is dead weight; and the moment a 4:3 or 1:1 photograph is added to the hero slot it starts destroying the composition silently. Absence is the safer invariant. |
| Keep the CSS `background-image` and just change the height | Forbidden by the requirement, and it is why the photograph has no `srcset`, no dimensions, and no priority today. |
| Photograph above the text on mobile | Better LCP on phones, worse reading order: a visitor would meet a photograph before the café's name. The brand name wins. |

---

## 5. Decision 3 — Grid column model

### 5.1 Model

```css
.menu-section__grid {
  display: grid;
  grid-template-columns: 1fr;                       /* <768 */
  column-gap: clamp(1.25rem, 3vw, 2rem);
  row-gap: clamp(2rem, 4vw, 3rem);
  align-items: start;                               /* cells keep their own height */
  grid-auto-rows: auto;                             /* never 1fr */
  max-width: var(--max-width);
  margin-inline: auto;
}
@media (min-width: 768px)  { .menu-section__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .menu-section__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
```

`minmax(0, 1fr)` rather than `1fr`: a long unbroken product name cannot force a column wider than its share, which is the mechanism that would produce horizontal overflow at 375 px.

### 5.2 What happens with aspect-preserving cells **[measured in design]**

| Viewport | Content width | Columns | Column width | 3:4 image height | 1.4538 image height | Intra-row difference |
| --- | --- | --- | --- | --- | --- | --- |
| 375 | 335 | 1 | 335 | 447 | 230 | n/a — one cell per row |
| 768 | 707 | 2 | 342 | 456 | 235 | 221 |
| 1024 | 960 | 3 | 300 | 399 | 206 | 193 |
| ≥1100 | 1100 | 3 | 345 | 460 | 238 | **222** |

Because `align-items: start`, each cell's box ends where its own content ends. In a row that mixes a 3:4 portrait with the one 1.4538 landscape (`espresso-leche-mediano`), the shorter cell leaves up to 222 px of field beneath its text at ≥1100 px. The row gap (32 px) then separates it from the next row.

That whitespace is the accepted price of the two hard constraints: **never crop** and **never force a common height**. It is not hidden, not filled with a decorative block, and not "fixed" by stretching the photograph.

Reading order is row-major, which is why the model is a grid and not CSS multi-column or masonry: column-major flow would scramble the sequence of prices inside a sub-category, and a menu's order is content.

### 5.3 375 px check

Content width 335 px inside 20 px gutters. Single column. `minmax(0, 1fr)` prevents blowout; `sizes` for the product images resolves to `calc(100vw - 2.5rem)` = 335 px; the hero's full-bleed uses the negative-margin formula rather than `100vw`. No element in the model can exceed the viewport: no fixed widths above 335 px, no negative inline margins other than the hero's balanced pair, and the nav scrolls horizontally inside its own `overflow-x: auto` container (unchanged behaviour).

### 5.4 Alternatives rejected

| Alternative | Why rejected |
| --- | --- |
| CSS multi-column (`columns: 3`) or masonry | Column-major placement breaks the menu's reading order and the price sequence. Attractive layout, wrong information architecture. |
| Uniform `aspect-ratio` boxes with `object-fit: cover` | That is exactly the defect being removed (180 px box, 53% of the hero discarded, compositions destroyed). |
| Four columns at ≥1280 | Shrinks photographs to ~257 px and only reduces the slack to ~167 px — it pays with the photography-led priority to buy a smaller hole. |
| `align-items: end` (align the price line instead of the image top) | Aligns the money column across a row, but ragged tops on a wall of photographs read as broken, whereas ragged bottoms read as air. |

---

## 6. Decision 4 — `astro:assets` mechanism

### 6.1 Destination and move

| From | To |
| --- | --- |
| `public/images/hero.webp` | `src/assets/hero.webp` |
| `public/images/products/<name>.webp` (31) | `src/assets/products/<name>.webp` (31) |

`git mv` for all 32 files, then delete the now-empty `public/images/` tree. Renames at 100% similarity cost zero changed lines but **32 files in the diff** — a review-surface cost the task phase must state explicitly.

`public/` files are served raw and cannot be optimized: that is the reason the contract changes rather than a stylistic preference.

### 6.2 `menu.ts` imports and the new type

```ts
import type { ImageMetadata } from "astro";
import budinLimonAmapola from "../assets/products/budin-limon-amapola.webp";
// … 30 more, camelCase identifiers derived from the file names

export interface Product {
  id: string;
  name: I18nRecord;
  description: I18nRecord;
  price: number;
  category: Category;
  subCategory?: string;
  image: ImageMetadata | "";   // was: string
}
```

- 31 product entries change `image: "/images/products/x.webp"` → `image: x` (the imported binding).
- **63 entries keep `image: ""` unchanged.** They render a glaze tile and emit no `<img>`; they are not deleted, and the count may only fall by assigning a photograph.
- No product may retain a string path into `public/`. With `image: ImageMetadata | ""`, a string is a type error, which is the enforcement mechanism.
- `src/data/espresso-leche-grande.HEIC` is not imported and stays where it is (stray, out of scope).

### 6.3 Render policy

```astro
{product.image ? (
  <Image
    src={product.image}
    alt={name}
    widths={[240, 360, 480, 720]}
    sizes="(min-width: 1100px) 346px, (min-width: 1024px) 32vw, (min-width: 768px) 46vw, calc(100vw - 2.5rem)"
    format="webp"
    quality={80}
  />
) : (
  <div class="product-cell__glaze" role="img" aria-label={name} />
)}
```

- `widths`/`sizes` are derived from the measured column widths in §5.2: 346 px is the widest rendered column, so 720 w covers a 2× display; 240 w covers the smallest 1× case.
- `format="webp"` on every image. **AVIF rejected**: it would double the derivative count (248 files), `sharp`'s AVIF encoder is markedly slower than its WebP encoder, and `<Picture>` doubles the markup and the srcset for a gain that is marginal on images already capped at 720 px.
- Intrinsic `width`/`height` come from the imported metadata, so every emitted `<img>` carries the source ratio.
- `loading="lazy"` and `decoding="async"` are Astro defaults for non-`priority` images; they must not be overridden — 31 photographs must not compete with the hero.
- The image element needs `width: 100%; height: auto; display: block` in the cell's CSS: the global reset only sets `max-width: 100%`, and without `height: auto` the `height` attribute would win and render a 4032 px-tall image.
- The glaze node takes its colours from the data module through custom properties (`--glaze-fill`, `--glaze-rim`), so no colour literal appears in the component.

### 6.4 Build-graph consequences

| Consequence | Detail |
| --- | --- |
| Modules in the graph | 31 product assets + 1 hero, imported statically by `menu.ts` and `BaseLayout.astro`. |
| Derivatives per build | 31 × 4 widths = 124 product files, plus 4 hero widths and 1 OG image = **129 encoded images**. |
| Build time | Materially higher than today's copy-only build. First `npm run build` and the first dev-server request for each image now run `sharp`. This is a real cost, not a footnote. |
| `dist/` shape | Derivatives land in `dist/_astro/`; `dist/images/` disappears entirely. |
| Repository size | Unchanged: the 23.7 MB of originals move, they are not copied, and git keeps them in history either way. |
| External URLs | `/images/hero.webp` and `/images/products/*.webp` stop existing. Nothing in the repo references them after the change; any externally shared link to them dies. |
| Deployment | If the host serves `dist/` incrementally, stale files under `/images/` must be purged, or the old unoptimized bytes stay publicly reachable. |

### 6.5 Why this is atomic

`Product.image` changing from `string` to `ImageMetadata | ""` breaks `ProductCard` the instant `menu.ts` changes; `<Image>` breaks the moment the assets leave `public/`; the glaze map breaks `ProductCard` the instant `categoryGradients` stops existing. Three edits, one build graph, one review. Splitting them produces a commit that does not compile — which is the definition of "cannot be split".

### 6.6 Sequence — build-time image pipeline

```
 astro build
   │
   ├─ menu.ts  ── 31 × import "../assets/products/*.webp"
   │                 └─ Vite asset graph → ImageMetadata { src, width, height, format }
   │
   ├─ ProductCell.astro  <Image widths={[…]} sizes={…} format="webp" quality={80}>
   │        │
   │        ├─ astro:assets → sharp → dist/_astro/<name>.<hash>.<w>.<hash>.webp   × 4 widths
   │        └─ emits <img src srcset sizes width height loading="lazy" decoding="async">
   │
   ├─ Hero.astro  <Image priority widths={[320,480,640,960]}>
   │        └─ dist/_astro/hero.<hash>.<w>.<hash>.webp  × 4
   │
   └─ BaseLayout.astro  getImage({ src: heroImage, width: 900 })
            └─ dist/_astro/hero-og.<hash>.webp  →  <meta property="og:image">
                     │
                     ▼
 browser: parses <img sizes> → resolves the layout width → picks one candidate from
          srcset → issues exactly one request per rendered image
```

---

## 7. Decision 5 — Glaze tile library

### 7.1 Shape

```ts
// src/data/category-visual.ts
import type { Category } from "./menu";

export type GlazeToken = { fill: string; rim: string };

export const glazeTiles: Record<Category, GlazeToken> = {
  cafe:                   { fill: "#5B3C2B", rim: "#79604F" }, // walnut dark
  "sin-cafe":             { fill: "#C4956A", rim: "#AB805B" }, // ochre / gold
  "pasteleria-panaderia": { fill: "#D8D2BF", rim: "#BAAE9B" }, // ceramic light
  "opciones-saladas":     { fill: "#C4956A", rim: "#AB805B" }, // ochre / gold
  menus:                  { fill: "#5B3C2B", rim: "#79604F" }, // walnut dark
  promos:                 { fill: "#708C64", rim: "#899D7A" }, // brand green, object colour
};
```

- **Four distinct fills** (within the spec's 4–5), keyed over all six categories so no cell can resolve `undefined`.
- Every fill is a colour measured in the photography: walnut dark `#5B3C2B` (mean of the darkest half), ceramic light `#D8D2BF` (mean of the brightest decile), ochre `#C4956A` (the owner's gold, demoted from a text colour to a material), green `#708C64` (the brand value, exactly).
- Adjacent categories never share a fill: `cafe`/`menus` share walnut but are five sections apart; `sin-cafe`/`opciones-saladas` share ochre and are separated by the pastry section.
- `categoryGradients` and every `linear-gradient` string are deleted. No `linear-gradient` may exist anywhere under `src/`.

### 7.2 Rim derivation (reproducible, no invented colours)

Rim = fill mixed 24% toward the opposite anchor: light fills mix toward walnut `#5B3C2B`, dark fills mix toward ceramic `#D8D2BF`. Two measured anchors, one constant, four outputs:

| Fill | Mix | Rim | Rim vs fill |
| --- | --- | --- | --- |
| `#D8D2BF` ceramic | +24% walnut | `#BAAE9B` | 1.44 |
| `#C4956A` ochre | +24% walnut | `#AB805B` | 1.32 |
| `#5B3C2B` walnut | +24% ceramic | `#79604F` | 1.69 |
| `#708C64` green | +24% ceramic | `#899D7A` | 1.27 |

The same constant produces `--color-border` (ceramic +24% walnut = `#BAAE9B`, 1.97:1 on the field) and `--color-border-inverse` (walnut +24% ceramic = `#79604F`, 1.93:1 on the wood ground). One derivation rule for every non-token colour in the change.

Note: the ceramic tile's rim is numerically identical to `--color-border`. That is a consequence of the shared derivation, not a copy-paste error; the data module cannot reference a CSS custom property, so the two values must move together if the constant ever changes.

### 7.3 Rim treatment

```css
.product-cell__glaze {
  aspect-ratio: 3 / 4;              /* the tile's own frame, not a photograph's */
  background-color: var(--glaze-fill);
  box-shadow: inset 0 0 0 1px var(--glaze-rim);
}
```

A 1 px **inner** rim, not a border: `box-shadow` inset does not participate in layout, so the tile keeps its exact width and the rim never shifts the hairline below it. No gradient, no `<img>`, no hidden duplicate node, no `onerror`.

The tile is a fixed 3:4 frame because there is no photograph to respect. That is the one place in the design where an aspect ratio is imposed, and it is imposed on a coloured rectangle, not on a photograph.

Tile-to-field contrast: walnut 8.93:1, green 3.38:1, ochre 2.42:1, ceramic 1.37:1. The ceramic tile is defined by its rim (1.97:1 against the field) rather than by its fill — which is precisely what a glazed edge is for.

### 7.4 The green swatch, and the one scenario it touches

`promos` uses the brand green as a tile fill. This is permitted: the palette requirement lists "glaze swatches" as one of green's three legal roles, and the "No text is placed on the brand green" scenario states that "the only green-ground elements are decorative marks, rules, and glaze swatches". No text sits on the swatch — the name, description, and price are below the hairline, on the field.

It does brush against the scenario "Cream field restored and green never a field", which asserts that "no section, page, or product cell declares a background whose value is `#708C64`". Resolution recorded for `verify`: the **cell container** declares no background at all (that is the de-carding requirement); the green is the fill of a `role="img"` decorative swatch inside the cell's media area, which the same requirement permits by name. A grep for `#708C64` in `src/components/` returns nothing — the value lives only in `src/data/category-visual.ts`.

If the owner prefers an unambiguous reading, the zero-cost alternative is `promos` → ceramic `#D8D2BF`, leaving three distinct fills. It is a one-line data change and does not affect any other decision.

### 7.5 Alternatives rejected

| Alternative | Why rejected |
| --- | --- |
| Six category gradients, re-authored | A gradient is a two-stop abstraction with no referent in the photography, and the requirement abolishes it by name. |
| `color-mix()` for the rim | Computes a colour at paint time that cannot be reviewed from source or asserted against a hex. The whole palette contract is "one declared value, verifiable arithmetically". |
| A single shared rim token | Invisible on either the dark or the light fill; a 1 px line needs to be lighter than walnut and darker than ceramic, and no single value does both. |
| Photograph-less cells left empty | Reads as a broken image, which is the defect the device exists to remove. |

---

## 8. Decision 6 — `t` vs `tRecord`

### 8.1 The two helpers, as implemented

| Helper | Signature | Reads from | Failure mode |
| --- | --- | --- | --- |
| `t` | `t(key: string, locale: Locale)` | `src/i18n/{locale}.json` | Missing key returns **the key string itself** — silently renders `footer.location.text` on the page. |
| `tRecord` | `tRecord(value: string \| I18nRecord, locale: Locale)` | inline `{ es, en }` records | Missing locale returns **`undefined`** — renders an empty node. A plain string passes through unchanged. |

Both fail silently in opposite directions, which is why the rule has to be written down rather than inferred.

### 8.2 The rule

> `tRecord(value, locale)` for every inline `{ es, en }` record. `t(key, locale)` for every key in `src/i18n/{locale}.json`. No third mechanism.

### 8.3 Call-site table (normative for `apply`)

| File | Expression | Helper | Reason |
| --- | --- | --- | --- |
| `MenuSection.astro` | `section.label` | `tRecord` | inline record in `menu.ts` |
| `MenuSection.astro` | `section.subCategories.en[i]` | direct index | parallel array, not a record |
| `MenuSection.astro` | `protocolo.title`, `protocolo.content` | `tRecord` | inline records |
| `MenuSection.astro` | `menu.empty` | `t` | JSON key |
| `ProductCell.astro` | `product.name`, `product.description` | `tRecord` | inline records |
| `ProductListItem.astro` | `product.name`, `product.description` | `tRecord` | inline records |
| `SectionNav.astro` | `cat.label` | `tRecord` | inline record |
| `SectionNav.astro` | `ES` / `EN` | derived from `locale` | not a translation; `nav.es`/`nav.en` are deleted |
| `Hero.astro` | `hero.tagline` | `t` | JSON key |
| `Hero.astro` | `Rosetta Café de Especialidad` | literal | brand name, identical in both locales, mandated verbatim by the spec |
| `Footer.astro` | `footer.*`, including `footer.location.text` | `t` | JSON keys |
| `BaseLayout.astro` | `meta.title`, `meta.description` | `t` | JSON keys |
| `BaseLayout.astro` | `theme-color` value | literal hex | spec-mandated `#F7F3EC`; `src/layouts/` is outside the palette requirement's grep surface |

### 8.4 Resolution map

```
 component
   │
   ├─ value is a string that names a JSON key  ──► t(key, locale)
   │        (footer.hours.text, meta.description, menu.empty)
   │        └─ es.json / en.json → value, or the key itself if missing
   │
   └─ value is { es, en } built in menu.ts     ──► tRecord(value, locale)
            (product.name, product.description, category.label,
             subCategory label, protocolo.title, protocolo.content)
            └─ value[locale]
```

### 8.5 Spec defects this decision closes

The spec set uses `t(record, locale)` in places where the code must use `tRecord`, because the canonical `i18n` requirement names the record helper `t`:

| Location | Text | Correct for code |
| --- | --- | --- |
| `openspec/specs/i18n/spec.md` L47 | "provide a `t(record, locale)` helper … returns the locale-specific value from a record" | The helper exists and is named `tRecord`. |
| `openspec/specs/product-menu/spec.md` L35 | "name and description resolved via `t(product, locale)`" | `tRecord(product.name, locale)` / `tRecord(product.description, locale)` |
| `openspec/specs/product-menu/spec.md` L151 | "section name … via `t(section, locale)`" | `tRecord(section.label, locale)` |
| `openspec/changes/menu-redesign/specs/product-menu/spec.md` L150 | "displays the section name prominently via `t(section, locale)`" | `tRecord(section.label, locale)` |

The delta at L150 is a carried-forward typo, not a requirement change: `t(section, locale)` would look up a JSON key named after an object and render `[object Object]`. `apply` must not "fix" the code to match it, and `verify` must not flag the code for diverging from it. The canonical texts are documentation debt for the archive step, outside this change's edit surface.

---

## 9. Token table

All declarations live in exactly one place: the `:root` block of `src/styles/global.css`.

### 9.1 Colour

| Token | Current | New | Role |
| --- | --- | --- | --- |
| `--color-primary` | `#4a3728` | `#4A3728` | Headings, product names; footer ground. Value kept, role narrowed. |
| `--color-secondary` | `#c4956a` | `#8A5A2B` | **Prices only.** 5.31:1 on the field. |
| `--color-bg` | `rgb(112, 140, 100)` | `#F7F3EC` | Page field; the ground every section renders on. |
| `--color-surface` | `#f5ede4` | `#E6E1D3` | The only non-field surface: the Protocolo block. Never a price ground (4.49:1). |
| `--color-text` | `#2c1810` | `#2C1810` | Body text, product and list descriptions. |
| `--color-text-light` | `#f5ede4` | `#D4C5B5` | Every footer text role. 6.67:1 on the wood ground. |
| `--color-border` | `#e8ddd3` | `#BAAE9B` | Hairlines: the photograph/text rule, sub-category rule, dotted leaders. 1.97:1. |
| `--color-border-inverse` | — (new) | `#79604F` | Footer divider and icon hover ground. 1.93:1 on wood. |
| `--color-green` | — (new) | `#708C64` | Accent **fill** only: category rule, target-section marker, hover underline, glaze swatch. 3.38:1. |
| `--color-green-ink` | — (new) | `#4E6B44` | Green **text**: section and sub-category labels, `:target` label, focus ring. 5.41:1. |

Preserved names, as the spec requires: `--color-primary`, `--color-secondary`, `--color-bg`, `--color-surface`, `--color-text`, `--color-border`. `--color-text-light` is also kept (it had one use site) with a new value.

**Abolished**: `--section-accent` (never a `:root` token, but written as an inline custom property at six sites), the per-page `sectionAccents` records in both pages, and `categoryGradients`.

### 9.2 Type, space, and layout

| Token | Current | New |
| --- | --- | --- |
| `--font-heading` | `"Playfair Display", Georgia, serif` | `"Petrona", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif` |
| `--font-body` | `"Inter", system-ui, -apple-system, sans-serif` | `"Archivo", "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif` |
| `--text-base` … `--text-4xl` | — (13 hardcoded sizes across components) | the seven-step ladder in §3.2 |
| `--leading` | — | `1.5` |
| `--leading-display` | — | `1.15` |
| `--measure` | — | `68ch` |
| `--max-width` | `1100px` | `1100px` (kept) |
| `--gutter` | — | `clamp(1.25rem, 4vw, 2rem)` |
| `--space-2xs` | — | `0.5rem` |
| `--space-xs` | — | `0.75rem` |
| `--space-sm` | — | `1.25rem` |
| `--space-md` | — | `2rem` |
| `--space-xl` | — | `clamp(2.5rem, 6vw, 4rem)` |

`html { scroll-padding-top: 4.5rem }` replaces the current 5 rem plus the inert `scroll-margin-top: 6rem` on `.menu-section__heading`. One offset, and it actually applies, because anchors target `<section id="section-…">`.

### 9.3 Contrast, recomputed from the declared values

| Foreground | Background | Ratio | Need | Use |
| --- | --- | --- | --- | --- |
| `#2C1810` | `#F7F3EC` | **15.25** | 4.5 | body |
| `#4A3728` | `#F7F3EC` | **10.16** | 4.5 | headings, names |
| `#8A5A2B` | `#F7F3EC` | **5.31** | 4.5 | prices |
| `#4E6B44` | `#F7F3EC` | **5.41** | 4.5 | section labels |
| `#2C1810` | `#E6E1D3` | **12.91** | 4.5 | protocolo body |
| `#4E6B44` | `#E6E1D3` | **4.58** | 4.5 | protocolo label |
| `#8A5A2B` | `#E6E1D3` | 4.49 | 4.5 | **forbidden** — no price on the surface |
| `#D4C5B5` | `#4A3728` | **6.67** | 4.5 | all footer text |
| `#D4C5B5` | `#79604F` | **3.46** | 3.0 | footer icon on hover |
| `#FFFFFF` | `#8A5A2B` | **5.87** | 4.5 | legacy nav hover, passes if any surface keeps it |
| `#708C64` | `#F7F3EC` | **3.38** | 3.0 | decorative marks only |
| `#BAAE9B` | `#F7F3EC` | 1.97 | — | hairline (decorative) |
| `#79604F` | `#4A3728` | 1.93 | — | footer divider (decorative) |

Six former failures: price 2.31 → 5.31, nav hover 2.67 → 5.41 (text on the field, not white on gold), footer copyright 4.12 → 6.67, list description 3.83 → 15.25, sub-category heading 1.40/2.31 → 5.41. All fixed by value or role, inside the owner's palette.

---

## 10. Component-level change list

Ordered by slice. Paths and class names are the ones that exist today.

### Slice 1 — Foundations (tokens, type, head, hero)

| File | Change |
| --- | --- |
| `src/styles/global.css` | Replace the `:root` block (10 colours, 2 families, 7-step scale, 2 leading values, measure, gutters, 5 space steps). Delete the duplicated `.section-nav*` block (L96–135). Delete the unreachable `:nth-child` block (L138–144). Delete `.sub-category__heading` (L147–157). `body` L160–164 → `--text-base`, `--color-bg`, `--color-text`. `html { scroll-padding-top: 4.5rem }`. |
| `src/layouts/BaseLayout.astro` | One Google Fonts `<link>` (Petrona 500 + Archivo 400/500/600, `display=swap`). Add `meta description`, `og:title`, `og:description`, `og:image` (via `getImage`), `og:locale`, `twitter:card`, `theme-color`, three `hreflang` alternates. Derive `title`/`description` from `t()` and drop the unused `title` prop. |
| `src/assets/hero.webp` | Moved from `public/images/hero.webp`. |
| `src/components/Hero.astro` | Replace the background-image band with the two-column grid and `<Image priority>`. Delete `100dvh`, the scrim gradient, `#fdf8f3`, `#d4c5b5`, and the three hardcoded sizes. |
| `src/i18n/es.json`, `src/i18n/en.json` | Add `meta.title`, `meta.description`. Delete `nav.es`, `nav.en`, `protocolo.title`. Keep `footer.location.text` (it becomes rendered). |

Slice 1 closes: price 2.31 → 5.31, nav hover 2.67 → 5.87. It does **not** close the sub-category heading failure (still on a green field until slice 2) or the footer copyright (slice 3). It must not be judged on those.

### Slice 2 — Menu body (atomic: cells + typed data + image pipeline)

| File | Change |
| --- | --- |
| `src/data/category-visual.ts` | Replace `categoryGradients` with `glazeTiles` + `GlazeToken` (§7.1). |
| `src/data/menu.ts` | 31 static imports; `Product.image: ImageMetadata \| ""`; 31 entries rewired; 63 entries unchanged. |
| `src/assets/products/*.webp` | 31 files moved from `public/images/products/`. |
| `src/components/ProductCard.astro` → `ProductCell.astro` | Rename the file and its classes. Delete the card container, radius, shadow, hover lift, the inline `onerror`, the hidden fallback node, and the 180 px box. Add `<Image>` or the glaze tile, one hairline, the price on `--color-secondary` with `tabular-nums`, right-aligned. |
| `src/components/MenuSection.astro` | Remove `sectionAccent` from `Props` and the inline style. Section header becomes rule-plus-label (pseudo-element rules, `--color-green` / `--color-border`, label in `--color-green-ink`). New grid model (§5.1). Remove both milky panels and the dashed protocolo border. Protocolo block on `--color-surface`. |
| `src/components/ProductListItem.astro` | Description → `--color-text`, no `opacity`. Price → `--color-secondary`, `tabular-nums`, right-aligned. Leaders kept. |
| `src/pages/index.astro`, `src/pages/en/index.astro` | Delete `sectionAccents` and both `sectionAccent` props; delete the `protocolo` accent literal. |

Slice 2 closes: sub-category heading 1.40/2.31 → 5.41, list description 3.83 → 15.25. It also removes the last `--section-accent` site and the last gradient.

### Slice 3 — Chrome

| File | Change |
| --- | --- |
| `src/components/SectionNav.astro` | Delete the pill chrome; plain text links, `padding-block: 0.75rem` for 48 px targets. Hover/focus = 2 px `--color-green` underline; focus-visible ring in `--color-green-ink`. Delete the dead `--active` class (L25, L97–101). Ground `--color-bg`. |
| `src/components/Footer.astro` | Render `footer.location.text` through `t()` with `white-space: pre-line` (which also fixes `footer.hours.text`, currently collapsed to one line). Replace `#fff`, `#d4c5b5`, and all three white alphas with `--color-text-light` / `--color-border-inverse`. Divider → `--color-border-inverse`. |

Slice 3 closes: footer copyright 4.12 → 6.67.

---

## 11. Slice ordering and coupling

| Coupling | Why it cannot be split |
| --- | --- |
| `category-visual.ts` + `ProductCell.astro` | `categoryGradients` stops existing; the only importer is the card. |
| `menu.ts` image type + 32 asset moves + `<Image>` in the cell | A partial migration does not compile (§6.5). |
| `BaseLayout` `og:image` + the hero asset | `og:image` must reference a build-emitted file that exists in `dist/`; while the hero lives in `public/` that requirement cannot be met. **This is why the hero moved into slice 1 instead of slice 3**, contrary to the proposal's tentative grouping. |
| Token block + every component that consumes tokens | Slice 1 changes values and roles only, never names, so consumers keep compiling and rendering; that is the property that makes the rest of the chain independent. |

Ordering:

```
slice 1 (foundations: tokens, head, hero)   ← must land first
   ├── slice 2 (menu body, atomic)          ← independent of slice 3
   └── slice 3 (chrome)                     ← independent of slice 2
```

Review-budget arithmetic (400 changed lines per review, per `openspec/config.yaml`): slice 1 ≈ 180, slice 2 ≈ 240, slice 3 ≈ 90. Slice 2 is the largest and is the one to watch; the 32 renames add file count, not line count, and should be reviewed as one batch.

Separable decisions, if the owner wants to shorten the chain: the hero geometry (§4) can land inside slice 3 as originally proposed *only if* `og:image` is deferred to slice 3 as well; the `:target` marker and the footer `white-space: pre-line` fix are both droppable without touching any other decision.

---

## 12. Verification strategy

No visual-regression tool exists in this project, and none is proposed. Every decision below has a mechanical proof.

### 12.1 Types and build

- `npx astro check` → **0 errors** (baseline: 14 files, 0 errors, 0 warnings, 0 hints).
- `npm run build` → **2 pages** (`/index.html`, `/en/index.html`).
- `dist/_astro/` contains derivative images; `dist/images/` does not exist.

### 12.2 Source assertions (grep, run per slice)

| Assertion | Command shape | Expected |
| --- | --- | --- |
| Accent abolished | `rg "section-accent" src/` | 0 |
| No gradients | `rg "linear-gradient" src/` | 0 |
| No runtime fallback | `rg "onerror" src/` | 0 |
| No old map | `rg "categoryGradients" src/` | 0 |
| No colour literals in components/pages | `rg "#[0-9a-fA-F]{3,8}\|rgb\(a?\|hsl\(" src/components src/pages` | 0 |
| No colour literals in the stylesheet outside `:root` | same pattern on `src/styles/global.css`, excluding L1–`} ` of `:root` | 0 |
| No viewport height on the hero | `rg "100vh\|100dvh\|svh\|lvh" src/components/Hero.astro` | 0 |
| No ad-hoc font sizes | `rg "font-size:\s*[0-9]" src/` | 0 |
| 63 imageless, 31 imported | `rg -c 'image: ""' src/data/menu.ts` / `rg -c 'from "\.\./assets/products/' src/data/menu.ts` | 63 / 31 |
| Two translation systems intact | every `t(` argument in `src/components` is a JSON key; every `tRecord(` argument is an inline record | per §8.3 |
| Font requests | `<link>` count in `dist/index.html` pointing at `fonts.googleapis.com` | 1, with `display=swap` |

### 12.3 Built-HTML inspection

`dist/index.html` and `dist/en/index.html`:

- Hero `<img>` carries `fetchpriority="high"`, `loading="eager"`, `srcset`, `sizes`, `width="3024"`, `height="4032"`, and a `/_astro/…webp` source.
- Every photographed product emits exactly one `<img>`; every imageless product emits zero `<img>` and one `role="img"` swatch.
- `theme-color` = `#F7F3EC` on both pages; `og:locale` differs between them; three `hreflang` links each; `og:image` path resolves to an existing file in `dist/`.
- Prices carry `tabular-nums` and are right-aligned.

### 12.4 Contrast

Recompute every pair in §9.3 from the declared hexes with the WCAG 2.1 relative-luminance formula. No pair ships below its threshold; `#8A5A2B` on `#E6E1D3` is the one forbidden combination (4.49) and is asserted by absence, not by ratio.

### 12.5 Geometry

Arithmetic, not screenshots: the grid and hero numbers in §4.2 and §5.2 are reproducible from the clamp values. A reviewer verifies at 375, 768, 1024, and 1280 px that (a) the menu begins above 720 px on the 1280×720 viewport, (b) no cell is stretched, (c) no horizontal scrollbar appears at 375 px.

### 12.6 The one browser check

`font-variant-numeric: tabular-nums` (§3.6) is the only claim source inspection cannot settle: render `1111` and `9999` in the price style and compare rendered widths. Equal within 0.5 px passes; otherwise apply the §3.6 contingency.

### 12.7 What review must look at (no tool can)

Per slice: the six former failures are legible in context; prices form a column; every photograph keeps its composition; imageless products read as deliberate tiles rather than missing images; the hero is not cropped and its bottom edge falls where §4.2 says; both locales are structurally identical; no `undefined`, key name, or `[object Object]` appears anywhere.

---

## 13. Risks this design introduces (beyond proposal R1–R11)

| # | Risk | Mitigation |
| --- | --- | --- |
| **D1** | **`sharp` is an optional dependency of `astro`** (`^0.34.0`), not a declared one. It is installed at 0.34.5, so the pipeline works today; `npm ci --omit=optional`, or a future Astro that drops the optional dep, breaks every image with an unhelpful error. | Recommend declaring `sharp` explicitly in `devDependencies`. That is a `package.json` change and needs owner approval — see §14. Until then, note it in the slice-2 PR body. |
| **D2** | **Build time.** 129 encoded images per build instead of 32 file copies. First build and first dev-server request per image now run `sharp`. | Accepted as the cost of the optimization. Stated in the slice-2 PR so a slow build is not mistaken for a regression. |
| **D3** | **Diff surface.** 32 binary renames inflate the file list of a ~240-line slice; a reviewer scanning file count will misjudge the size. | The PR body must state the rename count and the changed-line count separately. |
| **D4** | **Dead public URLs.** `/images/hero.webp` and `/images/products/*.webp` stop existing. | Nothing in the repo references them after the change. Any externally shared link dies; the host must purge stale files if it deploys incrementally. |
| **D5** | **Font swap reflow.** Replacing Playfair/Inter with Petrona/Archivo changes fallback metrics, and the CDN cannot carry `size-adjust` overrides. | Bounded to a line of text in the hero; the photographs carry intrinsic dimensions so no image CLS. If it proves visible, the §3.5 self-hosting alternative removes it at the cost of two dependencies. |
| **D6** | **Tabular figures unproven** (§3.6). | Gate plus a zero-dependency contingency. |
| **D7** | **Green swatch vs "green never a field"** (§7.4) — a verifier reading the scenario mechanically will flag `promos`. | Interpretation recorded; a one-line data alternative exists. |
| **D8** | **`#8A5A2B` on `--color-surface` is 4.49** — one hundredth short. | Prices are forbidden on the surface; recorded in §9.1 and §9.3 so a future panel cannot inherit the trap. |
| **D9** | **Mobile hero is ~724 px tall at 375×667**, so the photograph's bottom edge is below the fold. | Measured and deliberate; the alternative is a crop or a background image, both forbidden. Flagged so a reviewer does not read it as a bug. |
| **D10** | **`theme-color` duplicates `--color-bg` as a literal** in `BaseLayout.astro`. CSS custom properties cannot be read in the head. | The spec mandates both values. `src/layouts/` is outside the palette requirement's grep surface; a comment in the layout points at the token. |
| **D11** | **Both pages stay duplicated.** The accent removal and the head work touch `index.astro` and `en/index.astro` twice. | Out of scope to fix (no i18n helper refactor). Slice diffs must be compared between the two files to catch drift. |
| **D12** | **The glaze tile imposes a 3:4 frame** while photographs keep their own ratios. | Intentional and visible in review: tiles are objects, photographs are photographs. |

---

## 14. Decisions pending owner

| # | Decision | Recommendation | Cost of the alternative |
| --- | --- | --- | --- |
| **P1** | Declare `sharp` explicitly in `devDependencies` (currently an optional dependency of `astro`). | Yes — one line, removes a silent build-time failure mode. | If declined: the pipeline works today and breaks silently if optional deps are omitted or Astro changes. |
| **P2** | `promos` glaze uses the brand green (permitted by the palette's "glaze swatches" role) or ceramic (unambiguous). | Green — it is the only place the brand colour becomes a material, and it is what the exploration's device is for. | Ceramic: one line in `src/data/category-visual.ts`, three distinct fills instead of four. |

Nothing else in this design needs approval. The typeface pairing uses the existing Google Fonts CDN and adds no dependency, which was the only decision with a plausible dependency cost.

### Resolution (owner, 2026-10-24)

Both pending decisions are closed. The table above is kept as the record of what was asked.

- **P1 — RESOLVED: declare `sharp` explicitly in `devDependencies`.** The image slice carries a one-line `package.json` addition alongside the `src/assets/` migration, so the build dependency is stated rather than inherited from `astro`'s optional dependencies.
- **P2 — RESOLVED: `promos` glaze uses the brand green.** The green swatch stands, and the "green is never a field" rule continues to apply to backgrounds and text grounds only. `src/data/category-visual.ts` keeps four distinct fills.
