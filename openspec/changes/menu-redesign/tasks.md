# Tasks: menu-redesign

**Change**: `menu-redesign`
**Phase**: tasks
**Status**: Complete — five review slices defined, no code written
**Date**: 2026-10-24
**Inputs**: `proposal.md` (D1–D3, non-goals), `design.md` (§9 tokens, §10 component list, §11 coupling, §12 verification, §13 risks), `specs/{homepage-layout,product-menu,i18n}/spec.md`, `openspec/config.yaml` (group by phase, hierarchical numbering, session-sized tasks; `runner: none`; `apply.tdd: false`; `verify.build_command: npm run build`)
**Review budget**: 400 changed lines per review, counted as **additions + deletions** (`openspec/config.yaml`)

Numbers marked **[measured]** were read from the working tree in this phase. Numbers marked **[estimate]** are changed-line forecasts, not measurements.

---

## 1. Delivery shape

Chained / stacked PRs, one review per slice, five slices:

```
master
  └─ s1-foundations              ~270 [estimate]   must land first
       └─ s2a-image-pipeline        ~170 [estimate]   ATOMIC — one review, no split
            └─ s2b-section-identity  ~200 [estimate]
                 └─ s2c-decelled-cards ~120 [estimate]
                      └─ s3-chrome      ~110 [estimate]   independent of s2a–s2c
```

- Branches: `menu-redesign/s1-foundations`, `.../s2a-image-pipeline`, `.../s2b-section-identity`, `.../s2c-decelled-cards`, `.../s3-chrome`. Each PR targets its parent branch while stacked and is retargeted to `master` when the parent merges.
- `s3-chrome` touches only `SectionNav.astro` and `Footer.astro`, which no other slice touches. It may be reviewed immediately after S1 if the chain needs reordering; it is kept last here to preserve one linear rebase path.
- Every slice independently holds `npx astro check` at 0 errors and `npm run build` at 2 pages (proposal §8).
- Every commit stages explicit paths. `git add -A` / `git add .` are forbidden: `.codegraph/` is untracked and `openspec/config.yaml` carries a pre-existing modification, both out of scope (proposal §6.7, R7).

### 1.1 Why five slices instead of the design's three

Design §11 forecasts S1 ≈ 180, S2 ≈ 240, S3 ≈ 90 (total ≈ 510). The measured file sizes do not support S2 = 240: `src/data/menu.ts` is 1169 lines **[measured]**, `MenuSection.astro` 173, `ProductCard.astro` 97, `global.css` 143. The image migration alone changes ~95 lines in `menu.ts` (31 static imports + 31 rewired `image` values + the type), and the section rewrite is a ~175-line diff in a single file. Slice 2 as designed is ~490 changed lines, 1.2× the review budget.

The atomic unit is preserved intact inside **S2A**. Only the presentational half of the design's slice 2 is split off into S2B (sections and grid) and S2C (cells and list rows). See §3.2 for the two new couplings that make that split mandatory rather than cosmetic.

---

## 2. Slice map

| Slice | Title | Requirements it closes (spec) | Est. changed lines **[estimate]** | Files touched | Atomic? |
| --- | --- | --- | --- | --- | --- |
| **S1** | Foundations — tokens, type, document head, hero | `homepage-layout` → Typography (type half), Hero Section Branding; `i18n` → Locale Alternates and Document Head Metadata; Warm Color Palette (token half) | ~270 | `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/Hero.astro`, `src/i18n/es.json`, `src/i18n/en.json` + 1 binary rename | No — splittable at `global.css` vs head/hero if the diff exceeds 400 |
| **S2A** | Typed menu data + `astro:assets` pipeline | `product-menu` → Typed Menu Data; Product Cards (image half) | ~170 | `src/data/menu.ts`, `src/data/category-visual.ts`, `src/components/ProductCell.astro` (renamed from `ProductCard.astro`), `src/components/MenuSection.astro` (import only), `package.json` + 31 binary renames | **Yes — cannot be split** (design §6.5, §11) |
| **S2B** | Section identity + grid + protocolo | `product-menu` → Section Visual Identity, Responsive Product Grid; Warm Color Palette (field half) | ~200 | `src/components/MenuSection.astro`, `src/pages/index.astro`, `src/pages/en/index.astro` | No — but must precede S2C |
| **S2C** | De-carded cells + list rows + surface value | `product-menu` → Product Cards (cell half); `homepage-layout` → Typography (money column), Warm Color Palette (surface + list-description pairs) | ~120 | `src/components/ProductCell.astro`, `src/components/ProductListItem.astro`, `src/styles/global.css` | No — but must follow S2B |
| **S3** | Chrome — nav and footer | `homepage-layout` → Institutional Footer; Warm Color Palette (interactive states); `i18n` → UI Translation Files (dead-key half) | ~110 | `src/components/SectionNav.astro`, `src/components/Footer.astro` | No — independent of S2A–S2C |

---

## 3. Dependencies and ordering constraints

### 3.1 Preserved from design §11 (do not weaken)

| Constraint | Where it lands |
| --- | --- |
| `category-visual.ts` + the card component — `categoryGradients` stops existing and the card is its only importer | Both inside **S2A** |
| `menu.ts` image type + 32 asset moves + `<Image>` in the cell — a partial migration does not compile (§6.5) | All inside **S2A** |
| `BaseLayout` `og:image` + the hero asset — `og:image` must reference a build-emitted file that exists in `dist/`; impossible while the hero lives in `public/`. This is why the hero is in S1, not S3 | **S1** (tasks 1.4–1.6) |
| Token block + consumers — S1 changes token **values and roles only, never names**, so consumers keep compiling | **S1** (task 1.1) |

### 3.2 Added by this phase (evidence, not preference)

