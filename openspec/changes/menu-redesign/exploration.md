# Exploration: menu-redesign

**Change**: `menu-redesign`
**Phase**: explore
**Date**: 2026-10-17
**Brief (verbatim, ES)**: *"rediseña el menú teniendo en cuenta los colores de marca y las imágenes, que se vea minimalista y profesional, sin perder los colores de calidez"*
**Brief (operational reading)**: redesign the menu honoring brand colors and product imagery so it reads minimalist and professional without losing the warmth.
**Scope of this phase**: investigation only. No source file was created or modified.
**Revision**: r2. This supersedes an earlier r1 artifact for the same change (same path). Section 0 lists every factual correction, with the reason. r1's structure and its two directions are retained and extended to three.

---

## 0. Corrections carried into this revision

| # | r1 claim | Verified reality | Why it matters |
| --- | --- | --- | --- |
| C1 | "`sharp` 8.17.3 is available" | `sharp` is **0.34.5** (`node -e "require('sharp/package.json').version"`) | Provenance of r1's k-means numbers is unverifiable. §2 below replaces them with a method that is stated and re-runnable. |
| C2 | "`faltan-imagenes.txt` is the authoritative list" of missing photos | **Stale.** It lists 77 entries; `menu.ts` has **63** products with `image: ""`. **11** of its entries name a product that now *has* a photo; **24** entries match no product name in `menu.ts`. | `AGENTS.md` repeats this claim. The authoritative source is `image: ""` in `src/data/menu.ts`. Any task derived from `faltan-imagenes.txt` would be wrong. |
| C3 | "Green-dominant pixels peak at 1.9% and are usually 0.0%" | Method-dependent. Measured at 96 px sampling, green-dominant pixels average **3.7%** across 32 images, range **0.0–8.8%**, and pixels within 42 RGB units of the exact brand green average **5.4%**, peaking at 9.6% (`chipa-roquefort`). | The *directional* conclusion (green is scarce in the photography, dominant on the page) survives and is stronger for being measured. The absolute figure in r1 understated green. |
| C4 | Direction A's device rests on "hand-painted linework in pottery red (visible on the plates)" | **Not verifiable by this phase.** The images are photographic content I cannot inspect without reading binary files, which is prohibited here. My saturated-warm-pixel detector returns **19.1%** average, but its top hits are `espresso.webp` 47.4% and `budin-limon-amapola.webp` 34.1% — i.e. it is measuring **coffee and caramel**, not a distinct pottery pigment. | A's `--line #C9554E` is a plausible but **unverified** extraction. A's central premise therefore rests on an unverified reading of image content. See §4.1 and §6/R4. |
| C5 | "`#d4c5b5` and `#fff` … the token is effectively dead" | Correct in substance; precise count is `--color-text-light` = **2 matches** = 1 definition + **1** use site (`Footer.astro` L90), and the footer then hardcodes `#fff` and `#d4c5b5` ×2 for the same text. | Wording only. |
| C6 | Product photos "avg ≈765 KB" | Measured **746.9 KB** avg over 31 files (23,709,224 bytes total). | Wording only. |
| C7 | r1 did not examine the hero image's geometry | `hero.webp` is **3024×4032 — portrait 3:4 (aspect 0.750)** used as a full-viewport `background-size: cover` band. On a 1440×900 desktop that discards **53% of the image height**; on 1280×720, **58%**; on 390×844 mobile, **38% of the width**. | The single most consequential imagery fact for a "redesign honoring the images", and it was missed. See §1.9. |
| C8 | r1 did not examine the i18n layer or the document head | **4 of 11** i18n keys are dead (`footer.location.text`, `nav.es`, `nav.en`, `protocolo.title`) while components hardcode the same strings. `BaseLayout.astro` has **no** `meta description`, **no** Open Graph/Twitter tags, **no** `theme-color`, and **no** `hreflang` alternates. | Both are cheap professionalism wins inside a redesign scope. See §1.7, §1.8. |
| C9 | "Two competing scroll offsets" | Sharper: `scroll-margin-top: 6rem` is on `.menu-section__heading`, but the anchors target `<section id="section-x">`, so **the 6rem never applies to anchor navigation — it is inert**. The effective offset is `html { scroll-padding-top: 5rem }` alone. | Changes what "fix the offset" means. See §1.6. |
| C10 | Brick "passes ≥3 on both grounds" (Direction B) | Verified on `--table` **3.53** and on `--clay` **3.55**, but on `--table-mid` it is **2.93 — below 3**. | B's brick marks must not sit on raised surfaces. See §4.2. |

Everything else in r1 was re-derived and **confirmed**: the four-palette incoherence, the six `--section-accent` sites, the dead alternation, the masked `--color-bg`, the 94/31/43/20 data split, the five AA failures, the owner-authored green lineage, and the spec conflict list.

---

## 1. Current State

### 1.1 Which file / class / token drives which visual decision

| Visual decision | Owner | Mechanism |
| --- | --- | --- |
| Page background (**visible**) | `src/pages/index.astro` L13–20 + L35, L43 · `src/pages/en/index.astro` L12–19 + L34, L42 | `sectionAccents` record → `sectionAccent` prop |
| Section fill | `MenuSection.astro` L29 (writes `--section-accent`), L85 (consumes it) · `global.css` L138–144 | inline custom property → `background` |
| Page background (**masked**) | `global.css` L162 | `body { background-color: var(--color-bg) }` |
| Headings (h1–h3) | `Hero.astro` L38 · `MenuSection.astro` L89, L115, L146 · `ProductCard.astro` L89 · `ProductListItem.astro` L53 · `Footer.astro` L107 | `--font-heading` (Playfair Display) |
| Body text | `global.css` L160–163 + every component | `--font-body` (Inter) |
| Price | `ProductCard.astro` L103–107 · `ProductListItem.astro` L67–73 | `--color-secondary #c4956a`, 1rem / 600, **no `tabular-nums`** |
| Product card container | `ProductCard.astro` L53–68 | `--color-surface`, `radius 12px`, `shadow rgba(0,0,0,.06)`, hover `translateY(-4px)` + `rgba(0,0,0,.12)` |
| Imageless product fill | `src/data/category-visual.ts` L3–10 | `categoryGradients[category]` inline `background` |
| Image-box height | `ProductCard.astro` L70–75 | `height: 180px; object-fit: cover` — a fixed box for every photo, every aspect |
| List-row separator | `ProductListItem.astro` L31–44, L60–65 | `--color-border` + dotted leader |
| Sticky nav chrome | `SectionNav.astro` L33–108 **and** `global.css` L96–135 | duplicated; the scoped copy wins |
| Footer ground | `Footer.astro` L88–92 | `--color-primary #4a3728` + `--color-text-light` (never used again after L90) |
| Sticky offset | `global.css` L93 | `scroll-padding-top: 5rem` (the 6rem at `MenuSection.astro` L94 is inert — see §1.6) |
| Max content width | `global.css` L89 | `--max-width: 1100px` |

### 1.2 The `--section-accent` inventory — the real background story

| # | File | Line | Content |
| --- | --- | --- | --- |
| 1 | `src/pages/index.astro` | 13–20 | `sectionAccents` record — all 6 categories = `"rgb(112, 140, 100)"` |
| 2 | `src/pages/index.astro` | 35 | `sectionAccent={sectionAccents[cat.id]}` |
| 3 | `src/pages/index.astro` | 43 | `protocolo` section, inline `sectionAccent="rgb(112, 140, 100)"` |
| 4 | `src/pages/en/index.astro` | 12–19 | byte-identical record — a divergence waiting to happen |
| 5 | `src/pages/en/index.astro` | 34 | the same pass-through |
| 6 | `src/pages/en/index.astro` | 42 | the same `protocolo` inline accent |

