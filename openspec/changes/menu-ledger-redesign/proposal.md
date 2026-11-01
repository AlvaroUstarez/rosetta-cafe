# Proposal: menu-ledger-redesign

**Change**: `menu-ledger-redesign`
**Phase**: propose
**Status**: Implemented — recorded retroactively against the working tree
**Date**: 2026-10-24
**Brief (verbatim, ES)**: *"Con los skills de diseño y web guidelines rediseña todo, el diseño debe ser profesional, minimalista y elegante."*

---

## 0. How to read this document

This change does not plan future work. The redesign described here is **already implemented in the working tree** and verified against the built output. The proposal, design, and tasks were written after the fact so the repository carries an accurate record and the canonical specs can be reconciled when this change is archived.

Every number marked **[measured]** was read from the working tree or from `dist/` while writing this document. Where the implementation departs from a canonical requirement, the delta spec records the departure rather than hiding it.

---

## 1. Summary

Redesign the Rosetta Café menu as **a printed price list on paper**, not a grid of cards.

The page stops being a warm-cream product catalogue with terracotta accents and Playfair Display — a combination the `frontend-design` skill flags as a recognizable generated-design default — and becomes a single ledger: hairline rules, a serif name, a right-aligned price column on `tabular-nums`, and a muted description. Photography survives as a square thumbnail column that appears per sub-category group only when that group actually has a photograph. Everything decorative is removed: no card containers, no radii, no shadows, no gradients, no entrance animation.

Two structural consequences follow. The per-section background blocks are abolished, so section identity is carried by a rule and a label instead of a coloured rectangle. And the price column, the most characteristic graphic object a menu owns, is aligned for the first time.

---

## 2. Why

### 2.1 The shipped design was a default, not a decision

The previous direction (`menu-redesign`, Direction C) was defensible on evidence but landed on the exact cluster that reads as machine-generated: cream field, terracotta accent, a display serif over a neutral sans, rounded cards with soft shadows, and a uniform hover lift. None of those choices is wrong in isolation; together they are the path of least resistance, and they made a café with 31 real photographs look like a template.

### 2.2 Cards fought the content

A menu is a **list**, and the data is a list: 94 products, 31 with photographs, 63 without. The card grid forced every product into the same rectangular cell, which meant:

- A fixed image box cropped each photograph to the same shape, discarding composition.
- 63 imageless products needed a decorative substitute, which is how the gradient tiles and then the glaze tiles existed at all — inventing visual weight for products that simply have no photo yet.
- Equal-height cells made description length a layout constraint instead of a text property.

### 2.3 The money column was never aligned

No `tabular-nums` existed anywhere in the stylesheet, and prices were hand-concatenated as `$ 3300`. On a price list, that is the one alignment that matters.

---

## 3. What changes

**Palette and type**

- One token set replaces the four coexisting colour systems: `--paper #FBFAF8`, `--ink #17130F`, `--ink-muted #6A635B`, `--rule #E3DFD7`, `--wash #F2EFE9`, plus two brass tokens — `--brass #9A7634` for decorative rules only, and `--brass-ink #6F5320` for text.
- **Newsreader** (300/400/500) for display and **IBM Plex Sans** (400/500) for text and data, both loaded from Google Fonts with explicit fallback stacks and preconnect.
- A real type scale: eleven steps on `clamp()` for the two display sizes, plus `--measure`/`--measure-tight` line-length tokens.

**The ledger**

- Products render as `<li>` rows inside a `<ul role="list">`: a square thumbnail column (4.5rem, 3.5rem at ≤480px), the name in the display serif, the price right-aligned in `tabular-nums`, and the description below in `--ink-muted`.
- The photo column is **per sub-category group**, not per row: a group shows thumbnails when at least one of its products has an image, and rows without one keep an empty cell so the text stays aligned. A group with no photos at all drops the column entirely.
- Prices format through `Intl.NumberFormat` with `currency: "ARS"`, `currencyDisplay: "narrowSymbol"`, `maximumFractionDigits: 0` → `$ 3.300` (ES) / `$3,300` (EN). Zero-price products read "Gratis" / "Free".

**Chrome**

- The hero becomes a masthead: "Rosetta" at display size, the kind label beneath it in brass ink, the tagline in muted serif, then a photograph band at 4:3 on mobile and 21:9 from 768px. It no longer claims the full viewport.
- The sticky nav sits on solid paper with a hairline bottom border; the active section is marked by a brass underline driven by an `IntersectionObserver` scroll-spy that sets `aria-current`. Below 1023px the link list scrolls horizontally and fades at its right edge.
- The footer moves from a dark brown ground to `--wash`, in three columns from 768px, with 44px social touch targets and the location resolved from i18n.

**Accessibility and head**

- Skip link to `#main`, `<main id="main" tabindex="-1">`, localized nav and language-switch labels, `color-scheme: light`.
- Document head gains `meta description`, Open Graph and Twitter tags (hero photograph as `og:image`), `hreflang` alternates, `theme-color #FBFAF8`, and font preconnect.