1. **De-carding must not precede field restoration.** A de-carded cell puts the product name `#4A3728` directly on the section ground. On the current green `#708C64` that is **3.01:1** (recomputed: L 0.043424 vs 0.23083). The field must be `#F7F3EC` before the card container disappears. Hence S2B (field) before S2C (de-card).
2. **`--color-surface` must not reach `#E6E1D3` while cards still paint it.** `#8A5A2B` on `#E6E1D3` is **4.49:1** — the one forbidden pair in design §9.3 (D8). `ProductCard` paints `background: var(--color-surface)` and its price sits inside that panel until S2C. Changing the surface value in S1 would introduce a fresh AA failure on every card price for the life of two reviews. The surface value therefore moves to **S2C**, where it is the same commit that removes the last price from a surface panel. Until then `#8A5A2B` on `#f5ede4` is **5.06:1** (recomputed), which passes.
3. **`footer.location.text` must be rendered before the i18n dead-key scenario can pass.** `i18n` → UI Translation Files says a key with no use site MUST NOT be stored. S1 removes three dead keys but leaves `footer.location.text` unrendered until S3. The requirement closes at S3; the chain must not stop after S2C.

### 3.3 Ordering rules

1. S1 first. 1.1 (tokens) before 1.5/1.6 (consumers); 1.3 (i18n keys) before 1.6 (`t()` lookups); 1.4 (asset move) before 1.5/1.6 (imports).
2. 1.4–1.6 are **one commit**: moving the hero out of `public/` breaks the build until `Hero.astro` and `BaseLayout.astro` stop referencing `/images/hero.webp`.
3. S2A is one review. Its internal task order is 2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6.
4. S2B after S2A (it edits `MenuSection.astro`, which S2A touches for the `ProductCell` import).
5. S2C after S2B (constraint 3.2.1 and 3.2.2).
6. S3 anywhere after S1; last by convention.

---

## 4. Line budget

Binary renames are **reported in their own column and excluded from the budget** (design risk D3: 32 renames inflate the file list of a small slice).

| Slice | Text files | Est. changed lines **[estimate]** | Uncertainty | Binary renames (not counted) | Under 400? |
| --- | --- | --- | --- | --- | --- |
| S1 Foundations | 5 | 270 | ±50 | 1 (`hero.webp`) | **Yes** — ~130 headroom |
| S2A Typed data + image pipeline | 5 | 170 | ±35 | 31 (`products/*.webp`) | **Yes** — ~230 headroom |
| S2B Section identity + grid | 3 | 200 | ±40 | 0 | **Yes** — ~200 headroom |
| S2C De-carded cells + list rows | 3 | 120 | ±25 | 0 | **Yes** — ~280 headroom |
| S3 Chrome | 2 | 110 | ±25 | 0 | **Yes** — ~290 headroom |
| **Total** | **15 distinct (18 touches)** | **870** | ±120 | **32** | 5 reviews, all under budget |

- The total is ~1.7× design §11's 510. The gap is concentrated in the design's slice 2 (240 forecast vs ~490 measured-shape estimate), which is exactly what the S2A/S2B/S2C split absorbs.
- If any single slice measures above 400 on the actual diff, apply the one-honest-pass rule: S1 splits at `global.css` vs head/hero; S2B splits at `MenuSection` vs the two pages; S2C splits at `ProductCell` vs `ProductListItem` + surface token. S2A has no split point and would require a `size:exception`.
- Every PR body states changed lines and rename count separately (design D3).

---

## 5. Phase 0 — Preconditions

### 0.1 Capture the baseline

- Files: none.
- Do: run `npx astro check` (expect **14 files, 0 errors, 0 warnings, 0 hints**) and `npm run build` (expect **2 pages**: `dist/index.html`, `dist/en/index.html`). Record both outputs verbatim for the S1 PR body. Record `git status --short` — expect `M openspec/config.yaml`, `?? .codegraph/`, `?? openspec/changes/menu-redesign/`.
- Verify: both commands exit 0 and the file/page counts match. If the baseline differs, stop: a pre-existing error must not be attributed to a slice.

### 0.2 Create the branch chain

- Files: none.
- Do: create the five branches in §1 off `master` in order. No code change.
- Verify: `git log --oneline --graph --all` shows the five branches chained; `git status --short` is unchanged from 0.1.

### 0.3 Commit the change artifacts separately

- Files: `openspec/changes/menu-redesign/**` only.
- Do: commit the proposal, specs, design, and this file as one docs commit before any slice branch is cut, so no slice diff carries planning files. Do **not** stage `openspec/config.yaml` (pre-existing modification) or `.codegraph/`.
- Verify: `git show --stat HEAD` lists only `openspec/changes/menu-redesign/` paths; `git status --short` still shows `M openspec/config.yaml` and `?? .codegraph/`.

---

## 6. Phase 1 — Slice S1: Foundations

Closes: Hero Section Branding; the type half of Typography; Locale Alternates and Document Head Metadata; the token half of Warm Color Palette. Does **not** close the sub-category heading failure (still on a green field until S2B) or the footer copyright (S3). S1 must not be judged on those.

### 1.1 Replace the `:root` token block

