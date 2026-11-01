# Proposal: diseno-3-0

**Change**: `diseno-3-0`
**Phase**: propose
**Status**: Implemented — code verified, spec deltas pending archive
**Date**: 2026-11-01
**Branch**: `redesign/diseno-3.0` (base `508c08e`)
**Reference (visual only)**: `boceto_editable_en_canva.html` — an HTML mock, never a source of code
**Brief (verbatim, ES)**: *"hagamos un rediseño con el ejemplo de del archivo boceto_editable_en_canva.html first-movile"*
**Second brief (verbatim, ES)**: *"decide tu, el ejemplo es un ejemplo visual, seguimos con la estructura con la que venimos travajando, sin JS, agrega y comina colores terracota y verde #86A479, te dejo también el logo en una imágen en la raiz.No pongas las descripciónes que no tenemos, no pongas una foto-baner por categoría, toma tu las desiciónes de diseño con lo que sabes."*

---

## 0. How to read this document

Section 1 is what changed. Section 3 is the decisions I took under the delegated authority, each with the reason it beat the alternative. Section 4 is what I deliberately did not take from the mock, because taking it would have required inventing content or reversing the ledger grammar we closed one commit earlier.

---

## 1. Summary

A third design iteration over the ledger menu. It keeps every structural decision of `menu-ledger-redesign` — sticky nav, stacked sections, hairline ledger rows, no cards, no JavaScript — and changes three things: the accent palette, the masthead, and the shape of the product thumbnails.

- **Palette.** Brass is retired. Terracotta and the brand green `#86a479` replace it, each split into a decorative value and a text-safe value.
- **Masthead.** The brand mark, extracted from the café's profile picture, sits above the wordmark. The block is centred on mobile and left-aligned from 768px up.
- **Rows.** Thumbnails become circles; prices take the terracotta text value.

Nothing else moves. There is no new JavaScript, no new content, no new photography, and no change to the data layer.

## 2. Why

The site read as correct but colourless: one brass accent doing all the work, on a paper field, with the brand mark present only as a favicon. The café's identity is a green disc with a line-drawn rose, and the palette had no trace of it.

The mock supplied the missing warmth — terracotta for money, a second accent for structure — and the mark. It also supplied a card grid and tab navigation, which we are not taking (Section 4).

## 3. What changes

### 3.1 Palette

`--brass` and `--brass-ink` are deleted. Five tokens replace them:

| Token | Value | Role | On paper |
|---|---|---|---|
| `--terracotta` | `#b4553a` | decorative | 4.68:1 |
| `--terracotta-ink` | `#a04934` | text | 5.76:1 |
| `--green` | `#86a479` | decorative | 2.65:1 |
| `--green-ink` | `#4a6b3f` | text | 5.81:1 |

`--paper`, `--ink`, `--ink-muted`, `--rule` and `--wash` are unchanged.

Role assignment is fixed by the delta:

- **Terracotta carries money and position** — prices, the active nav marker, text selection, the focus ring.
- **Green carries the mark and the secondary headings** — the kind label under the wordmark, sub-category `<h3>`, the protocolo note's left border, the language switcher hover.

The split is not cosmetic. `#86a479` measures 2.65:1 on paper and 2.41:1 on wash: it cannot carry text. Keeping one green token and using it everywhere would have shipped a contrast failure, so the brand hue is preserved exactly where it is decorative and darkened only where it must be read.

### 3.2 Masthead

`Hero.astro` gains a circular mark above the wordmark: 5.5rem below 768px, 6rem above. The text block is centred on mobile — the way a sign sits over a door — and returns to the left margin at 768px, where the existing `--container-wide` column already governs.

The mark is rendered through `astro:assets` from `src/assets/logo-mark.webp`, masked to a circle in CSS, and carries `alt=""`: the wordmark next to it already names the brand, so a second announcement would be noise.

### 3.3 Product rows

`.menu-item__thumb` gets `border-radius: 50%`. `.menu-item__price` resolves to `--terracotta-ink`. The two-column grid, the baseline alignment, `tabular-nums`, the no-wrap rule and the group-level photo column are untouched.

## 4. Non-goals

Each item below appears in the mock and was rejected. The reason matters more than the rejection.