**Removed**

- `src/components/ProductCell.astro` and `src/data/category-visual.ts`.
- The `listSubCategories` field on `MenuCategory` and its two entries.
- The dead `sectionAccent` prop, the duplicated nav CSS block, and the duplicated "Pet Friendly" heading (an `<h2>` wrapping an `<h3>` of the same title).

---

## 4. Non-goals

- **No content change.** 94 products, their prices, categories, sub-categories, and the `protocolo` notice are untouched. No new copy beyond the UI strings listed in §5.
- **No new locale.** ES and EN only; locale stays threaded manually as a prop, `es` stays default with no prefix.
- **No backend, CMS, API, or server rendering.**
- **No test framework.** `openspec/config.yaml` declares `runner: none`; none is added.
- **No lint gate.** Biome's native binary fails on this machine with `-1073741510` (`0xC0000135`, missing DLL). That exit code is an environment fault, never a finding. Formatting is manual per `biome.json`: 2-space indent, LF, double quotes.
- **No dark mode, theme switcher, animation library, or analytics.**
- **No social URLs.** The three footer links remain `href="#"` placeholders; wiring them is a content decision, not a design one.
- **No new pages or routes.** Two pages, same URLs, same anchors.

---

## 5. Scope

### In scope (all implemented)

1. Design tokens — palette, type scale, spacing, measures, container widths.
2. Ledger rows, sub-category grouping, and the per-group photo column rule.
3. Price formatting through `Intl`.
4. Hero masthead, sticky nav with scroll-spy, light footer.
5. Document head metadata and font loading.
6. i18n keys: `a11y.skip`, `hero.kind`, `nav.label`, `lang.en`, `lang.es`, plus the already-present `meta.*` and `footer.*`.
7. Deletion of the two dead modules and the dead fields.

### Out of scope

1. New photographs or any content acquisition.
2. Refreshing `faltan-imagenes.txt`.
3. Repo hygiene unrelated to the change — notably the untracked `.codegraph/`, the skill-registry migration under `.agents/`, and `opencode.json` / `skills-lock.json`.
4. Chained-PR slicing. This change is recorded as one working-tree state; §7 explains why the 400-line budget is exceeded.

---

## 6. Impact on existing specs

| Spec | Requirement | Delta | Driver |
| --- | --- | --- | --- |
| `product-menu` | Product Cards | **MODIFIED → Product Ledger Rows.** Cards, gradient fallback, hover lift, and `<img>`-only rendering are replaced by ledger rows, `astro:assets` images, and an empty cell for imageless products. | Ledger |
| `product-menu` | Responsive Product Grid | **MODIFIED → Ledger Row Layout.** 1/2/3-column grid with equal cell height is replaced by one column of full-width rows at every breakpoint. | Ledger |
| `product-menu` | Typed Menu Data | **MODIFIED.** `category-visual.ts` / `categoryGradients` no longer exist; `listSubCategories` is removed; product count corrected from ~88 to 94. | Cleanup |
| `product-menu` | Section Visual Identity | **MODIFIED.** Alternating or accented section backgrounds are abolished; identity is a top hairline rule plus the section label. | Ledger |
| `product-menu` | Sub-Category Dividers | **MODIFIED.** `<h3>` dividers persist; the per-group photo-column rule is added, and the "flat grid" scenario is replaced. | Ledger |
| `product-menu` | Sticky Nav Section Navigation | **MODIFIED.** Unchanged behaviour, plus an optional `aria-current` scroll-spy that MUST remain progressive enhancement. | Chrome |
| `homepage-layout` | Warm Color Palette | **MODIFIED → Paper and Ink Palette.** New token names and values; warm-neutral paper field retained, brass replaces terracotta as the accent. | Ledger |
| `homepage-layout` | Typography | **MODIFIED.** Playfair Display / Inter → Newsreader / IBM Plex Sans, with explicit fallback stacks and Google Fonts loading retained. | Ledger |
| `homepage-layout` | Hero Section Branding | **MODIFIED.** The hero becomes a masthead and no longer occupies the full viewport height; the photograph is a 4:3 → 21:9 band. | Chrome |
| `homepage-layout` | Institutional Footer | **MODIFIED.** Light `--wash` ground replaces the dark brown one; three columns from 768px; social links keep 44px targets. | Chrome |
| `homepage-layout` | Language Switcher in Section Navigation | **MODIFIED.** The nav renders a single link to the *other* locale, labelled by `lang.*` and carrying `hreflang`/`lang`, instead of two links with the active one dimmed. | Chrome |
| `homepage-layout` | *new* — Document Head Metadata | **ADDED.** Description, Open Graph, Twitter, `hreflang`, `theme-color`, `color-scheme`. | Head |
| `i18n` | UI Translation Files | **MODIFIED.** Five keys added (`a11y.skip`, `hero.kind`, `nav.label`, `lang.en`, `lang.es`); key parity retained. | i18n |
| `i18n` | *new* — Locale-Aware Price Formatting | **ADDED.** `formatPrice` owns currency formatting; components MUST NOT hand-concatenate prices. | Ledger |