Consumers: `MenuSection.astro` L29 (writer) + L85 (reader). `global.css` L138–144 holds `:nth-child(odd)`/`:nth-child(even)` rules that **both** read `var(--section-accent, …)`, so both fallbacks are unreachable — dead code, 7 lines.

Three verified consequences:

- **The alternation is dead.** Every `MenuSection`, `protocolo` included, receives a non-empty accent, so the inline var is always defined and both `nth-child` fallbacks can never fire. Every section is one flat green rectangle — which also silently breaks `openspec/specs/product-menu/spec.md` → "Section Visual Identity" (scenario: *"the header has a visually distinct background from adjacent sections"*).
- **`--color-bg` is invisible, which is why editing it "did nothing".** `Hero` is `min-height: 100dvh` with a `background-image`; every `MenuSection` paints its own inline accent; `Footer` paints `--color-primary`. `body`'s background only shows through a scroll-bounce. **A redesign must touch both pages.**
- **`--color-bg` and the six accents are the same value stored in seven places.** Collapse them to one source or they will drift.

### 1.3 There are four color systems and they do not agree

1. **`:root` tokens** (`global.css` L77–90), 7 colors. Use-site counts: `--color-primary` 10, `--color-secondary` 12, `--color-border` 11, `--color-text` 10, `--color-surface` 6, `--color-bg` 3 (definition + inert fallback + `body`), `--color-text-light` **1**.
2. **`--section-accent` overrides** — the two pages, six entries, all the same green. This is what the eye sees.
3. **`categoryGradients`** (`category-visual.ts`) — 6 linear gradients, 12 hex stops, **zero overlap with the tokens**.
4. **Loose literals** — outside the token system: 12 gradient hex stops plus `#fdf8f3`, `#d4c5b5`, `#fff`, `rgba(255,255,255,.1/.4/.5/.15)`, `rgba(0,0,0,.02/.06/.12)`, `rgba(44,24,16,.6/.35)`.

There is **no single source of truth for color.**

### 1.4 Lineage — the green is deliberate and owner-authored

| Commit | What it did (verified with `git show`) |
| --- | --- |
| `37a4929` init | `--color-bg: #fdf8f3` (near-white). ES/EN `sectionAccents` were a **per-category near-cream pastel set**: `#f5ede4`, `#eef5e4`, `#f5f0e4`, `#f5ece4`, `#f5e4e4`, `#f0e4f0`; `protocolo` was `#f0f0f0`. |
| `37acace` | Owner changed `--color-bg` `#fdf8f3` → `rgb(112, 140, 100)` and flattened ES's accent record to that one green. |
| `1d1d1c2` | Aligned EN to the ES green, deleting EN's pastel set and its `#f0f0f0`; also shrank `hero.webp` 2,032,808 → 1,614,004 bytes. |

So the green is a **two-commit, deliberate owner decision**, and the owner also deliberately *removed* per-section tint variation. It is brand evidence, not an accident, and this exploration does not propose deleting it.

Two useful readings of that history:

- The alignment went toward the **flatter, less differentiated** state, so the spec's "alternate … to visually separate" requirement was already broken by the owner's own commit.
- The abandoned pastels are design evidence in themselves: **near-cream with a whisper of hue per section**. The owner was already reaching for "quiet cream field plus a hint of hue", which reconciles "minimalist" with the spec's cream-background requirement. That is a strong hint about the direction they want.

`public/favicon.svg` is the only vector brand asset in the repo, and it is **monochrome** (`fill: #000`, `#FFF` under `prefers-color-scheme: dark`). There is no logo file, no brand guide, and no brand hex anywhere except this codebase. The brand mark carries **no color**, which means any color field is a *choice*, and none can be justified as "the logo's color".

### 1.5 Where the "warmth" currently lives — five carriers

1. **Color** — cream cards `#f5ede4`, gold accent `#c4956a`, one flat green field.
2. **Type** — Playfair Display at 2.5→4rem (a classicism that reads as craft).
3. **Rounding** — `border-radius: 12px` on cards and panels, `999px` pills in the nav, `50%` in the footer.
4. **Shadow** — `rgba(0,0,0,.06)` plus a hover lift, on every card, identically.
5. **Imagery** — one hero photograph and 31 warm food photographs.

Three of the five (gold, serif, rounding) are the generic "warm café" kit. The two genuinely ownable carriers — the photography — are the most under-used: 31 strong photos are force-cropped into identical 180px boxes inside identical rounded cards, so they read as a repeating template rather than as 31 different things.

**Motion**: there is no non-user-triggered motion anywhere — only hover and color transitions. Per the design guidance that is a **strength** (the generic "fade-and-slide-up on each section" is absent). A redesign should not add it.

### 1.6 Dead and duplicated code a redesign will meet

- **`.sub-category__heading`** (`global.css` L147–158): defined, **never referenced** — grep finds it in exactly one place, its own definition. The live class is `.menu-section__sub-heading` (`MenuSection.astro` L114). Dead CSS, 12 lines.
- **`.section-nav` / `.section-nav__link` / `:hover`** duplicated in `global.css` L96–135 **and** `SectionNav.astro` L33–71. Astro scopes the component copy, so the scoped selector wins on specificity and the global copy is dead bytes (~40 lines).
- **Scroll offset is split and half-inert.** `html { scroll-padding-top: 5rem }` works. `scroll-margin-top: 6rem` sits on `.menu-section__heading`, but the anchors target `<section id="section-…">`, so that declaration never applies to anchor navigation. This is the exact class of padding/margin collision the design guidance warns about.
- **`ProductCard.astro` L27** uses an inline `onerror` (`this.style.display='none';this.nextElementSibling.style.display='block'`) to reveal a `display:none` gradient sibling. It works, but it is CSP-hostile and it ships a hidden duplicate node behind all 31 real photos.

### 1.7 i18n drift (new)

11 keys in `src/i18n/{es,en}.json`. **4 are dead**, because the components hardcode the equivalent string inline:

| Dead key | Where the string actually comes from |
| --- | --- |
| `footer.location.text` | hardcoded JSX in `Footer.astro` L17–18 (`Balcarce 350<br />Salta, Argentina`) |
| `nav.es` / `nav.en` | `SectionNav.astro` L28 hardcodes `otherLocale.toUpperCase()` |
| `protocolo.title` | `MenuSection.astro` L22 resolves it from `menu.ts`'s `protocolo`, not from i18n |

Two silent-failure contracts to note: `t()` falls back to **the key itself** (`?? key`), so a missing key renders its own name in the UI; `tRecord()` returns `value[locale]` with no fallback, so a missing locale renders `undefined`. A redesign that adds copy must not rely on either failing loudly.

### 1.8 Document head gaps (new)

`BaseLayout.astro` (29 lines) contains: charset, viewport, `<title>`, two Google Fonts preconnects, one font `<link>`. That is all. Missing: `meta description`, Open Graph and Twitter card tags (the hero photo would make an excellent `og:image`), `theme-color`, `<link rel="alternate" hreflang>` between ES and EN, canonical, and a preload/`fetchpriority` for the LCP image. For a brief that asks for "professional", this is the cheapest available upgrade and it is invisible to the eye — which is why it gets forgotten.