- **Cards.** The mock is a grid of white rounded cards with shadows. The canonical spec forbids exactly that: a row MUST NOT carry background, radius or shadow. Adopting the mock wholesale would reverse the redesign closed in `508c08e`. Not taken.
- **Tab navigation.** The mock shows one category at a time behind JS tabs. We keep stacked sections and anchors. Not taken.
- **Great Vibes.** The mock's script face would be a third family, and the spec caps the site at two. Newsreader at display scale already carries the wordmark. Not taken.
- **Rose accent.** The mock's `rose-500` is replaced by terracotta, which is warmer and on-brand. Not taken.
- **Allergen line.** No allergen field exists in `menu.ts`, and for 94 products it is information the café must sign off on, not something to infer. Not taken.
- **Per-category photo banner.** We have 31 product photographs and zero category photographs. Not taken.
- **European price format.** Prices stay ARS through `formatPrice`. Not taken.

Also out of scope: any change to `src/data/menu.ts`, the i18n system, the locale set, the footer, the sticky nav's structure, and the single existing `IntersectionObserver` script.

## 5. Scope

### In scope (all implemented)

- `src/styles/global.css` — token block, `::selection`, `:focus-visible`.
- `src/components/Hero.astro` — mark, mobile-first masthead alignment.
- `src/components/ProductListItem.astro` — circular thumbnail, terracotta price.
- `src/components/SectionNav.astro` — active underline, language hover.
- `src/components/MenuSection.astro` — sub-category heading colour, protocolo border.
- `src/assets/logo-mark.webp` — new asset.

### Out of scope

- Everything listed in Section 4.
- `openspec/specs/i18n/spec.md` — no delta; no i18n behaviour changed.

## 6. Impact on existing specs

| Spec | Requirement | Kind |
|---|---|---|
| `homepage-layout` | `Paper and Ink Palette` | MODIFIED — token set replaced |
| `homepage-layout` | `Hero Section Branding` | MODIFIED — mark added, alignment specified |
| `product-menu` | `Product Ledger Rows` | MODIFIED — thumbnail shape, price colour |
| `product-menu` | `Section Visual Identity` | MODIFIED — accent roles named |
| `product-menu` | `Sticky Nav Section Navigation` | MODIFIED — active marker colour named |

No requirement is removed. No requirement is added.

### Destructive deltas (archive-time warning, per `openspec/config.yaml`)

`Paper and Ink Palette` deletes `--brass` and `--brass-ink` by name. After archiving, any code or documentation still referring to those tokens is dead. `git grep -n "brass"` must return nothing outside the archived change itself.

## 7. Delivery and review budget

Budget is 400 changed lines. This iteration measures 71 insertions and 11 deletions across five source files, plus one new binary asset and the OpenSpec documents. The source change is **82 lines** — well inside budget. Single branch, no chaining.

## 8. Risks

1. **The logo is a screenshot, not an asset.** The source is a 720×1600 JPEG of an Instagram profile, with status bar, IG chrome and a café photo below. The mark was cropped to 480×480 from a box whose four corners all sample `#8aa97d` — fully inside the green disc — then resized to 512×512. At the 96px it is displayed at, it is clean. At print resolution, or on a retina hero, it is not: the disc edge and the rose are interpolated from a lossy JPEG. **A real PNG or SVG is needed before the mark grows.** Recorded, not fixed.
2. **Green as a text accent is a new failure mode.** `--green` and `--green-ink` differ only by lightness, and the wrong one is invisible to a reviewer who is not measuring. The delta names the permitted role for each; the numbers are in `design.md` §2.
3. **The wordmark inside the screenshot was not used.** The script "Rosetta" printed inside the profile picture is unreadable below ~120px and cannot be recoloured or typeset. The masthead keeps a text wordmark in Newsreader. This is a deliberate divergence from the mark's own lettering.

## 9. Verification

- `npx astro check` → 0 errors, 0 warnings, 0 hints.
- `npm run build` → 2 pages, 133 assets (was 130; the mark contributes its renditions).
- `dist/index.html` → 33 `<img>` elements, the mark present, `masthead__mark` ordered before `masthead__name`.
- `git grep -n "brass" -- src/` → no matches.
- Contrast ratios computed with the WCAG relative-luminance formula, not eyeballed.

## 10. Success criteria

1. Every colour in the built CSS resolves to a token; no literal colour exists outside the `:root` block.
2. No text below the large-text threshold renders in `--green` or `--terracotta`.
3. The masthead shows mark, wordmark, kind label and tagline, centred below 768px and left-aligned above.
4. Product thumbnails are circles; prices are terracotta, right-aligned, `tabular-nums`, no wrap.
5. The page still works with JavaScript disabled, and the diff adds no `<script>`.