### Destructive deltas (archive-time warning, per `openspec/config.yaml`)

Three requirements lose capability rather than gain it, and archiving will remove that capability from the canonical spec:

1. **Responsive Product Grid** — the 2- and 3-column desktop layouts disappear.
2. **Product Cards** — the gradient fallback and the hover effect disappear; `image = ""` now renders nothing.
3. **Warm Color Palette** — the token names `--color-primary`, `--color-secondary`, `--color-bg`, `--color-surface`, `--color-text`, `--color-border` are gone.

---

## 7. Delivery and review budget

**This change exceeds the 400-line review budget.** The working tree is +665 / −980 across 20 files **[measured]**, of which ~900 deletions are the deleted card component, the deleted gradient module, and the rewritten stylesheet.

Two options exist and neither was exercised: split into slices, or record it as one `size:exception`. The work was performed as a single continuous redesign because the palette, the type pairing, and the row structure are one decision — a slice that changes tokens without the row structure ships a page with the old layout wearing new colours, which is not reviewable as a design. This is recorded as a known deviation, not a recommendation.

Slices that would have worked, for the record:

1. Tokens and type only (old layout, new palette).
2. Ledger rows plus the deletion of `ProductCell` and `category-visual`.
3. Chrome: hero, nav, footer, head.

---

## 8. Risks

| # | Risk | Status |
| --- | --- | --- |
| R1 | **No visual regression exists.** Nothing mechanically proves the page still looks right; verification is types, build, DOM assertions, and manual screenshots. | Accepted limit of this project. |
| R2 | **Spec drift was invisible until now.** Three canonical requirements described code that no longer existed (`category-visual.ts`), and nothing caught it. | This change reconciles them; the delta set in §6 is the correction. |
| R3 | **63 of 94 products have no photograph.** The ledger shows no thumbnail for them, which is honest but leaves most of the menu text-only. | Accepted; a photo is a content task. |
| R4 | **The 400-line budget was exceeded without a recorded exception.** | Recorded here explicitly (§7). |
| R5 | **Three social links are `href="#"`.** | Out of scope; named in §4. |

---

## 9. Verification

- `npx astro check` → **0 errors, 0 warnings** **[measured]**.
- `npm run build` → **2 pages** (`dist/index.html`, `dist/en/index.html`) **[measured]**.
- Built output asserted: 94 rows, 32 `<img>` all carrying `width` and `height`, 31 thumbnails plus 36 empty cells, 4 zero-price products reading "Gratis"/"Free", one `<h1>`, ten `<h2>`, twelve `<h3>`, no `glaze` or `section-accent` leftovers **[measured]**.
- Layout measured in the browser via the DevTools protocol at 1264×705: masthead 825px, photograph band 490px, 94 rows at 86–149px, nav background `rgb(251, 250, 248)` with `backdrop-filter: none`, price `font-variant-numeric: tabular-nums` **[measured]**.
- Hero fold behaviour recorded honestly: at 1280×800 the masthead is 825px, so the menu begins just below the fold; at 1440×900 it clears it. See `design.md` §6.1.
- Contrast asserted numerically: `--ink-muted` on `--paper` **5.5:1**, `--brass-ink` on `--paper` **6.8:1**, `--ink-muted` on `--wash` **5.05:1**.
- Visual check via headless Chrome at 1280px and at a true 375px viewport.
- No tests. No Biome gate.

---

## 10. Success criteria

- [x] One colour source of truth; `sectionAccent` and its call sites are gone.
- [x] Products render as ledger rows, not cards: no radius, shadow, background container, or hover lift.
- [x] Prices are right-aligned on `tabular-nums` and formatted per locale.
- [x] The photo column appears per group only when that group has a photograph.
- [x] 94 products, prices, categories, and the protocolo notice are unchanged.
- [x] Section identity is a rule plus a label; no section background blocks remain.
- [x] Both locales build with matching i18n key sets.
- [x] Document head carries description, OG/Twitter, `hreflang`, and `theme-color`.
- [x] `npx astro check` 0 errors; `npm run build` 2 pages.
- [ ] Every review under 400 changed lines — **not met**; see §7.

---

## 11. Relationship to `menu-redesign`

`openspec/changes/menu-redesign/` describes Direction C: green accent, glaze tiles, `astro:assets` migration, Playfair/Inter replacement. **It was not implemented and is superseded by this change.** It is intentionally left in place as the record of the exploration and of the measured evidence it produced (contrast failures, photography statistics, structural debt), which this change relies on and does not repeat.

That change's `proposal.md` §2 remains accurate as analysis. Its §4 "What changes" no longer describes the code.