- Files: `src/styles/global.css` (L77–90).
- Do: declare **10 colour tokens** — `--color-primary #4A3728`, `--color-secondary #8A5A2B`, `--color-bg #F7F3EC`, `--color-surface` **kept at `#f5ede4`** (see §3.2.2), `--color-text #2C1810`, `--color-text-light #D4C5B5`, `--color-border #BAAE9B`, `--color-border-inverse #79604F` (new), `--color-green #708C64` (new), `--color-green-ink #4E6B44` (new). Declare `--font-heading` (Petrona stack) and `--font-body` (Archivo stack), the seven-step ladder (`--text-base` on `clamp()`, the six larger steps derived with `calc()`), `--leading 1.5`, `--leading-display 1.15`, `--measure 68ch`, `--max-width 1100px`, `--gutter clamp(1.25rem, 4vw, 2rem)`, and the five space steps. Preserve every existing token **name**; add, never rename.
- Verify: source inspection of the block — 10 colours, 2 families, 7 steps, 2 leading values, measure, max-width, gutter, 5 space steps. Contrast arithmetic from the declared hexes: `#2C1810`/`#F7F3EC` 15.25, `#4A3728`/`#F7F3EC` 10.16, `#8A5A2B`/`#F7F3EC` 5.31, `#4E6B44`/`#F7F3EC` 5.41, `#D4C5B5`/`#4A3728` 6.67, `#BAAE9B`/`#F7F3EC` 1.97, `#79604F`/`#4A3728` 1.93, `#708C64`/`#F7F3EC` 3.38, and `#8A5A2B`/`#f5ede4` ≥ 4.5 (recomputed 5.06). `npx astro check` → 0 errors.

### 1.2 Delete the three dead CSS blocks and rebase `body`

- Files: `src/styles/global.css`.
- Do: delete the duplicated `.section-nav` / `.section-nav__link` / `:hover` block (L96–135) — `SectionNav.astro`'s scoped copy is the live one; delete the unreachable `.menu-sections > .menu-section:nth-child(odd/even)` block (L137–144); delete `.sub-category__heading` (L146–157). Set `html { scroll-padding-top: 4.5rem }` (one offset; the inert `scroll-margin-top: 6rem` is removed in 3.1). Set `body` to `--font-body`, `--text-base`, `--color-bg`, `--color-text`.
- Verify: source inspection — `section-nav` 0 hits in `global.css`; `nth-child` 0 hits in `global.css`; `sub-category__heading` 0 hits under `src/`; one `scroll-padding-top`. `npm run build` → 2 pages, and the built nav is still styled (its scoped block survived).

### 1.3 Resolve the i18n keys in both locales

- Files: `src/i18n/es.json`, `src/i18n/en.json`.
- Do: add `meta.title` and `meta.description`; delete `nav.es`, `nav.en`, `protocolo.title`. Keep `footer.location.text` (rendered in S3). Both files end with the same 10 keys in the same order.
- Verify: source inspection — identical key sets; `rg "nav\.(es|en)|protocolo\.title" src/` → 0 hits; both descriptions non-empty and different from each other. `npx astro check` → 0 errors.

### 1.4 Move the hero photograph into the asset graph

- Files: `public/images/hero.webp` → `src/assets/hero.webp`.
- Do: `git mv`, creating `src/assets/`. Leave `public/images/products/` in place (moved in S2A) and `public/favicon.{svg,ico}` untouched.
- Verify: `git status --short` shows `R public/images/hero.webp -> src/assets/hero.webp`; `git diff --cached --stat -M` shows 100% similarity and **0 changed lines**; byte size still 1,614,004 **[measured]**.

### 1.5 Rewrite `Hero.astro`

- Files: `src/components/Hero.astro`.
- Do: import the asset; replace the background band with the two-column grid (text left, photograph right at `clamp(16rem, 26vw, 22rem)` from 768 px up) and a single column below 768 px where the photograph goes full-bleed via `calc(100% + 2 * var(--gutter))` and balanced negative inline margins. Render `<Image priority widths={[320,480,640,960]} sizes="(min-width: 1440px) 352px, (min-width: 768px) 27vw, 100vw" format="webp" quality={80} alt="" />`. Delete `min-height: 100dvh`, the scrim `linear-gradient`, `#fdf8f3`, `#d4c5b5`, the three hardcoded sizes, and every `object-fit`. Text precedes the photograph in DOM order. Keep the `h1` literal and `t("hero.tagline", locale)`.
- Verify: source inspection — no `vh`/`dvh`/`svh`/`lvh`, no `object-fit`, no hex/rgb literal, no `font-size: <number>` in the file; `sizes` and `widths` present. `npm run build`, then built HTML: the hero `<img>` carries `fetchpriority="high"`, `loading="eager"`, `srcset`, `sizes`, `width="3024"`, `height="4032"`, and a `/_astro/…webp` source.

### 1.6 Rewrite the document head in `BaseLayout.astro`

