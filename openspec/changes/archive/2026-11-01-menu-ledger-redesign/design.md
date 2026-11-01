# Design: menu-ledger-redesign

**Change**: `menu-ledger-redesign`
**Phase**: design
**Status**: Implemented — decisions recorded against the working tree
**Date**: 2026-10-24
**Inputs**: `proposal.md` (§3 what changes, §4 non-goals, §6 delta set)

No sequence diagrams appear in this document: the site has no runtime flow to diagram. It is a static build with one client-side enhancement (the nav scroll-spy), documented in §7.

---

## 1. The governing idea

> A menu is a printed price list. Paper, ink, rules, and an aligned money column.

Every decision below follows from that sentence. Where a choice could not be justified by it, it was removed rather than defended — which is why the page has no cards, no shadows, no gradients, and no entrance animation.

The corollary that matters for review: **this design is subtractive**. The diff is −980 lines against +665, and the deletions are the design, not cleanup around it.

---

## 2. Palette

### 2.1 Tokens

```css
--paper:      #fbfaf8;  /* page field */
--ink:        #17130f;  /* primary text */
--ink-muted:  #6a635b;  /* descriptions, labels */
--rule:       #e3dfd7;  /* hairlines */
--wash:       #f2efe9;  /* footer ground, thumbnail placeholder, protocolo note */
--brass:      #9a7634;  /* decorative rules only — never small text */
--brass-ink:  #6f5320;  /* brass as text */
```

### 2.2 Rationale

- **Two brass tokens, not one.** `#9A7634` on paper is **3.1:1** — fine for a 1px rule or a 2px note border, illegal for a 0.8125rem label. Splitting the hue into a decorative token and a text token (`#6F5320`, **6.8:1**) removes the whole class of bug where a colour is "the accent" and therefore gets used everywhere, including where it cannot legally go.
- **Paper is warm-neutral, not cream.** `#FBFAF8` sits a few units off white. The previous `#F5EDE4`-family cream was the strongest contributor to the template look; the warmth now comes from the photography and the brass, not from tinting the whole page.
- **`--wash` is a real step, not an alpha.** `rgba(255,255,255,.4)` over a saturated ground produced a grey-green that appeared nowhere else in the system. A flat token cannot do that.
- **Contrast, measured** (`--paper` unless noted): `--ink` 16.4:1, `--ink-muted` **5.5:1**, `--brass-ink` **6.8:1**, `--ink-muted` on `--wash` **5.05:1**. Every pair used for text clears AA; no pair relies on the 0.01 headroom the previous palette had.

### 2.3 Rejected

- **Keeping the brand green as an accent.** The green was only ever evidenced by two commits and a monochrome favicon, and the photography measurement in `menu-redesign` showed it in 3.7% of pixels. A decorative accent that appears in neither the product nor the room is a guess. Brass comes from the coffee itself.
- **Terracotta.** Load-bearing in the generated-design cluster being escaped.

---

## 3. Typography

### 3.1 Pairing

| Role | Family | Weights | Fallback stack |
| --- | --- | --- | --- |
| Display | Newsreader | 300, 400, 500 | `"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif` |
| Text and data | IBM Plex Sans | 400, 500 | `"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif` |

Loaded from Google Fonts via one `<link>` in `BaseLayout.astro`, with `preconnect` to both `fonts.googleapis.com` and `fonts.gstatic.com`, and `display=swap`. Newsreader is requested with its optical-size axis (`opsz@6..72`) so the large wordmark gets the display cut and the row names get the text cut.

### 3.2 Rationale

- **Newsreader, not Playfair Display.** Playfair is the default "elegant serif" of generated design: extreme contrast, high-contrast hairlines, and a face that is already a cliché in this exact context. Newsreader is a text-first serif with a real optical-size axis, which is what a price list needs — the same family reads correctly at 6.5rem and at 1.1875rem.
- **IBM Plex Sans, not Inter.** Inter is the other default. Plex has slightly narrower figures and a more utilitarian, printed feel that matches the ledger; it also pairs without competing because its personality is low.
- **Two families, clearly distinct roles.** No third family, no mono, no condensed variant.

### 3.3 Scale

Twelve steps, declared once: `--text-2xs` 0.75rem through `--text-xl` 1.375rem as fixed values, then `--text-tagline: clamp(1.25rem, 2.6vw, 1.75rem)` for the hero tagline, `--text-2xl: clamp(1.75rem, 3.2vw, 2.25rem)` for section titles, and `--text-3xl: clamp(3rem, 10vw, 6.5rem)` for the masthead. Three line-height tokens (`0.98` display, `1.3` snug, `1.6` body) and two measures (`62ch`, `46ch`).

Fixed sizes below `xl` are deliberate: at small sizes a fluid scale adds rounding noise for no benefit. Every `font-size` in every component resolves to one of these tokens — no component declares a literal size or an inline `clamp()`.

---

## 4. The ledger row