### 1.9 Imagery: geometry, weight, and coverage (new/corrected)

**Hero geometry — the highest-leverage single fact.** `hero.webp` is **3024×4032, aspect 0.750 (portrait 3:4)**, `srgb`, no alpha, **1,614,004 bytes (1.54 MiB)**. It is used as `background: … url("/images/hero.webp") center / cover` on a `min-height: 100dvh` element (`Hero.astro` L21–28). A portrait image in a landscape band means:

| Viewport | Viewport aspect | Result |
| --- | --- | --- |
| 1440×900 desktop | 1.600 | **53% of the image height is cropped away** |
| 1280×720 laptop | 1.778 | **58% cropped** |
| 390×844 mobile | 0.462 | **38% of the width cropped** |

A full-width 2× desktop render needs about 2880×1800 (5.2 MP); the served source is 12.2 MP and 1.5 MiB, so most of the bytes that ship are guaranteed to be thrown away before anyone sees them. There is **no `srcset`, no `<link rel="preload">`, no `fetchpriority="high"`** — this is the LCP element, unoptimized, on a 1.5 MiB payload.

**Photography weight.** 31 product photos, **23,709,224 bytes (746.9 KB avg)**, served raw from `/public` with **no `astro:assets`, no `<Image>`, no `srcset`, and no `width`/`height` attributes** → both LCP and CLS exposure. `ProductCard.astro` forces every one of them into `height: 180px; object-fit: cover`, so each photo's own composition and aspect are discarded.

**Coverage (authoritative source = `menu.ts`, not `faltan-imagenes.txt` — see C2).** 94 products, parsed and replayed through `listSubCategories`:

| Surface | Count | Share |
| --- | --- | --- |
| Card with a real photograph | 31 | 33% of products |
| **Card with a `categoryGradients` fill** | **43** | **58% of all cards** |
| Text list row (`Adicionales` + all of `sin-cafe`) | 20 | 21% of products |

Per category (total / photo / gradient card / text row): `cafe` 22/7/9/6 · `sin-cafe` 14/0/0/14 · `pasteleria-panaderia` 22/9/13/0 · `opciones-saladas` 14/5/9/0 · `menus` 11/7/4/0 · `promos` 11/3/8/0.

So **58% of the menu's cards are an abstract gradient whose palette appears nowhere else in the design**, and the most appetizing category (pastry & bakery) is 59% abstract. `image: ""` is a valid state, not an error — but today it is rendered as an apology rather than as a decision.

`categoryGradients` is typed `Record<Category, string>` with **no runtime fallback**; a missing key renders `background: undefined`.

### 1.10 Typographic system

- **Web fonts ARE loaded.** `BaseLayout.astro` L19–24: preconnect to `fonts.googleapis.com` + `fonts.gstatic.com`, then one `<link>` for `Playfair Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap`. Playfair and Inter do resolve in production; the brief's implicit worry is unfounded.
- **Fallback stacks** are correct: `--font-heading: "Playfair Display", Georgia, serif` and `--font-body: "Inter", system-ui, -apple-system, sans-serif` — serif for headings, sans for body, exactly as the spec requires.
- **Applied sizes / weights** (all hardcoded per component; **no `clamp()`, no scale variable**):

| Role | Size | Weight | Where |
| --- | --- | --- | --- |
| h1 hero title | 2.5 → 3.5 (**768**) → 4rem (**1024**) | unset (400) | `Hero.astro` L37–43, L54–68 |
| hero tagline | 1.25 → 1.5rem (**768**) | 300 | `Hero.astro` |
| h2 section heading | 1.75 → 2 (**768**) → 2.25rem (**1024**), centered | unset | `MenuSection.astro` L88–95, L171–187 |
| h3 sub-category | 1.25rem | unset | `MenuSection.astro` L114–124 |
| h3 protocolo | 1.25rem, centered | unset | `MenuSection.astro` L145–151 |
| card name | 1.125rem | unset | `ProductCard.astro` L88–93 |
| card description | 0.875rem, lh 1.5 | unset | `ProductCard.astro` L95–101 |
| price | 1rem | **600** | `ProductCard` L103 / `ProductListItem` L67 |
| list name | 1rem, `nowrap` | unset | `ProductListItem.astro` L52–58 |
| list description | 0.8125rem, `opacity .65` | unset | `ProductListItem.astro` L75–81 |
| nav link | 0.875rem | 500 | `SectionNav.astro` L48–63 |
| footer heading / text | 1.125 / 0.9375rem, lh 1.6 | unset | `Footer.astro` L106–118 |

- **No type scale exists.** h1 steps ×1.4 then ×1.14; h2 steps ×1.14 then ×1.13. Nothing fluid, nothing derived, and the two families' ratio is never stated.
- **No `tabular-nums`** anywhere. Prices form a right-aligned money column using proportional figures, so digits do not align down the column. For a menu this is a real craft defect and a cheap, high-credibility fix.
- **Playfair Display + Inter is the most common "elegant restaurant" pairing in existence.** It is not wrong; it is simply the choice a template makes. Because `openspec/specs/homepage-layout/spec.md` → "Typography" makes it a **MUST** (L101), any type change is a **MODIFIED** delta and therefore an owner decision, not a free axis. `teoria.md` §5 records it as a deliberate architecture decision ("Google Fonts (Playfair + Inter) — dos requests, aceptable para sitio informativo").

---

## 2. Palette assessment, grounded in the actual photography

### 2.1 Method (stated so it can be re-run)

`sharp` 0.34.5, each image resized to fit 96 px, alpha removed, raw RGB sampled per pixel. Per image and in aggregate I computed: mean colour, share of **green-dominant** pixels (`g > r+4 && g > b+4`), share of pixels **within 42 RGB units of `#708C64`**, share of **warm** pixels (`r > b+12`), and Rec.709 luma percentiles. Contrast is WCAG 2.1 relative luminance. All numbers below are re-runnable from that description.

### 2.2 Measurements

**Luma over all 32 brand photographs (n = 100,352 pixels):** p10 44 · p25 66 · **p50 108** · p75 158 · p90 193 · p99 226 · mean 113.3.
Lightness bands: **dark (r+g+b < 300) 47.5%** · mid 43.1% · light (570–690) 8.9% · **near-white (> 690) 0.5%**.
Mean colour of the brightest decile: **`#d8d2bf`**. Mean colour of the darkest half: **`#5b3c2b`**.
Warm pixels (r > b+12): **74.5%** average. Mean of the 31 product-photo average colours: **`#876d59`**.

**Green:** green-dominant pixels average **3.7%** (range 0.0–8.8%); within-42-of-`#708C64` averages **5.4%**, peaking at **9.6%** (`chipa-roquefort.webp`), then `chipa-salame` 5.0%, `iced-coffee` 9.3%, `menu-chipa-prensado` 14.6%.

**Other object colours present:** ochre/gold (saturated warm yellow) averages **9.4%**, peaking at `roll-canela-manzana` 29.1%, `promo-tortilla` 26.1%, `promo-torta` 21.9%. Cool-toned surfaces average 4.7%. Saturated warm red-orange averages 19.1% — but see C4: this is the **coffee and caramel** family, not a verified pottery pigment.

### 2.3 The central finding