- Files: `src/layouts/BaseLayout.astro`.
- Do: import `t`, the hero asset, and `getImage`. Drop the unused `title` prop. One Google Fonts `<link>` (`Petrona:wght@500` + `Archivo:wght@400;500;600`, `display=swap`) plus the two `preconnect`s. Emit `meta description`, `og:title`, `og:description`, `og:image` (via `getImage({ src: heroImage, width: 900, format: "webp", quality: 80 }).src`), `og:locale`, `twitter:card`, `meta name="theme-color"` = `#F7F3EC`, and three `link rel="alternate"` (`es` → `/`, `en` → `/en/`, plus the self-referencing one the spec asks for explicitly, which on each page duplicates that page's own `hreflang`). Title and description resolve from `t("meta.title")` / `t("meta.description")`. Do not add `site` to `astro.config.mjs`; use the emitted site-relative `.src`.
- Verify: built HTML on **both** pages — exactly one `fonts.googleapis.com` `<link>` carrying `display=swap`; non-empty `meta description` differing between locales; `og:locale` differing between locales; three `alternate` links with the expected targets; `theme-color` = `#F7F3EC`; the `og:image` path resolves to a file that exists under `dist/`. `npx astro check` → 0 errors; `npm run build` → 2 pages.

### 1.7 S1 verification and human review pass

- Files: none (read-only).
- Do: run the §12.2 assertions that S1 can satisfy, **scoped to the files S1 closes** — `rg "font-size:\s*[0-9]" src/components/Hero.astro` → 0; `rg "#[0-9a-fA-F]{3,8}|rgba?\(" src/components/Hero.astro` → 0; `rg "100vh|100dvh|svh|lvh" src/components/Hero.astro` → 0; `rg "linear-gradient" src/components/Hero.astro` → 0. The tree-wide versions of the font-size and colour-literal assertions cannot pass yet (`MenuSection`, `Footer`, `SectionNav`, `ProductListItem` still hold literals and sizes until S2B/S2C/S3) and belong to 5.3/6.1.
- **Human review checklist (nothing mechanical covers these):**
  - Headings render in Petrona and body in Archivo, or in the declared fallbacks; the swap reflow is bounded to one line of hero text (design D5).
  - The hero photograph is **not cropped** and its bottom edge falls where design §4.2 says; on a 1280×720 window the menu begins ≈607 px, with the nav and the first section's rule visible.
  - At 375 px the photograph bleeds edge to edge and there is **no horizontal scrollbar**.
  - The cream field is visible wherever the page shows through (hero ground, gap above the footer).
  - The nav still looks like the nav (its scoped styles were not the deleted ones).
  - Prices are visibly darker gold; nav hover is no longer white-on-gold.
  - No `undefined`, no key name, no `[object Object]` anywhere on either page.
- Verify: the greps above plus `npx astro check` 0 and `npm run build` 2 pages, with the checklist signed off in the PR body.

---

## 7. Phase 2 — Slice S2A: Typed menu data + image pipeline (**ATOMIC**)

One review. It cannot be split: `Product.image` changing type breaks the cell the instant `menu.ts` changes, `<Image>` breaks the moment the assets leave `public/`, and the glaze map breaks the cell the instant `categoryGradients` stops existing (design §6.5). A split produces a commit that does not compile.

### 2.1 Move the 31 product photographs

- Files: `public/images/products/*.webp` (31) → `src/assets/products/*.webp`.
- Do: `git mv` all 31 **[measured: 31 files, 23,709,224 bytes total]**, then remove the now-empty `public/images/products/` and `public/images/` directories. Do not touch `public/favicon.svg`, `public/favicon.ico`, or `src/data/espresso-leche-grande.HEIC` (stray, out of scope).
- Verify: `git status --short` shows 31 renames; `git diff --cached --stat -M` shows 100% similarity, 0 changed lines; `public/` contains only the two favicons; total byte size of the moved set unchanged.

### 2.2 Replace `categoryGradients` with the glaze library

- Files: `src/data/category-visual.ts`.
- Do: export `GlazeToken = { fill: string; rim: string }` and `glazeTiles: Record<Category, GlazeToken>` with four distinct fills across all six categories — `cafe`/`menus` walnut `#5B3C2B`/`#79604F`, `sin-cafe`/`opciones-saladas` ochre `#C4956A`/`#AB805B`, `pasteleria-panaderia` ceramic `#D8D2BF`/`#BAAE9B`, `promos` brand green `#708C64`/`#899D7A` (P2 resolved: green stands). Delete `categoryGradients` and every `linear-gradient` string.
- Verify: source inspection — six keys covering every `Category` value; four distinct `fill` values; no `linear-gradient` in this file; `rg "categoryGradients" src/` → 0. Do **not** run `npx astro check` at this point: deleting the export leaves `ProductCard` with a dangling import until 2.4 and 2.5 land, and that is expected inside one atomic review.

### 2.3 Retype and rewire `menu.ts`

- Files: `src/data/menu.ts`.
- Do: add `import type { ImageMetadata } from "astro"` and 31 static asset imports with camelCase identifiers derived from the file names; change `Product.image` to `ImageMetadata | ""`; rewire the 31 photographed entries from `"/images/products/x.webp"` to the imported binding. Leave the 63 `image: ""` entries untouched — they are not deleted, and the count may only fall by assigning a photograph.
- Verify: `rg -c 'image: ""' src/data/menu.ts` → **63**; `rg -c 'from "\.\./assets/products/' src/data/menu.ts` → **31**; no product retains a string path (`rg '/images/products/' src/data/menu.ts` → 0); product count still 94 and categories still 6; the `protocolo` entry unchanged. `npx astro check` → 0 errors (only once 2.4 and 2.5 land).

### 2.4 Rename `ProductCard.astro` to `ProductCell.astro` and swap the render path

- Files: `src/components/ProductCard.astro` → `src/components/ProductCell.astro`.
- Do: `git mv` and rename the `product-card*` classes to `product-cell*`. Replace the raw `<img>` + inline `onerror` + hidden gradient sibling with `<Image src={product.image} alt={name} widths={[240,360,480,720]} sizes="(min-width: 1100px) 346px, (min-width: 1024px) 32vw, (min-width: 768px) 46vw, calc(100vw - 2.5rem)" format="webp" quality={80} />`. Replace the imageless branch with a single `<div class="product-cell__glaze" role="img" aria-label={name} />` fed by `--glaze-fill` / `--glaze-rim` custom properties from the data module. Remove `height: 180px` and `object-fit: cover`; add `width: 100%; height: auto; display: block` for the image. Keep the card container, radius, shadow, and hover lift for now — S2C removes them.
- Verify: `rg "onerror" src/` → 0; `rg "linear-gradient" src/` → 0; the file emits at most one image node per product. `npm run build`, then built HTML: a photographed product emits exactly one `<img>` with `srcset`, `sizes`, `width`, `height`, `loading="lazy"`, `decoding="async"`; an imageless product emits zero `<img>` and one `role="img"` swatch.

### 2.5 Update the `MenuSection` import

- Files: `src/components/MenuSection.astro` (import line and two `<ProductCard>` call sites).
- Do: point the import at `./ProductCell.astro` and rename the JSX usages. Nothing else in this file changes in S2A.
- Verify: `rg "ProductCard" src/` → 0; `npx astro check` → **0 errors** (this is the task that makes the slice compile); `npm run build` → 2 pages.

### 2.6 Declare `sharp` explicitly (P1 resolved)

- Files: `package.json`.
- Do: add `"sharp": "^0.34.5"` to `devDependencies`, matching the version already resolved in `package-lock.json` **[measured: `node_modules/sharp` 0.34.5]** and the repo's caret-range convention. One line. No other dependency is added, removed, or upgraded.
- Verify: `package-lock.json` still resolves a single `node_modules/sharp` at 0.34.5 (no second copy, no version change); `npm run build` still produces derivatives.

### 2.7 S2A verification and human review pass

- Files: none (read-only).
- Do: run `npx astro check` (0 errors) and `npm run build` (2 pages). Confirm `dist/_astro/` holds the derivatives (31 × 4 = 124 product files, 4 hero widths, 1 OG image = **129 encoded images**) and that `dist/images/` does **not** exist.
- **Human review checklist:**
  - All 31 photographs render at their own aspect ratio — the 0.75 portraits stay portrait, and `espresso-leche-mediano` (1.4538) and `promo-chipa-xl` (1.3333) stay landscape. Nothing is cropped or squashed.
  - The 63 imageless products show flat glazed tiles with a visible 1 px inner rim — no gradient, no broken-image icon, no missing-image look.
  - All four fills are visible in context (walnut, ochre, ceramic, green) and no two adjacent categories share one.
  - The card chrome, shadow, and hover lift are **still present** — that is expected in S2A; S2C removes them.
  - The build is visibly slower than before; this is the accepted cost of 129 encoded images (design D2), not a regression.
  - The PR body states **31 renames** and the changed-line count separately (design D3).
- Verify: the commands above plus the checklist signed off.

---

## 8. Phase 3 — Slice S2B: Section identity, grid, protocolo

Closes Section Visual Identity and Responsive Product Grid. Restores the cream field, which is the precondition for S2C.

### 3.1 Remove the per-section accent from `MenuSection`

- Files: `src/components/MenuSection.astro`.
- Do: delete `sectionAccent?: string` from `Props`, from the destructure, and the `style={sectionAccent ? ... }` attribute. Delete `scroll-margin-top: 6rem` (the single `html` offset from 1.2 replaces it). The section declares **no background** at all.
- Verify: `rg "section-accent" src/` → 0; the `<section>` element carries no `style` attribute in the built HTML.

### 3.2 Section header becomes a rule plus a label

- Files: `src/components/MenuSection.astro` (`.menu-section__heading`).
- Do: left-aligned label in `--color-green-ink`, `--text-2xl`, `--leading-display`, on a hairline that spans the content column and is broken by the label (pseudo-element rules using `--color-green` / `--color-border`). No background, no centred text, no ad-hoc font size.
- Verify: source inspection — no `text-align: center` on the heading, no hex/rgb literal, label colour is `var(--color-green-ink)`; contrast `#4E6B44` on `#F7F3EC` = 5.41 from the declared hexes. Built HTML: adjacent sections each render their own rule and label.

### 3.3 Replace the grid model

- Files: `src/components/MenuSection.astro` (`.menu-section__grid`).
- Do: `grid-template-columns: 1fr` below 768 px, `repeat(2, minmax(0, 1fr))` from 768 px, `repeat(3, minmax(0, 1fr))` from 1024 px; `align-items: start`; `grid-auto-rows: auto`; `column-gap: clamp(1.25rem, 3vw, 2rem)`; `row-gap: clamp(2rem, 4vw, 3rem)`; `max-width: var(--max-width)`. Remove the old `repeat(2, 1fr)` / `repeat(3, 1fr)` declarations and the single `gap`.
- Verify: source inspection — `minmax(0, 1fr)` in both multi-column rules, `align-items: start` present, no fixed row height. Browser geometry pass at 375 / 768 / 1024 / 1280 px: 1 / 2 / 3 columns, no horizontal scrollbar at 375, no stretched cell.

### 3.4 Sub-category headings get a lighter rule

- Files: `src/components/MenuSection.astro` (`.menu-section__sub-heading`).
- Do: label in `--color-green-ink` at `--text-lg` with `--leading-display`; rule weight lighter than the category rule (hairline in `--color-border`); no `--color-secondary` label; no ad-hoc size.
- Verify: source inspection — label colour token, rule token, and a visibly lighter treatment than 3.2. Contrast 5.41 as in 3.2.

### 3.5 Protocolo block on the surface, no milky panels

- Files: `src/components/MenuSection.astro` (`.menu-section__protocolo*`, `.menu-section__list`).
- Do: the protocolo block renders on `var(--color-surface)` with the same rule-and-label treatment and no product cells; delete the dashed `--color-secondary` border and the `rgba(255,255,255,.5)` panel. Delete the `rgba(255,255,255,.4)` panel from `.menu-section__list`. Body text `--color-text`, label `--color-green-ink`, both on the surface.
- Verify: `rg "rgba\(" src/components/MenuSection.astro` → 0 (the other components keep their literals until S2C/S3 — this assertion is scoped on purpose); built HTML: the protocolo section shows the translated title and body, no cells; contrast on `#f5ede4` — `#2C1810` 14.55 and `#4E6B44` 5.16 (both recomputed from the declared hexes), each ≥ 4.5.

### 3.6 Remove the accent records from both pages

- Files: `src/pages/index.astro`, `src/pages/en/index.astro`.
- Do: delete the `sectionAccents` record, the `sectionAccent={...}` prop on every `MenuSection`, and the `sectionAccent="rgb(112, 140, 100)"` literal on the protocolo section. The two files must stay structurally identical apart from `locale`.
- Verify: `rg "section-accent|sectionAccents|rgb\(" src/pages` → 0; `rg "#[0-9a-fA-F]{3,8}" src/pages` → 0; diff the two page files — only the `locale` constant differs, since every prop is identical.

### 3.7 S2B verification and human review pass

- Files: none (read-only).
- Do: `npx astro check` (0), `npm run build` (2 pages). Run `rg "section-accent" src/` → 0 and `rg "linear-gradient" src/` → 0.
- **Human review checklist:**
  - Every section renders on the cream field — **no green rectangle anywhere**; the section ground is the page ground.
  - Adjacent sections are distinguishable by rule and label alone.
  - The label interrupts the rule, and the green reads as a label, not as a background.
  - Sub-category rules are visibly lighter than the category rule; both labels share one green.
  - Grid: 1 column at 375, 2 at 768, 3 at 1024+; reading order is row-major so prices keep their menu sequence.
  - Ragged cell bottoms read as air, not as breakage; the worst-case intra-row slack (≈222 px at ≥1100 px) is accepted, not "fixed" by stretching a photograph.
  - Cards still carry their cream container and shadow — expected in S2B; S2C removes them.
  - The protocolo block sits on a slightly darker cream panel with no dashed border and no milky wash.
  - ES and EN pages are structurally identical.
- Verify: commands above plus the checklist signed off.

---

## 9. Phase 4 — Slice S2C: De-carded cells, list rows, surface value

Closes the cell half of Product Cards, the money column of Typography, and the surface-dependent pairs of Warm Color Palette.

### 4.1 De-card `ProductCell`

- Files: `src/components/ProductCell.astro`.
- Do: remove the cell container's background, `border-radius`, `box-shadow`, `overflow: hidden`, the `transition`, and the `:hover` transform/shadow block. Add exactly one hairline (`--color-border`) between the media area and the text. Price → `--color-secondary`, `--text-base`, `font-weight: 600`, `font-variant-numeric: tabular-nums`, right-aligned. Name → `--text-lg` Petrona, `--color-primary`; description → `--text-sm` Archivo, `--color-text`. Every size resolves from the scale; no literal colours.
- Verify: source inspection — no `border-radius`, no `box-shadow`, no `transform`, no `:hover`, one `border-top` hairline, `tabular-nums` present, `text-align: right` on the price; `rg "#[0-9a-fA-F]{3,8}|rgba?\(" src/components/ProductCell.astro` → 0; `rg "font-size:\s*[0-9]" src/components/ProductCell.astro` → 0.

### 4.2 Fix the list rows

- Files: `src/components/ProductListItem.astro`.
- Do: description → `--color-text` at `--text-sm` with **no** `opacity`; price → `--color-secondary`, `tabular-nums`, right-aligned; keep the dotted leader (`border-bottom: 1px dotted var(--color-border)`) and the 480 px wrap rule. Remove the `rgba(0, 0, 0, 0.02)` hover background and its `border-radius` — a raw colour literal the palette requirement forbids (design §10 does not list it; the grep assertion does).
- Verify: `rg "rgba\(|opacity" src/components/ProductListItem.astro` → 0; `rg "tabular-nums" src/components/ProductListItem.astro` → 1; contrast `#2C1810` on `#F7F3EC` = 15.25.

### 4.3 Move `--color-surface` to `#E6E1D3`

- Files: `src/styles/global.css` (one declaration).
- Do: change `--color-surface` from `#f5ede4` to `#E6E1D3`. This is safe **only now**: after 4.1 no price sits on a surface panel, so the forbidden `#8A5A2B` on `#E6E1D3` (4.49) cannot occur.
- Verify: source inspection — the token reads `#E6E1D3`; `rg "color-surface" src/components` shows the only remaining consumer is the protocolo block. Contrast on `#E6E1D3`: `#2C1810` 12.91, `#4E6B44` 4.58 (design §9.3). No price renders on it.

### 4.4 Cell verification and the tabular-figures gate

- Files: none (read-only).
- Do: `npx astro check` (0), `npm run build` (2 pages). Run the §12.2 assertions that S2C can satisfy — `rg "onerror" src/` 0, `rg "linear-gradient" src/` 0, `rg -c 'image: ""' src/data/menu.ts` 63, `rg -c 'from "\.\./assets/products/' src/data/menu.ts` 31, `rg "font-size:\s*[0-9]" src/components/ProductCell.astro src/components/ProductListItem.astro` 0, colour literals in those two files 0. The tree-wide font-size and colour-literal greps still fail on `Footer`/`SectionNav` until S3 and are asserted in 5.3. Built HTML: every price carries `tabular-nums` styling and is right-aligned; no card container declares a background.
- **Tabular-figures gate (design §3.6, the only claim source inspection cannot settle):** in the browser, render `1111` and `9999` in the price style and compare widths. Equal within 0.5 px passes. If it fails, apply the contingency — move the price role to Petrona 500 (already loaded) — and re-run this task.
- Verify: the greps and the gate result recorded in the PR body.

### 4.5 S2C human review pass

- **Human review checklist:**
  - No cell reads as a card: no radius, no shadow, no lift on hover.
  - Exactly one hairline separates media from text in every cell.
  - Prices form a clean column down each grid and each list; the dotted leaders survive and line up.
  - List descriptions are fully legible — no washed-out grey.
  - The ceramic tile is defined by its rim on the cream field, not by its fill.
  - No green sits behind any text anywhere.
  - The protocolo panel is slightly darker than the field and still passes by eye.
- Verify: checklist signed off; `npx astro check` 0; `npm run build` 2 pages.

---

## 10. Phase 5 — Slice S3: Chrome

Closes Institutional Footer, the interactive-state half of Warm Color Palette, and the dead-key half of UI Translation Files.

### 5.1 Rebuild the sticky nav

- Files: `src/components/SectionNav.astro`.
- Do: delete the pill chrome (`border-radius: 999px`, borders, `background: --color-secondary`, `color: #fff`), the dead `--active` class and its locale comparison, and the four `#fff` declarations (L68, L75, L99, L105). Plain text links in `--color-text` at `--text-base` on `--color-bg`, `padding-block: 0.75rem` for ≥48 px targets, hover/focus-visible = 2 px `--color-green` underline with the text unchanged, `:focus-visible` ring in `--color-green-ink`. Keep the horizontal-scroll container and the `ES`/`EN` labels derived from `locale`. Every size resolves from the scale; no literal colours.
- Verify: `rg "#fff|rgba\(|nav\.(es|en)" src/components/SectionNav.astro` → 0; `rg "section-nav__lang--active" src/` → 0. Contrast: `#2C1810` on `#F7F3EC` = 15.25 in default, hover, focus, and active states — no state paints a saturated ground behind white text.

### 5.2 Rebuild the footer text and colours

- Files: `src/components/Footer.astro`.
- Do: render `footer.location.text` through `t()` (replacing the hardcoded `Balcarce 350 / Salta, Argentina` JSX) with `white-space: pre-line`; apply `pre-line` to `footer.hours.text` too (it is currently collapsed to one line). Replace `#fff`, both `#d4c5b5`, and the three white alphas with `--color-text-light` (text, icons, copyright) and `--color-border-inverse` (divider, icon hover ground). Heading and body sizes resolve from `--text-base`, copyright from `--text-sm`. No literal colours remain in the file.
- Verify: `rg "#[0-9a-fA-F]{3,8}|rgba\(" src/components/Footer.astro` → 0; `rg "Balcarce|Salta" src/components` → 0. Built HTML both pages: location equals the locale file's `footer.location.text` and renders on two lines; EN shows "Follow us". Contrast `#D4C5B5` on `#4A3728` = 6.67; icon on hover `#D4C5B5` on `#79604F` = 3.46 (≥3.0, decorative icon).

### 5.3 S3 verification and human review pass

- Files: none (read-only).
- Do: `npx astro check` (0), `npm run build` (2 pages). `rg "rgba?\(|#[0-9a-fA-F]{3,8}" src/components src/pages` → 0 (the palette requirement's grep surface is now clean) and `rg "font-size:\s*[0-9]" src/` → 0 (Typography's "no hardcoded sizes" clause closes here, not earlier).
- **Human review checklist:**
  - The nav is text on the field — no pills, no filled hover, one 2 px green underline.
  - Every nav target is comfortably tappable at 375 px and the row still scrolls horizontally without page overflow.
  - The footer location and hours each render on two lines (the `pre-line` fix).
  - Copyright is legible — no translucent white; icons hover on the darker inverse ground.
  - ES/EN: location, hours, and social heading all in the right language; key parity intact.
  - No `undefined`, no key name, no `[object Object]`.
- Verify: commands above plus the checklist signed off.

---

## 11. Phase 6 — Chain close-out

### 6.1 Full-tree verification on the final branch

- Files: none.
- Do: run the complete §12.2 assertion set, `npx astro check` (0 errors, 14 files), `npm run build` (2 pages), and the §12.3 built-HTML checks on both pages.
- Verify: every assertion returns its expected value; `dist/_astro/` holds the derivatives and `dist/images/` does not exist.

### 6.2 Cross-locale structural parity

- Files: none.
- Do: diff the structure of `dist/index.html` and `dist/en/index.html` — same elements, same order, same class names, same image counts (31 photographed, 63 swatches), differing only in text, `lang`, `og:locale`, `hreflang` self-reference, and description.
- Verify: the diff shows only those expected differences; product counts match on both pages.

### 6.3 PR bodies and delivery notes

- Files: none (PR descriptions).
- Do: each PR states its slice boundary, dependencies, changed-line count, and rename count **separately**; S2A also states the 129-derivative build cost (D2), the `sharp` declaration (P1), and that `/images/*` public URLs stop existing (D4); the chain's last PR states that `dist/images/` is gone and a stale-file purge is needed if the host deploys incrementally.
- Verify: every PR body carries the chain context and the two counts.

### 6.4 Traceability sign-off

- Files: none.
- Do: walk the matrix in §12 and confirm every requirement has a slice that closes it, with the evidence recorded.
- Verify: no requirement is left without a closing slice; `verify` receives this matrix as its checklist.

---

## 12. Requirement traceability

| Spec | Requirement | Closes in | Evidence |
| --- | --- | --- | --- |
| `homepage-layout` | Hero Section Branding | **S1** | Built HTML: hero `<img>` with `fetchpriority="high"`, eager, `srcset`, `sizes`, `width`/`height` = 3024/4032, `/_astro/` source; no `vh` unit; no background image |
| `homepage-layout` | Warm Color Palette | **S1** (tokens) → **S2B** (field, no accent) → **S2C** (surface, list descriptions) → **S3** (interactive states) | Greps return 0 for `--section-accent`, colour literals in `src/components`/`src/pages`; contrast recomputed per §9.3; `#8A5A2B` on `#E6E1D3` never occurs |
| `homepage-layout` | Institutional Footer | **S3** | `footer.location.text` rendered via `t()` in both locales; no literal colour in the component; `#D4C5B5`/`#4A3728` = 6.67 |
| `homepage-layout` | Typography | **S1** (families, scale, leading, measure, loading) + **S2C** (money column) + **S3** (the last hardcoded sizes in nav and footer) | One `<link>` with `display=swap`; no `font-size: <number>` under `src/`; `tabular-nums` on every price; §4.4 browser gate |
| `product-menu` | Product Cards | **S2A** (image + glaze) + **S2C** (no card, hairline, price) | Exactly one image node per photographed product, zero for imageless; no `onerror`; no `border-radius`/`box-shadow`/hover on the cell |
| `product-menu` | Responsive Product Grid | **S2B** | 1 / 2 / 3 columns at the breakpoints; `align-items: start`; `grid-auto-rows: auto`; no horizontal overflow at 375 |
| `product-menu` | Typed Menu Data | **S2A** | `image: ImageMetadata \| ""`; 63 imageless / 31 imported; six glaze keys; no `categoryGradients`; 94 products |
| `product-menu` | Section Visual Identity | **S2B** | No section background; rule + label per section; lighter sub-category rule; protocolo on the same treatment, no cells |
| `i18n` | Locale Alternates and Document Head Metadata (ADDED) | **S1** | Description, OG ×4, Twitter card, `theme-color` `#F7F3EC`, three `hreflang` alternates on both pages; `og:image` file exists in `dist/` |
| `i18n` | UI Translation Files (MODIFIED) | **S1** (removals, additions) + **S3** (`footer.location.text` rendered) | Identical key sets; every key has a `t()` use site; `nav.es`/`nav.en`/`protocolo.title` absent; menu content stays in `menu.ts` |

---

## 13. Verification catalogue

Everything below exists in this project. Nothing else is proposed.

| Kind | Command / method |
| --- | --- |
| Types | `npx astro check` → 0 errors (baseline 14 files) |
| Build | `npm run build` → 2 pages; `dist/_astro/` derivatives; no `dist/images/` |
| Source assertions | `rg` / `Select-String` per design §12.2 |
| Built HTML | inspect `dist/index.html` and `dist/en/index.html` |
| Contrast | recompute WCAG 2.1 relative luminance from the declared hexes |
| Geometry | arithmetic from the `clamp()` values, confirmed at 375 / 768 / 1024 / 1280 px |
| Human | the per-slice review checklists above — no visual-regression tool exists |

**Forbidden in every task:** any `npx biome …` command (the native binary exits `-1073741515` on this machine; that is an environment fault, never a finding — formatting stays manual per `biome.json`: 2-space indent, LF, double quotes); any test runner or new test dependency (`runner: none`, `apply.tdd: false`); any dependency change other than the one-line `sharp` declaration in 2.6.

---

## 14. Sequencing hazards recorded by this phase

| # | Hazard | Handling |
| --- | --- | --- |
| **T1** | Design §11's slice-2 estimate (≈240) is ~2× low against the measured file sizes; the design's three-slice shape does not fit 400 lines | Split into S2A/S2B/S2C (§1.1); atomic unit preserved in S2A |
| **T2** | De-carding before field restoration puts `#4A3728` on `#708C64` = **3.01:1** | Field (S2B) strictly precedes de-card (S2C) |
| **T3** | `--color-surface` → `#E6E1D3` in S1 would put every card price at **4.49:1** (`#8A5A2B` on `#E6E1D3`, forbidden by design §9.3/D8) because cards still paint the surface | Surface value deferred to S2C; 5.06:1 until then. Deviation from design §10's "replace the `:root` block" grouping, deliberate and recorded |
| **T4** | `footer.location.text` stays unrendered until S3, so the i18n "no dead key" scenario cannot pass before then | Chain must not stop after S2C |
| **T5** | `ProductListItem` L42 carries `rgba(0, 0, 0, 0.02)` — a raw colour literal design §10 does not list, but the palette grep assertion catches | Removed in 4.2 |
| **T6** | Design §9.1 names an "active-nav marker" while §10 deletes the dead `--active` class; no scroll-spy exists and none is proposed | Hover / focus-visible / `:active` are text on the field (15.25:1) with a 2 px green underline; no `:target` marker (design §11 marks it droppable). `verify` must not read the absent marker as a miss |
| **T7** | S1 leaves sections green, so sub-category headings (1.40) and the section heading (3.01) still fail after S1 | Expected; S1 is not judged on pairs that close in S2B |
| **T8** | Moving the hero out of `public/` breaks the build until `Hero.astro` and `BaseLayout.astro` stop referencing `/images/hero.webp` | 1.4–1.6 are one commit |
| **T9** | Both pages stay duplicated (design D11) | 3.6 edits both; the S2B diff must be compared between the two files |
| **T10** | Build time and 129 encoded images; `sharp` is only an optional dependency of `astro` today | P1 declaration in 2.6; build cost stated in the S2A PR body |
| **T11** | `tabular-nums` coverage is unproven (design D6) | §4.4 browser gate, with the Petrona 500 contingency |
| **T12** | 32 binary renames inflate S2A's file list ~7× | Reported in their own budget column and in the PR body (design D3) |

---

## 15. Explicit non-tasks

Not in this change, by proposal §5 and §6: no new locale, no new products, prices, categories, or copy, no new photographs, no backend/CMS/forms, no test framework or runner, no lint gate, no dark mode or theme switcher, no animation library, no analytics, no new pages or routes, no `README.md` / `AGENTS.md` / `faltan-imagenes.txt` refresh, no `astro.config.mjs` change (no `site`, no image service config), no HEIC conversion or cleanup, no `openspec/config.yaml` or `.codegraph/` staging, no scroll-spy or other new client-side JavaScript, no `@fontsource` self-hosting (recorded as the upgrade path only if the swap reflow proves visible).