### 4.1 Geometry

```
[thumb]  Name of the product                    $ 3.300
         Description in muted text, max 46ch
──────────────────────────────────────────────────────
```

- Row is a `<li>` with `padding-block: var(--space-sm)` and a 1px `--rule` bottom border.
- The list is a `<ul role="list">` with a top border, so the first row has a rule above it.
- Name uses `--font-display` at `--text-lg`; price uses `--font-text` at `--text-base` weight 500 with `font-variant-numeric: tabular-nums` and `white-space: nowrap`.
- Name and price sit in a `grid-template-columns: minmax(0, 1fr) auto` with `align-items: baseline`, so the price baseline is tied to the name's first line regardless of description length.
- Description is capped at `--measure-tight` (46ch) and rendered only when non-empty.

**Measured** at 1264×705 with all 94 rows rendered: row heights range 86–149px, with 105px typical; every product in `menu.ts` carries a non-empty description, so the description line is always present. The thumbnail column resolves to `72px 896px`, confirming `--thumb` at 4.5rem against the 1080px container.

### 4.2 Why rows instead of cards

| Property | Card grid | Ledger row |
| --- | --- | --- |
| 63 imageless products | Need a decorative substitute | Need nothing; the cell is empty or absent |
| Photograph composition | Cropped to a fixed box | Square thumbnail, consistent crop, one aspect |
| Description length | Drives cell height | Drives nothing |
| Price alignment | Per-cell, ragged | One column, `tabular-nums` |
| Screen budget | 3 products per row band, each holding a 180px image | 1 product per ~105px row **[measured]** |

The decisive one is the first: the entire gradient-then-glaze device existed only because a card cannot be empty. A row can.

### 4.3 The photo column rule

The column is decided **per sub-category group**, in `MenuSection.astro`:

```ts
const plated = group.items.some((product) => product.image);
```

- `plated === true` → every row in that group reserves the column; rows without a photo render `<div class="menu-item__thumb menu-item__thumb--empty" aria-hidden="true">`.
- `plated === false` → no row in that group renders a thumbnail cell at all, and the text takes the full width.

Rationale: a column that appears on some rows and not others breaks the left edge of the text, which is the one alignment a ledger cannot lose. Reserving the cell keeps the text column continuous. Dropping the column for photo-less groups avoids 14 empty squares in `sin-cafe` for no reason.

Thumbnail: `aspect-ratio: 1`, `--thumb` 4.5rem, 3.5rem at ≤480px. Rendered through `astro:assets` `<Image>` with `widths={[72, 144, 216]}`, `sizes="(max-width: 480px) 56px, 72px"`, `format="webp"`, `quality={80}`, `loading="lazy"`.

### 4.4 `alt=""`

Every product thumbnail renders `alt=""`. The photograph is decorative *in this context*: the product name is adjacent, visible, and the row is a list item, not a figure. A descriptive alt would repeat the name to a screen reader. Astro emits this as a bare `alt` attribute, which is semantically empty and valid.

---

## 5. Price formatting

`src/i18n/index.ts`:

```ts
export function formatPrice(price: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "es" ? "es-AR" : "en-US", {
    style: "currency",
    currency: "ARS",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(price);
}
```

- `es-AR` → `$ 3.300`; `en-US` with `ARS` and `narrowSymbol` → `$3,300`. Same currency, correct separators per locale.
- `maximumFractionDigits: 0` because menu prices have no cents.
- Zero prices bypass the formatter and render `Gratis` / `Free`, because `$ 0` reads like a mistake on a menu.

The helper lives in `i18n` rather than in the component because it is locale-dependent behaviour, and because a second call site must not re-derive it.

---

## 6. Chrome

### 6.1 Hero masthead

- `<header class="masthead">`, not a full-viewport band. Padding `clamp(2.5rem, 7vw, 5rem)` top, no bottom.
- `<h1>` = "Rosetta" at `--text-3xl` weight 300, letter-spacing −0.03em, followed by a block `<span>` with `hero.kind` ("Café de especialidad") in `--brass-ink` at `--text-sm` with 0.06em tracking.
- Tagline below at `--text-tagline` (`clamp(1.25rem, 2.6vw, 1.75rem)`) weight 300, muted, capped at 26ch.
- Photograph band: `aspect-ratio: 4 / 3` on mobile, `21 / 9` from 768px, `--wash` ground, `priority` (the LCP element), `widths={[480, 720, 1080, 1440]}`, `format="webp"`, `quality={82}`.

Rationale for dropping `100dvh`: the old hero was locked to the viewport regardless of its content, which meant the photograph was cropped to whatever the screen happened to be. Height now follows content, so the band keeps a declared aspect ratio at every viewport instead of inheriting the screen's.

**Measured, not claimed**: at 1280×800 the masthead is ~825px tall — the text block (~335px) plus the 21:9 band (~490px at the 1144px container width). It therefore still fills the first screen on a short laptop, and the menu begins just below the fold. At 1440×900 it clears the fold. Shortening it further would require capping the band's height, which trades the panoramic frame for a visible first section; that tradeoff was not taken.