> The page paints the green over roughly **70% of the visible area**, while the same green occupies about **3.7%** of the brand's own photography (5.4% within a 42-unit tolerance).

This is the defect. It is **not** that the green is wrong — it is a genuinely restrained desaturation, and the owner chose it twice. The defect is **area and role**: in the photography the green is a scarce glaze object on warm wood and ceramic cream; on the site it is the dominant field while the colours that make up ~85% of the photography (warm walnut, ceramic cream, coffee) are demoted to card fills and a footer. That is why the green reads as **bolted on**: not wrong, *too big*, and with no supporting family around it. `categoryGradients.menus` uses `#6B8E5A→#4A6B3A` — a *different* green with no relationship to `#708C64`, which confirms the green has no system behind it.

### 2.4 What works

- `--color-primary #4a3728` (74,55,40) sits correctly inside the measured walnut family (`#3c3127` = 60,49,39; `#5c4836`). Defensible.
- `--color-secondary #c4956a` (196,149,106) is the right *hue* — it belongs to the measured ochre/gold family. It is only the wrong *value* for text.
- `rgb(112,140,100)` is a good colour, in the wrong role.
- The dotted-leader price rows (`ProductListItem.astro` L60–65) are a real menu/printer convention for aligning a money column, not decoration. **Keep.**
- The absence of entrance animations is a strength. **Keep.**
- The photography itself is excellent and consistently styled: 74.5% warm pixels, one dominant surface, one light direction. This is the most valuable asset the redesign has.

### 2.5 What fails — WCAG 2.1, verified

| Element | Foreground | Background | Ratio | Need | Verdict |
| --- | --- | --- | --- | --- | --- |
| **Price** (1rem/600) | `--color-secondary #c4956a` | `--color-surface #f5ede4` | **2.31** | 4.5 | **FAIL** |
| **Sub-category heading** (h3, 1.25rem) | `#c4956a` | green `#708c64` | **1.40** | 3.0 | **FAIL** |
| Sub-category heading | `#c4956a` | `#f5ede4` | **2.31** | 3.0 | **FAIL** |
| Nav link hover | `#fff` | `#c4956a` | **2.67** | 4.5 | **FAIL** |
| Footer copyright | `rgba(255,255,255,.5)` on `#4a3728` | composited `#a59b92` | **4.12** | 4.5 | **FAIL** |
| List description (`.65` alpha over a `.4` white panel over green) | composited ≈`#585143` | ≈`#a9baa2` | 3.83 | 4.5 | **FAIL** |
| Section heading (1.75–2.25rem) | `#4a3728` | green `#708c64` | 3.01 | 3.0 | PASS by 0.01 |
| Body text | `#2c1810` | green `#708c64` | 4.52 | 4.5 | PASS by 0.02 |
| Card name | `#4a3728` | `#f5ede4` | 9.70 | 4.5 | PASS |
| Card description | `#2c1810` | `#f5ede4` | 14.55 | 4.5 | PASS |
| Footer text | `#d4c5b5` | `#4a3728` | 6.67 | 4.5 | PASS |
| Footer heading | `#fff` | `#4a3728` | 11.24 | 4.5 | PASS |

**Six AA failures**, one of them (the price) on the single most important text in a menu, and one (1.40) catastrophic. Two elements pass by 0.01 and 0.02 — legal, but with no headroom for a design change.

Two further issues from the same root:

- **"Milky panel" mud.** `MenuSection.astro` L108 (`rgba(255,255,255,.4)`) and L160 (`rgba(255,255,255,.5)`) lay translucent white over saturated green, producing a desaturated grey-green. Cream cards, white-alpha panels and a dashed green-gold `protocolo` border give three different, none-deliberate surfaces inside one section.
- **No supporting family.** Every colour decision is green, cream, or gold. The measured ochre/gold family has no text-safe token (hence the 2.31 failure), and the measured ceramic lights (`#d8d2bf`) and walnut darks (`#5b3c2b`) have no token at all.

---

## 3. Affected Areas

| File | Must change? | Why |
| --- | --- | --- |
| `src/styles/global.css` | **Must** | Token re-role, type scale, dead-CSS removal (`.sub-category__heading`, the inert `nth-child` block, the duplicated nav block), section separation |
| `src/pages/index.astro` | **Must** | `sectionAccents` record + `protocolo` inline accent — the real background |
| `src/pages/en/index.astro` | **Must** | Same; it is currently a byte-identical copy, a drift risk |
| `src/components/MenuSection.astro` | **Must** | Section heading, milky panels, sub-heading contrast, grid, the inert `scroll-margin-top` |
| `src/components/ProductCard.astro` | **Must** | Card container, 180px fixed crop, gradient fallback, hover/shadow, inline `onerror` |
| `src/components/ProductListItem.astro` | **Must** | Price contrast, description contrast, `tabular-nums` |
| `src/components/SectionNav.astro` | **Must** | Hover contrast 2.67, pill chrome, duplicated global rules |
| `src/components/Footer.astro` | **Must** | Tokenize the hardcoded `#d4c5b5`/`#fff`, copyright contrast, heading treatment, dead social links |
| `src/components/Hero.astro` | **Must** | The portrait-in-landscape crop, the scrim, the LCP `background-image` |
| `src/data/category-visual.ts` | **Must** | Re-author the fill used by 43 of 74 cards |
| `src/layouts/BaseLayout.astro` | **Should** | Meta/OG/`theme-color`/preload; required if the type or font link changes |
| `src/i18n/{es,en}.json` | **Should** | Delete the 4 dead keys, or wire them up; avoid adding a 12th |
| `src/data/menu.ts` | **No** | Locale + price data only; `tRecord`'s contract must survive untouched |
| `openspec/specs/{homepage-layout,product-menu}/spec.md` | **Must (delta)** | See §3.3 — the redesign is not spec-neutral |
| `AGENTS.md`, `README.md`, `faltan-imagenes.txt` | Cosmetic, out of scope | README says "88 productos" / "17 fotos" (reality 94 / 31); AGENTS.md and `faltan-imagenes.txt` are stale per C2 |

### 3.1 Forecast — this does not fit one PR

| Slice | Files | Forecast changed lines |
| --- | --- | --- |
| 1 — Tokens, type scale, contrast, head metadata, dead-CSS removal | `global.css`, `BaseLayout.astro`, `category-visual.ts` | ~150 |
| 2 — Menu body | `MenuSection.astro`, `ProductCard.astro`, `ProductListItem.astro`, both pages | ~210 |
| 3 — Chrome | `Hero.astro`, `SectionNav.astro`, `Footer.astro` | ~150 |
| **Total** | | **~510 (range 420–560)** |

CSS is verbose, so the upper bound is the realistic one. Guard lines for the tasks phase:

```
Decision needed before apply: Yes
Chained PRs recommended: Yes
400-line budget risk: High
```

**Chaining works here** for two structural reasons:

- **Slice 1 must change token VALUES and ROLES, not token NAMES.** Keeping `--color-primary` / `--color-secondary` / `--color-bg` / `--color-surface` / `--color-text` / `--color-border` means slice 1 ships alone: the six contrast failures are fixed and the palette is coherent *before* any layout change. Renaming tokens in slice 1 would couple all three slices into one PR.
- **Slices 2 and 3 are independent** once slice 1 lands, so a reviewer can take either first. Slice 3 carries the hero geometry fix, which is self-contained.

### 3.2 Verified baseline

