# Tasks: menu-ledger-redesign

**Change**: `menu-ledger-redesign`
**Phase**: tasks
**Status**: Complete — all tasks verified against the built output
**Date**: 2026-10-24
**Inputs**: `proposal.md` (§3, §5, §6), `design.md` (§2–§10), `openspec/config.yaml` (`runner: none`, `apply.tdd: false`, `verify.build_command: npm run build`)

Every task below was executed in the working tree before this document was written. Each carries its **observed** evidence. Nothing here is a forecast.

**Review budget**: 400 changed lines (`openspec/config.yaml`). **Not met** — the change is +665 / −980 across 20 files. See `proposal.md` §7.

---

## 1. Foundations

### 1.1 Palette and tokens

- [x] 1.1.1 Replace the four coexisting colour systems with the seven-token set in `design.md` §2.1.
- [x] 1.1.2 Split the brass hue into `--brass` (decorative) and `--brass-ink` (text).
- [x] 1.1.3 Assert every text pair numerically: `--ink-muted`/paper 5.5:1, `--brass-ink`/paper 6.8:1, `--ink-muted`/wash 5.05:1.
- [x] 1.1.4 Add the type scale (12 steps), three line-height tokens, two measure tokens, container widths, and the `--thumb` token.

**Evidence**: `src/styles/global.css` lines 39–85. No `--color-*` token survives; `grep -c "section-accent" src/` → 0.

### 1.2 Typefaces

- [x] 1.2.1 Load Newsreader (300/400/500, `opsz@6..72`) and IBM Plex Sans (400/500) from Google Fonts in `BaseLayout.astro`.
- [x] 1.2.2 Declare explicit fallback stacks for both roles.
- [x] 1.2.3 Add `preconnect` to both Google Fonts hosts with `crossorigin` on `gstatic`.

**Evidence**: `src/layouts/BaseLayout.astro` lines 45–50; `--font-display` / `--font-text` at `global.css` 48–49.

### 1.3 Document head

- [x] 1.3.1 Add `meta description` from `meta.description`.
- [x] 1.3.2 Add Open Graph tags (`og:title`, `og:description`, `og:image`, `og:locale`) and `twitter:card`.
- [x] 1.3.3 Generate `og:image` through `getImage` at 1200px webp q82.
- [x] 1.3.4 Add `hreflang` alternates for `es`, `en`, and the current locale.
- [x] 1.3.5 Add `theme-color #FBFAF8` and `color-scheme: light`.

**Evidence**: `src/layouts/BaseLayout.astro` lines 20–44.

### 1.4 Accessibility shell

- [x] 1.4.1 Add a skip link as the first focusable element, translated via `a11y.skip`.
- [x] 1.4.2 Give both pages `<main id="main" tabindex="-1">`.
- [x] 1.4.3 Localize the nav label (`nav.label`) and the language link name (`lang.en` / `lang.es`).

**Evidence**: `BaseLayout.astro` 53; `SectionNav.astro` 17, 34.

---

## 2. The ledger

### 2.1 Row component

- [x] 2.1.1 Create `ProductListItem.astro` as `<li class="menu-item">` with `padding-block` and a `--rule` bottom border.
- [x] 2.1.2 Lay out name and price in a `minmax(0,1fr) auto` grid with `align-items: baseline`.
- [x] 2.1.3 Set `font-variant-numeric: tabular-nums` and `white-space: nowrap` on the price.
- [x] 2.1.4 Cap the description at `--measure-tight` and render it only when non-empty.
- [x] 2.1.5 Render thumbnails through `astro:assets` `<Image>` at `widths={[72,144,216]}`, `format="webp"`, `loading="lazy"`, `alt=""`.
- [x] 2.1.6 Render the empty-cell variant with `aria-hidden="true"` when the row has no photograph but its group does.

**Evidence**: `src/components/ProductListItem.astro` 25–52.

### 2.2 Grouping and the photo-column rule

- [x] 2.2.1 Compute `plated = group.items.some((product) => product.image)` per sub-category group.
- [x] 2.2.2 Pass `plated` to every row in the group so the text column stays continuous.
- [x] 2.2.3 Keep `<h3>` dividers per sub-category; drop the divider when the group has no title.
- [x] 2.2.4 Delete the duplicated "Pet Friendly" heading — the protocolo section now renders a single `<h2>` plus the note.

**Evidence**: `src/components/MenuSection.astro` 26–41, 60–79. Built output: 31 thumbnails + 36 empty cells, 12 `<h3>`.

### 2.3 Price formatting

- [x] 2.3.1 Add `formatPrice` to `src/i18n/index.ts` using `Intl.NumberFormat` with `es-AR` / `en-US`, `currency: "ARS"`, `narrowSymbol`, `maximumFractionDigits: 0`.
- [x] 2.3.2 Bypass the formatter for zero prices and render `Gratis` / `Free`.