Rationale for 4:3 → 21:9: the source is a portrait 3:4 photograph. A wide band crops it, which is acceptable for a decorative band — but only once the band is no longer the only thing on screen. On mobile the 4:3 frame keeps most of the subject.

### 6.2 Sticky nav

- `position: sticky; top: 0`, `background: var(--paper)` — **solid, not translucent.** A `backdrop-filter: blur()` version was built and discarded: over the hero it produced a dirty grey ghost, and the transparency bought nothing.
- 1px `--rule` bottom border. Links at `--text-sm` in `--ink-muted`, `--ink` on hover.
- Active section: `aria-current="true"` → `--ink` text plus `border-bottom-color: var(--brass)`.
- Below 1023px the link list scrolls horizontally with `scrollbar-width: none` and a right-edge `mask-image` fade over 2.5rem, so the cut reads as "more to the right" rather than as truncation.
- The language switch is a single right-aligned link, separated by a `--rule` left border, showing the *other* locale's code with `hreflang`, `lang`, and an `aria-label` from `lang.en`/`lang.es`.

### 6.3 Footer

- Ground `--wash` with a `--rule` top border. The previous dark brown ground was the heaviest element on a page whose content is paper; inverting it made the footer compete with the menu.
- Three columns from 768px: location, hours, social. Column labels are `<h2>` at `--text-xs` in `--ink-muted`; values at `--text-md` in `--ink` with `white-space: pre-line` so the i18n strings carry their own line breaks.
- Social links are 44×44px grids with 20px stroke icons, muted, `--ink` on hover.
- Copyright row separated by a `--rule` border, `--text-2xs`, muted.

---

## 7. The one client-side behaviour

`SectionNav.astro` carries a single `<script>`: an `IntersectionObserver` over the section elements, `rootMargin: "-45% 0px -50% 0px"`, threshold 0. It marks the first intersecting section's link with `aria-current="true"` and clears the rest, guarded by an `active` id so the DOM is not touched on every callback.

Contract:

- **Progressive enhancement only.** The nav is plain anchors; with JavaScript disabled, navigation and the no-JS fallback in the spec are unaffected.
- `aria-current="true"` (not `"page"`) because the link points at a region of the current page.
- No scroll listener, no `requestAnimationFrame` loop, no layout read on scroll.

---

## 8. Motion policy

**No entrance animation.** Elements do not fade, slide, or scale in on load or on scroll. The only transitions are `color`/`border-color` at 0.18s with `--ease: cubic-bezier(0.2, 0, 0, 1)`, on nav links, social links, and the language switch.

Rationale: a price list is a document. Animating its arrival makes it slower to read and reads as a landing page. "Elegant" here means still.

`prefers-reduced-motion` is respected in the global reset for the remaining colour transitions.

---

## 9. Accessibility

- Skip link (`#main`) as the first focusable element, translated via `a11y.skip`.
- `<main id="main" tabindex="-1">` so the skip target is focusable.
- `<nav aria-label>` from `nav.label`; `<section aria-labelledby>` pointing at its `<h2>`.
- Language link carries `hreflang`, `lang`, and a localized `aria-label` — the visible text is a bare code ("EN"), which is not a usable link name on its own.
- `color-scheme: light` declared, so form controls and scrollbars match the paper field.
- Every text pair clears WCAG AA numerically (§2.2).
- Touch targets: 44×44px for social links; nav links are 0.95rem block padding.

---

## 10. Data and type changes

- `src/data/menu.ts`: `MenuCategory` loses `listSubCategories` (it was rendered nowhere after the card grid was removed) and the two entries that carried it.
- `src/data/category-visual.ts` is deleted; `categoryGradients` had no remaining consumer.
- `Product.image` keeps its `string` type but now holds an **imported image module** for products with a photograph, and `""` for products without. `astro:assets` `<Image src={product.image}>` accepts both the module and the empty branch is guarded by `product.image &&`.
- `MenuRow` (`ProductListItem.astro`) replaces `ProductCell.astro`.

---

## 11. Known deviations recorded, not fixed

| # | Deviation | Why it stands |
| --- | --- | --- |
| D1 | The `<h1>` reads "Rosetta" with "Café de especialidad" as a nested `<span>`, so its text content is "Rosetta Café de especialidad" — the canonical requirement says "Rosetta Café de Especialidad". | Case-only difference in the kind label. The delta spec records the new structure. |
| D2 | The nav renders **one** language link (to the other locale), not two with the active one dimmed. | A link to the page you are already on is noise. The delta spec records the change. |
| D3 | Three footer social links are `href="#"`. | No real URLs exist. Out of scope. |
| D4 | The change exceeds the 400-line review budget as one unit. | Recorded in `proposal.md` §7. |