- `npx astro check` → **`Result (14 files): 0 errors, 0 warnings, 0 hints`** (run during this exploration; this is the bar the change must not lower).
- `npm run build` → **2 pages**, `✓ Complete!` (`/index.html`, `/en/index.html`).
- No test runner exists (`openspec/config.yaml`: `testing.runner: none`). **Do not propose tests.**
- `npx biome check src/` exits `-1073741515` (`0xC0000135`, missing DLL) on this machine. That code is an **environment failure, not a lint result** — never report it as findings. Format manually: 2-space indent, LF, double quotes.

### 3.3 Spec surface — the redesign is NOT spec-neutral

The code already drifts from the specs, and both directions drift further:

| Spec | Requirement | Conflict |
| --- | --- | --- |
| `homepage-layout` | **Warm Color Palette** (L55) | *"Backgrounds SHOULD use cream/off-white tones."* Every section is green today — **already a drift**. A light-field direction re-aligns it; a dark-field direction needs **MODIFIED**. |
| `homepage-layout` | **Typography** (L101) | *"MUST use Playfair Display … and Inter."* Any type change is a **MODIFIED MUST**. |
| `homepage-layout` | **Hero Section Branding** (L13) | *"The hero SHOULD occupy the full viewport height."* Any reduced-height hero is **MODIFIED**. |
| `product-menu` | **Section Visual Identity** (L151) | *"SHOULD alternate background color or use a decorative element."* Any abolition of per-section background blocks is **MODIFIED** (and repairs the already-broken alternation). |
| `product-menu` | **Product Cards** (L35) | Mandates *"image-on-top, text-below"* plus a gradient `<div>` fallback. De-carding is **MODIFIED**. |
| `product-menu` | **Responsive Product Grid** (L68) | Mandates 1 / 2 / 3 uniform columns with equal cell height. An asymmetric photo/text pairing breaks it. **MODIFIED.** |
| `product-menu` | **Typed Menu Data** (L86) | *"Gradient constants MUST live in `src/data/category-visual.ts` as `categoryGradients`."* Re-authoring the values is fine; changing the *shape* is **MODIFIED**. Note this requirement also says "~88 products" against a reality of 94 — pre-existing, minor. |

**If the owner refuses MUST→SHOULD relaxations, the change collapses to a palette-and-contrast retune**, which is still worth shipping (it fixes six AA failures) but does not deliver the brief's "redesign".

---

## 4. Approaches — three visual directions