**Evidence**: `src/i18n/index.ts` 24–33; built output shows `$ 3.300` (ES) and `$3,300` (EN), and 4 free products.

### 2.4 Deletions

- [x] 2.4.1 Delete `src/components/ProductCell.astro`.
- [x] 2.4.2 Delete `src/data/category-visual.ts`.
- [x] 2.4.3 Remove `listSubCategories` from `MenuCategory` and from its two entries in `menu.ts`.
- [x] 2.4.4 Remove the `sectionAccent` prop and its six call sites across both pages.
- [x] 2.4.5 Remove the duplicated nav CSS block from `global.css`.

**Evidence**: `git status` shows both files as `D`; no `glaze`, `categoryGradient`, or `section-accent` string survives in `src/`.

---

## 3. Chrome

### 3.1 Hero masthead

- [x] 3.1.1 Replace the full-viewport hero with a padded masthead (`clamp(2.5rem, 7vw, 5rem)` top, no bottom).
- [x] 3.1.2 Set the `<h1>` to "Rosetta" at `--text-3xl` weight 300 with a block kind label from `hero.kind` in `--brass-ink`.
- [x] 3.1.3 Add the tagline at `clamp(1.25rem, 2.6vw, 1.75rem)` weight 300, capped at 26ch.
- [x] 3.1.4 Render the photograph band at 4:3 (mobile) / 21:9 (≥768px) with `priority` and responsive `widths`.

**Evidence**: `src/components/Hero.astro` 16–36, 75–92.

### 3.2 Sticky nav

- [x] 3.2.1 Set the nav to solid `--paper` with a `--rule` bottom border; reject the `backdrop-filter` variant.
- [x] 3.2.2 Mark the active section with `aria-current="true"` → `--ink` text and a brass bottom border.
- [x] 3.2.3 Add the `IntersectionObserver` scroll-spy with `rootMargin: "-45% 0px -50% 0px"` and an `active`-id guard.
- [x] 3.2.4 Fade the right edge of the scrolling link list below 1023px with `mask-image`.
- [x] 3.2.5 Render a single link to the other locale with `hreflang`, `lang`, and a localized `aria-label`.

**Evidence**: `src/components/SectionNav.astro` 41–94, 97–188.

### 3.3 Footer

- [x] 3.3.1 Move the ground from dark brown to `--wash` with a `--rule` top border.
- [x] 3.3.2 Lay out three columns from 768px: location, hours, social.
- [x] 3.3.3 Resolve location and hours from i18n with `white-space: pre-line`.
- [x] 3.3.4 Keep 44×44px social touch targets.
- [x] 3.3.5 Replace the hardcoded `Vicente López 357` with the i18n address (`Balcarce 350`).

**Evidence**: `src/components/Footer.astro` 12–92, 94–161.

---

## 4. Documentation

- [x] 4.1 Update `AGENTS.md`: subcategory grouping, the ledger row, `image: ""` as a valid state, the design-system line, and the `.agents/skills/` location.
- [x] 4.2 Update `README.md`: 94 products, the current component list, the `src/assets` layout, 31 photographs.

**Evidence**: both files modified in the working tree.

---

## 5. Verification

- [x] 5.1 `npx astro check` → 0 errors, 0 warnings.
- [x] 5.2 `npm run build` → 2 pages.
- [x] 5.3 Assert the built DOM: 94 rows, 32 `<img>` all with `width`/`height`, 31 thumbnails, 36 empty cells, 4 free prices, 1 `<h1>`, 10 `<h2>`, 12 `<h3>`.
- [x] 5.4 Visual check at 1280px and at a true 375px viewport; verify the protocolo and footer anchors.
- [x] 5.4.1 Measure the rendered layout through the DevTools protocol: masthead 825px, band 490px, rows 86–149px, nav background opaque, `tabular-nums` active on prices. Recorded in `design.md` §4.1 and §6.1.
- [x] 5.5 Confirm no `glaze`, `section-accent`, or `categoryGradient` remnant in `src/`.
- [ ] 5.6 Every review under 400 changed lines — **not met**; recorded in `proposal.md` §7.

---

## 6. Open items

- [ ] 6.1 Wire the three footer social links to real URLs (needs the café's accounts).
- [x] 6.2 Reconcile `openspec/specs/product-menu/spec.md`, `homepage-layout` and `i18n` with this change's deltas — done by archiving this change. `i18n`'s `Language Switcher Mechanism` now defers its rendering contract to `homepage-layout`, which the delta had already changed.
- [ ] 6.3 Decide whether `openspec/changes/menu-redesign/` is archived as superseded or deleted. A `Superseded` banner was added to its `proposal.md` so its deltas are never applied on top of the reconciled specs.