All three are screened against the AI-default-tells catalogue in `references/design-guidance.md` ("AI-generated design … clusters around some traits", the 5 numbered tells). **Every foreground/background pair each direction intends to use was verified with the WCAG formula above; the ratios quoted are measured, not estimated.** Token sources are labelled **measured** (computable from §2), **owner** (already in the owner's `:root`), or **derived** (a documented transformation of one of those).

### 4.1 Direction A — "Loza" (stoneware: light field, hand-painted line device)

**Reasoning.** The café's most ownable repeated artifact might not be a colour but a **material and a gesture**: cream stoneware with thin hand-painted linework, with saturated glazes reserved as small objects. The current site inverts that logic — it uses a glaze colour as a full-bleed field and contains **no linework of any kind**. A restores the ceramic grammar: a clay ground, fine drawn rules as the structural device, saturated glaze only on small marks. That single move addresses all three brief words: *minimalist* (a quiet neutral field and hairlines), *professional* (gridded and tabular), and *warm* — where the warmth is the warmth of handwork rather than of colour temperature.

**Tokens (6).**

| Token | Hex | Source | Role and verified ratio |
| --- | --- | --- | --- |
| `--clay` | `#EFEDE7` | **derived** — a lift of the measured ceramic lights (`#d8d2bf`, brightest decile) | Page field. Brighter than the p99 luma of the corpus, so it is deliberately an *extrapolation*, not a sample. |
| `--ink` | `#33241A` | **derived** — the measured walnut family | Body text. **12.74:1** on clay. |
| `--wood` | `#3C3127` | **measured** (chipa-queso, dominant) | Headings and structural rules. **10.80:1**. |
| `--ochre` | `#8A5A2B` | **derived** — measured ochre/gold family, darkened to carry text | **Price. 5.01:1** on clay — replaces the 2.31 failure. |
| `--line` | `#C9554E` | **unverified** (see C4) | 1–2 px drawn rules. **3.67:1** on clay — passes the ≥3 decorative bar, and **only** that bar. |
| `--sage` | `#708C64` | **owner** | The brand green, kept intact, demoted to a glaze/mark colour. **3.38:1** on clay, so ≥24 px or decorative only; `--sage-ink #4E6B44` (**5.41:1**) is the text-safe variant. |

**Type roles.** *One* display serif with a hand-cut irregularity that maps to painted linework (candidates: **Fraunces** — variable, with an optical-size and `wonk` axis that produces genuine variation — or **Newsreader**) for product names and section headings only; *one* warm humanist sans (**Public Sans** or **Work Sans**) for descriptions, prices, nav and footer. **Neither is Playfair, neither is Inter.** `tabular-nums` on the money column. One modular scale at ratio ≈1.2 built on `clamp()`, replacing 13 hardcoded sizes and 6 ad-hoc breakpoints.

**Layout.** One continuous clay field. Sections are no longer coloured rectangles: the page is a single ceramic ground and **structure is carried by drawn lines**. A section name sits *on* a rule and breaks it, reproducing a painted plate rim. Everything is left-aligned, never centred. Product cells are **not cards**: the photograph bleeds to the cell edge with no radius and no shadow, separated from its text by a hairline; an imageless product becomes a flat glaze swatch with a 1 px painted border — an empty plate waiting to be filled. The sticky nav is a hairline row of plain text with a 2 px painted rule under the active section.

```
hero: photo full-bleed, 62vh, NO scrim; the name on a clay panel, bottom-left
──────────────────────────────────────────────────────────────────
Café   Sin Café   Pastelería   Saladas   Menús            EN      ← hairline row (sticky)
════                                                              ← active = 2px painted rule
──────────────────────────────────────────────────────────────────
Café ───────────────────────────────────────────────────────      ← section name BREAKS the rule
  Calientes ──────────────────────────────────────────────        ← lighter sub-rule
  ┌───────────┐   ┌───────────┐   ┌───────────┐
  │  photo    │   │ ▓ glaze ▓ │   │  photo    │                   no radius, no shadow,
  │ (bleeds)  │   │ ▓ +1px rim│   │ (bleeds)  │                   photo bleeds to the edge
  ├───────────┤   ├───────────┤   ├───────────┤                   hairline, not a box
  │ Espresso  │   │ Long Black│   │ Esp+Leche │                   serif
  │ desc      │   │ desc      │   │ desc      │                   sans
  │     $3300 │   │     $3600 │   │     $3300 │                   ochre, tabular-nums
  └───────────┘   └───────────┘   └───────────┘
  Adicionales ─────────────────────────────────
  Vainilla Casera ································ $1500          ← leader dots KEPT
──────────────────────────────────────────────────────────────────
wood footer — clay text, flat, no circles, no pills
```

**What A rejects.** Green as a field; `border-radius: 12px` on everything; the identical soft shadow and hover-lift; linear-gradient placeholders; centred section headings; the Playfair + Inter pairing; the centred hero serif behind a dark scrim; and **per-section background blocks of any kind**.

**Screening against the catalogued tells.**

| Tell | Verdict |
| --- | --- |
| 1 — warm cream field + high-contrast serif display + terracotta ≈`#D97757` | **ADJACENT — A's honest weakness, and now a second one.** `#C9554E` is close to the catalogued terracotta, and unlike r1 I could **not** verify that a pottery-red pigment exists in the photography. Mitigations: the field `#EFEDE7` is a near-neutral ceramic white, deliberately less warm than the current `#f5ede4` *and* than the catalogued `#F4F1EA`; the red is used as a 1–2 px **drawn** rule, never a filled CTA; no terracotta accent block exists; the memorable device is a structural drawing, not a colour. Residual risk: a reviewer looking only at the palette chip will call this the tell **and** will be unable to trace `--line` to the brand. |
| 2 — near-black bg + one acid accent | Not applicable. |
| 3 — broadsheet hairlines, zero radius, dense columns | **ADJACENT.** A uses hairlines and zero radius. Distinguisher: one ~1080 px column with generous air and large photography, no masthead, no justified multi-column text, no newspaper density. |
| 4 — SaaS-card kit | **Rejected by construction** — the card container is deleted. |
| 5 — template chrome | **Rejected.** No ALL-CAPS eyebrows, no `→`, no `A · B · C`, no monospace micro-labels, no tinted near-black. The leader-dot price row is kept as a documented printer convention. |

### 4.2 Direction B — "Mesa larga" (the long table: deep walnut field, photography-led)

**Reasoning.** The strongest assets are 31 real, consistently styled photographs, and they are **dark and warm**: 47.5% of their pixels are dark, 74.5% warm, mean luma 113, and the darkest half averages `#5b3c2b`. The current design puts those photographs on green paper inside uniform rounded cards — neutralising the photography *and* the furniture. B makes **the brand's actual dominant surface** (warm walnut) the field and lets the photographs be the light source. Warmth then comes from real wood and real food rather than from a warm-cream field, which is why B can spend its one boldness on a strong display face and still read warm. Structurally the page stops being a card grid and becomes a **single long table**: one continuous surface with a narrow ceramic runner carrying text, and photographs breaking out of the runner at their own aspect ratios, alternating sides. Sections are separated by a change in the runner, not by a background block.

**Tokens (6).**

| Token | Hex | Source | Role and verified ratio |
| --- | --- | --- | --- |
| `--table` | `#2E241C` | **derived** — measured darks (`#5b3c2b` family, p10 luma ≈44) | Page field. Darker than the corpus p10, so it too is an extrapolation — toward the cinema rather than the gallery wall. |
| `--table-mid` | `#3E3126` | **derived** | Raised surfaces: sticky nav, footer, runner edges. |
| `--clay` | `#EFE9DC` | **derived** — measured ceramic lights | Runner + primary text. **12.53:1** on table, **10.38:1** on table-mid. |
| `--ochre` | `#D9A94E` | **measured** — ochre/gold family | Price on the dark ground. **7.03:1** on table, **5.82:1** on mid. On a light surface it MUST switch to `--ochre-deep #8A5A2B` (**4.85:1** on clay); `#D9A94E` on clay is 1.78. |
| `--sage` | `#8FA86A` | **owner**, brightened toward the measured glaze pixels | The brand green as a **glaze object**. **5.76:1** on table, **4.77:1** on mid. This is how green stops being bolted on: it becomes a scarce saturated object colour. |
| `--brick` | `#C9554E` | **unverified** (C4) | Decorative rules, tags, active-section marker. **3.53:1** on table, **3.55:1** on clay — but **2.93:1 on `--table-mid`, which FAILS the ≥3 decorative bar** (C10). Brick marks must never sit on raised surfaces. Never lighten toward `#D97757` (2.90 on clay — it fails *and* it is the tell). |

**Type roles.** **One family**, per the guidance's own steer. Display and product names: a signage-derived grotesque or slab (**Archivo**, **Zilla Slab**, or **Bitter** — a slab reads as painted shop signage and holds up on a dark ground); body, nav, footer at text weights. `tabular-nums`. The same ≈1.2 scale, with display steps starting larger because type on a dark ground needs more size to survive. **Neither Playfair nor Inter**, and explicitly *not* a high-contrast serif — that is A's territory, and B exists to have a different voice.

**Layout.** Asymmetric two-column rhythm on desktop — photograph 5/12, text 7/12, alternating sides down the page, each photograph at its own aspect ratio, never force-cropped; single column on mobile. **No card containers, no boxes, no radii, no shadows**: depth comes from the dark ground and from lit photographs. A narrow clay runner carries the text column; photographs break out of it. Sections are marked by a brick painted band plus the section name in sage, so the page reads as one table seen end to end.

```
hero: the photograph edge-to-edge, no scrim; the name set on the WOOD below it, not on the photo
──────────────────────────────────────────────────────────────────
Café   Sin Café   Pastelería   Saladas   Menús         EN         ← table-mid bar (sticky)
▔▔▔▔                                                              ← active = brick band
──────────────────────────────────────────────────────────────────
                  │
  ┌────────────┐  │   Café                                        ← sage label on wood
  │            │  │   ────────────────────────                    ← brick painted band
  │ photograph │  │
  │ 5/12, own  │  │   Espresso                                    ← ONE family, large
  │ aspect     │  │   Espresso puro, intenso y equilibrado.       ← clay
  └────────────┘  │                                    $3300      ← ochre, tabular
                  │
  Calientes       │   ┌────────────┐
  ────────────    │   │ ▓ glaze ▓▓ │  ← imageless product = a glaze tile on the table,
                  │   │ ▓▓▓▓▓▓▓▓▓▓ │    with a 1px rim — NOT a broken image
                  │   └────────────┘
                  │    Long Black   /   Double espresso with hot water.   $3600
── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ── ─
table-mid footer — clay text, flat, no circles, no pills
```

**What B rejects.** Cards and boxes; green as a section field; cream as the *page* field; uniform image crops; centred section headings; the hero scrim + centred serif; every shadow; `border-radius` as a default; and the whole Playfair + Inter pairing.

**Screening against the catalogued tells.**

| Tell | Verdict |
| --- | --- |
| 1 — warm cream + high-contrast serif + terracotta | **Rejected.** Not a cream field, not a high-contrast serif display, no terracotta CTA. Structurally immune rather than argued out of it. |
| 2 — near-black bg + one acid-green or vermilion accent | **ADJACENT — B's honest weakness, and it must be argued.** Mitigations: `#2E241C` is a warm brown sampled from the furniture family, not `#0B0B0B`/`#111`; it is the empirically dominant surface of the brand's own photography; there is no *single* acid accent but a glaze library (ochre, sage, brick) applied as object fills and small marks. Counterweight: three accent hues on a dark field is arguably *closer* to the dark-chrome-with-accents template than one accent would be. Residual risk: on a phone at low brightness this can read as a generic dark restaurant template. |
| 3 — broadsheet hairlines, dense columns | **Rejected.** The structure is asymmetric photo/text pairs, not columns. |
| 4 — SaaS-card kit | **Rejected by construction** — no cards, no uniform radius, no shadow depth. |
| 5 — template chrome | **Rejected.** Same as A; the leader-dot money column is retained as a printer convention. |

### 4.3 Direction C — "Acento verde" (the brand green promoted to the single accent on a warm near-white field)

**Reasoning.** The brief names two constraints in the same breath — the brand colours *and* the images — and asks for minimalist, professional, and warm. C is the only direction that treats the owner's green as the **accent** rather than either the field (today) or a demoted swatch (A and B). That is a promotion in *role* and a demotion in *area*: the green becomes the one saturated note in chrome, section markers, and the active nav, appearing exactly where the eye needs orientation — which is the job a brand accent is supposed to do, and the job it currently fails at by being everywhere. The field is a warm near-white inside the existing cream family; **warmth comes from the photography**, which is 74.5% warm pixels with a mean of `#876d59`, and the page stops resembling paper and starts resembling a wall a photograph is pinned to. Structure is carried by type, one hairline, and — the one memorable device — **the money column**: 94 prices, aligned on tabular figures, with the leader dots that already exist. A menu's most characteristic graphic object is its price column; the current design has never once aligned it.

**Tokens (6).**

| Token | Hex | Source | Role and verified ratio |
| --- | --- | --- | --- |
| `--surface` | `#F7F3EC` | **derived** — the current `#f5ede4` with its yellow lean removed | Page field. Contrast-safe ground for everything below. |
| `--ink` | `#2C1810` | **owner** (`--color-text`) | Body text. **15.25:1**. |
| `--wood` | `#4A3728` | **owner** (`--color-primary`) | Headings, card names. **10.16:1**. |
| `--green-ink` | `#4E6B44` | **derived** — the owner's green darkened for text | Section markers, prices' sibling, active nav label. **5.41:1**. |
| `--green` | `#708C64` | **owner**, exact | The brand green as a **fill**: section rules, the active-nav marker, glaze swatches. **3.38:1** on the field — passes the ≥3 decorative/large-type bar and nothing smaller. |
| `--ochre` | `#8A5A2B` | **derived** — the measured ochre/gold family, darkened | **Price. 5.31:1** — replaces the 2.31 failure with the same hue family the owner already chose. |

Explicit constraint: **`#fff` on `#708C64` is 3.73 and fails.** C therefore never puts white text on the glaze green (the current design does exactly this on `#c4956a` at 2.67). Where white-on-green is unavoidable, `--green-ink` gives 5.98.

The 43 imageless cards get a **glaze library** instead of the six arbitrary gradients: 4–5 flat, ungraded swatches sampled from object colours that were actually measured in the photography (the ochre/gold family at 9.4% share, the green object colour at 3.7%, the ceramic light at `#d8d2bf`, the walnut dark at `#5b3c2b`). Each is a flat fill with a 1 px inner rim — a glazed tile, not a broken image.

**Type roles.** **Playfair Display + Inter are kept.** That is a deliberate, brief-driven choice, not inertia: the brief asks for *minimalist and professional*, it does not ask for a new voice, and "Typography" is a **MUST** the change does not need to touch. The differentiate comes from the system instead: one modular scale on `clamp()` (replacing 13 hardcoded sizes and 6 ad-hoc breakpoints), `font-variant-numeric: tabular-nums` on the money column, one line-height rhythm, and a 65–75 character measure. Playfair is used at **one** weight and **one** role (section and product names) instead of scattered across four sizes — the template signal is the *pairing at default sizes*, and narrowing its use is what removes it. If the owner wants the type replaced, that is a **MODIFIED MUST** decision (see §7) and A or B's type roles are the ready-made answers.

**Layout.** One warm near-white field, no per-section blocks. A section is introduced by its name in `--green-ink` on a single hairline rule, left-aligned, with the rule's weight carrying the hierarchy (heavier for a category, lighter for a sub-category). Product cells are **photographs, not cards**: the image bleeds to the cell edge with no radius and no shadow, its own aspect ratio preserved, separated from its text by one hairline; an imageless product is a flat glaze tile with a 1 px rim. The sticky nav is plain text on the field with a 2 px `--green` rule under the active section. Prices sit in a right-aligned tabular column with the existing dotted leaders carried through to the cards. No entrance animations.

```
hero: the portrait photo in a PORTRAIT-ratio panel beside the name — re-framed, not cropped
──────────────────────────────────────────────────────────────────
Café   Sin Café   Pastelería   Saladas   Menús         EN         ← plain text on the field
▔▔▔▔                                                              ← active = 2px --green rule
──────────────────────────────────────────────────────────────────
Café ───────────────────────────────────────────────────────      ← name ON the rule
  Calientes ──────────────────────────────────────────────        ← lighter rule = hierarchy
  ┌───────────┐   ┌───────────┐   ┌───────────┐
  │  photo    │   │ ▓ glaze ▓ │   │  photo    │                   no radius, no shadow,
  │ own aspect│   │ 1px rim   │   │ own aspect│                   photo keeps its own aspect
  ├───────────┤   ├───────────┤   ├───────────┤                   ONE hairline
  │ Espresso  │   │ Long Black│   │ Esp+Leche │
  │ desc      │   │ desc      │   │ desc      │
  │ $   3300  │   │ $   3600  │   │ $   3300  │                   ochre, tabular-nums —
  └───────────┘   └───────────┘   └───────────┘                   the aligned money column
  Adicionales ─────────────────────────────────
  Vainilla Casera ································ $1500          ← leader dots KEPT
──────────────────────────────────────────────────────────────────
footer: wood ground, clay text — one decision, not two
```

**What C rejects.** Green as a 70%-area field; the gold `#c4956a` as a text colour; cream cards with `border-radius: 12px` and the identical soft shadow; the hover lift; linear-gradient placeholders; the six arbitrary category gradients; centred section headings; the hero scrim; proportional figures in a money column; and per-section background blocks of any kind.

**Screening against the catalogued tells.**

| Tell | Verdict |
| --- | --- |
| 1 — warm cream + high-contrast serif display + terracotta near `#D97757` | **ADJACENT, and the strongest honest counterweight to C.** The field is warm cream and the display face *is* a high-contrast serif. What separates C: there is **no terracotta** — the accent is the **owner's own brand green**, so the palette's most characteristic colour is client-supplied rather than a default; Playfair is confined to one weight and one role; the memorable device is a **tabular money column**, which is content the page actually has, not decoration. C's defence is *provenance*, and provenance is what tell 1 is about: this palette is the client's, only re-roled. |
| 2 — near-black bg + one acid accent | Not applicable — the field is light and there is one accent, not a dark ground with a bright one. |
| 3 — broadsheet hairlines, dense columns | **ADJACENT.** C uses hairlines. Distinguisher: one ~1100 px column, large photography, generous vertical rhythm, no columns of dense text, no masthead. But note C's section rules are the closest of the three to a "hairline rules" reading, and a reviewer is entitled to say so. |
| 4 — SaaS-card kit | **Rejected by construction** — the card is deleted; there is one radius decision (none) and one shadow decision (none). |
| 5 — template chrome | **Rejected.** No ALL-CAPS eyebrows, no `→`, no `A · B · C`, no monospace micro-labels, no tinted near-black. |

### 4.4 Comparison

| | A — Loza | B — Mesa larga | C — Acento verde |
| --- | --- | --- | --- |
| Field | near-neutral clay (extrapolated light) | deep walnut (extrapolated dark) | warm near-white (owner family) |
| Green's role | glaze swatch / large mark | glaze object, brightened | **the single accent** |
| Warmth from | handwork and drawn line | wood and lit photographs | the photography (74.5% warm, `#876d59`) |
| Brand-token provenance | 1 owner token, 4 derived, **1 unverified** | 1 owner token, 4 derived, **1 unverified** | **2 owner tokens, 3 derived, 0 unverified** |
| Type | changed (MODIFIED MUST) | changed (MODIFIED MUST) | kept (no spec change) |
| Spec deltas | 7 across 2 domains | 7 across 2 domains | **2** (Warm Color Palette, Section Visual Identity) |
| Forecast lines | ~550 | ~560 | **~510** (folded into §3.1) |
| Tells to argue | 1, 3 | 2 | 1, 3 (weakly) |
| Effort | Medium-High | High | **Medium** |

---

## 5. Recommendation

**Recommend Direction C**, with B as the ceiling option and A as the distinctive-but-least-verifiable option.

Why C:

1. **It is the most literal reading of the brief.** The brief asks to honour the brand colours *and* the images. C is the only direction that gives the owner's green a *more* visible job (the single accent, orientation, section identity) while shrinking it to its photographic proportion — and the only one with **zero unverified tokens**.
2. **It is the only direction whose entire palette is traceable.** Two tokens are the owner's exact values, three are documented derivations of measured photographic colours. A and B each rest partly on `#C9554E`, which I could not verify exists in the brand (C4). For a brief that opens with "teniendo en cuenta los colores de marca", an untraceable colour is the wrong foundation.
3. **The lowest spec surface of the three: 2 deltas instead of 7.** No MUST is relaxed: cream backgrounds (re-aligned *toward* the spec), no type change, no card-requirement change beyond the gradient's shape. That means the change can actually land.
4. **It serves the "imágenes" half.** De-carding, preserving each photo's own aspect ratio, and freeing the 180 px box is the single largest visual improvement available, and it is the change that makes 31 strong photographs carry the page.
5. **It fixes all six AA failures while keeping the owner's hues.** Every replacement is a value or role change within the palette the owner already chose — the gold stays as the price hue, only darkened until it can be read.
6. **Lowest risk of a wasted round.** C is also the cheapest to verify: every claim is a contrast ratio with a number attached.

Honest counterweights: C keeps the Playfair + Inter pairing, which the guidance flags as the commonest "elegant restaurant" tell — the mitigation is narrowing its use to one weight and one role, not removing it. And C's field is warm cream, which is tell 1's silhouette; its defence is provenance rather than shape. **If the owner's priority is distinctiveness over fidelity and the review budget is flexible, B is the higher-ceiling choice** and its reasoning is at least as evidence-grounded as C's — its cost is a type MUST, 7 spec deltas, and a dark field that can read as a generic dark restaurant template on a phone.

---

## 6. Risks

- **R1 — The spec surface is the dominant risk, not the CSS.** 7 requirements across 2 domains are in play for A/B and 2 for C. If the owner refuses MUST→SHOULD relaxations, even C must land as a palette-and-contrast retune with de-carding removed. That is a decision for **before** the proposal, not a surprise during it.
- **R2 — Six verified AA failures exist today.** Any direction that keeps `#c4956a` as a text colour re-ships a 2.31:1 defect on the most important text in a menu. Verification must assert the new ratios numerically.
- **R3 — The hero is a portrait image in a landscape frame, and it is the LCP element.** 53% of its height is cropped on desktop; 1.54 MiB ships with no `srcset`, no preload, no `fetchpriority`, and no `width`/`height`. Any direction that enlarges photography makes this worse. **This change should be allowed to introduce `astro:assets` `<Image>` and an aspect-aware hero**, which contradicts the archived `product-images` proposal's "Out of Scope: image optimization … or responsive srcsets". That is a scope expansion needing explicit owner approval, and it is the highest-value technical decision in this change.
- **R4 — Direction A's `--line #C9554E` is unverified brand evidence.** If a human can confirm the pottery-red reading (or refute it), A either becomes viable or dies. I could not confirm it without inspecting image content, which this phase prohibits.
- **R5 — No brand guide exists.** The only vector asset (`favicon.svg`) is monochrome; there is no logo file, no documented brand hex, no OG image, and all three footer social links are `href="#"` (dead). "Green is the brand colour" is an inference from two owner commits plus `favicon`, not from a brand document. §2.3's measurement is a claim about the *photographic corpus*, not about the brand — a café can own a green that appears on its awning, uniforms or packaging and in none of its food photos. **The owner must confirm.**
- **R6 — Instrumentation asymmetry.** No test runner, and `npx biome check src/` is broken on this machine (`-1073741515`). Verification is `npx astro check` + `npm run build` only. Format manually.
- **R7 — Untracked work in the tree.** `.codegraph/` exists (`codegraph status` → 15 files, 105 nodes, 294 edges, 0.35 MB `codegraph.db`), is **untracked and NOT in `.gitignore`** — reported, not edited per instructions; a PR from this change must not sweep it in. Separately, `openspec/config.yaml` already carries **uncommitted modifications** (`verify.build_command` `astro build` → `npm run build`, plus new `commands` and `broken_on_this_machine` blocks). That is an improvement and not mine to touch.
- **R8 — `faltan-imagenes.txt` and `AGENTS.md` are stale** (C2). If the design or the tasks phase sizes the gradient-placeholder device from that file, it will be sized for 77 missing photos instead of 63, and 11 of them exist.

## 7. Open questions for a human

1. **Confirm the brand colour.** Is `#708C64` the brand green (signage, awning, packaging, uniforms), or was it sampled from the hero photograph? This single answer decides whether any of the three directions is legitimate. (§6/R5)
2. **May the typefaces change?** "Typography" makes Playfair + Inter a **MUST**. Direction C says no and wins the budget; A and B say yes and lose a spec delta. (§4.3, §3.3)
3. **What role should the green have?** Recommended across all three: keep the owner's value and shrink its *area*, promoting it to the accent (C) or a glaze object (A/B). If the owner wants green dominant again, the page returns to green-field and the photography is demoted by the measurement in §2.3 — a genuine trade to make explicitly.
4. **Is image optimization in scope?** Converting the 31 photos and the hero to `astro:assets` (plus a portrait-aware hero) is the biggest quality win available and it contradicts an archived out-of-scope note. Yes/no changes the forecast materially. (§6/R3)
5. **Do more photographs exist?** 63 of 94 products have none, including 13 of 22 in pastry & bakery and 8 of 11 in promos. If more are coming, size for photographs; if not, the glaze-tile device carries 58% of the cards. Note the answer must come from `menu.ts`, **not** from `faltan-imagenes.txt`.
6. **Hero height.** The spec says full viewport; all three directions want the menu to start sooner. Confirm, and confirm whether the portrait photo should be re-framed rather than cropped.
7. **How Salta-specific?** The subject is a specialty café and artisan bakery at Balcarce 350. Leaning into the locale changes copy and ornament. Wanted, or internationally neutral?

## 8. Ready for proposal

**Yes** — with three decisions required first:

1. **Direction C (recommended), B, or A** (§5).
2. **May the typefaces change?** — it converts a MUST into a delta (§3.3).
3. **Is image optimization / an aspect-aware hero in scope?** (§6/R3).

All three are owner decisions, not engineering ones. Everything else in this exploration is measured and re-runnable: the four-palette incoherence, the six `--section-accent` sites, the dead alternation, the masked `--color-bg`, the six AA failures, the 94/31/43/20 split, the green's 3.7%-of-photography vs ~70%-of-page inversion, the portrait hero crop, the stale `faltan-imagenes.txt`, the four dead i18n keys, and the ~510-line forecast that exceeds the 400-line review budget.
