# Design: diseno-3-0

## 1. The governing idea

The ledger stays. What changes is that it now has two voices instead of one: a warm, monetary terracotta and the café's own green, and the café's mark at the top of the page instead of only in the browser tab.

The rule that keeps two accents from becoming decoration soup: **one accent owns money, the other owns identity.** Terracotta never labels a section. Green never prices a dish. When a new element needs colour, which of the two it takes is already answered.

## 2. Palette

### 2.1 Tokens

```css
--paper: #fbfaf8;
--ink: #17130f;
--ink-muted: #6a635b;
--rule: #e3dfd7;
--wash: #f2efe9;

--terracotta: #b4553a;      /* decorative */
--terracotta-ink: #a04934;  /* text */
--green: #86a479;           /* decorative */
--green-ink: #4a6b3f;       /* text */
```

### 2.2 Measured contrast

Computed with the WCAG 2.1 relative-luminance formula (`(L1 + 0.05) / (L2 + 0.05)`), not sampled visually.

| Pair | On `--paper` | On `--wash` | Verdict |
|---|---|---|---|
| `--terracotta` | 4.68:1 | 4.25:1 | decorative only |
| `--terracotta-ink` | 5.76:1 | 5.23:1 | AA text |
| `--green` | 2.65:1 | 2.41:1 | decorative only — fails AA |
| `--green-ink` | 5.81:1 | 5.28:1 | AA text |
| `--ink-muted` (reference) | 5.67:1 | 5.14:1 | AA text |
| white on `--green` | 2.76:1 | — | never for text |

`#86a479` is the value the owner named, and it is kept exactly — but only where it paints a surface. As a text colour it measures 2.65:1, which fails AA by a wide margin. Splitting the token is the only way to honour the brand value and the accessibility contract at once.

`--terracotta-ink` was chosen over the darker `#9c4a33` (5.85:1) and `#8f4531` (6.57:1) because 5.76:1 clears AA with headroom while staying visibly a terracotta and not a brown. `--green-ink` was chosen over `#527a46` (4.76:1) for the same reason: comfortable margin without drifting to olive.

### 2.3 Role assignment

| Element | Token | Why |
|---|---|---|
| Price | `--terracotta-ink` | money |
| Active nav link underline | `--terracotta` | position — decorative, under a 2px border |
| `::selection` background | `--terracotta` at 24% over paper | a wash, not a text colour |
| `:focus-visible` outline | `--terracotta-ink` | must be perceivable, so it takes the AA value |
| Hero kind label | `--green-ink` | identity |
| Sub-category `<h3>` | `--green-ink` | identity |
| Protocolo note left border | `--green` | decorative, 2px |
| Language switcher hover | `--green-ink` | identity |

Every one of these was a `--brass`/`--brass-ink` site before. The mapping was not one-to-one: the brass accent was a single idea, and terracotta and green are two, so each site was re-decided rather than renamed.

### 2.4 Rejected

- **Keeping brass alongside the two new accents.** Three accents on a paper field with two typefaces is a system without a hierarchy. Brass is retired, not demoted.
- **A single `--terracotta` and a single `--green`.** Ships a 2.65:1 text failure on the green.
- **`#86a479` darkened into a single "brand green" for both roles.** Then the mark's own green no longer matches the page's green, and the brand value the owner specified is gone.
- **The mock's `rose-500`.** Off-brand next to a green disc; terracotta is the warm relative that belongs in a coffee menu.

## 3. The logo mark

### 3.1 What the source actually is

`WhatsApp Image 2026-11-01 at 00.44.13.jpeg` is a 720×1600 screenshot of the café's Instagram profile: status bar, IG header, the circular profile picture, and a photograph of the shop below. It is not a logo file. The disc is clipped at both horizontal edges.

### 3.2 Extraction

The rose mark sits inside a green disc. A crop box of `left: 120, top: 400, width: 480, height: 480` was sampled at its four corners and its top-centre: every sample returned `#8aa97d`. That proves the box lies entirely inside the disc, so the crop has a flat background and no IG chrome bleeding in.

The crop was resized to 512×512 and written as WebP at quality 90 → `src/assets/logo-mark.webp`.

### 3.3 Rendering

- Imported as a module, rendered through `astro:assets`, emitted with `widths={[96, 192]}` and `sizes="96px"` so a 2× display gets a 192px rendition.
- `alt=""` — the wordmark beside it names the brand; a second announcement would be redundant.
- `border-radius: 50%` with `overflow: hidden` on the wrapper, `object-fit: cover` on the image. The mask lives in CSS, not in a pre-cropped transparent PNG, so the asset stays a plain square and can be reused elsewhere.
- 5.5rem below 768px, 6rem above.

### 3.4 Why the lettering inside the screenshot was not used

The profile picture contains the script "Rosetta" and "Cafe de especialidad" rasterised into the disc. At the 96px the mark renders at, that text is unreadable; it cannot be recoloured, cannot be selected, and degrades on every scale. The masthead keeps a text wordmark in Newsreader at `--text-3xl`, which is crisp at any zoom, translatable, and accessible as the page's `<h1>`.

### 3.5 Known limitation

The mark is interpolated from a lossy JPEG. At 96px it is indistinguishable from a real asset. It is not suitable for print, for a splash screen, or for any use above roughly 200px. **This needs a real PNG or SVG.** Recorded as a limitation; no amount of CSS fixes a missing source file.

## 4. Masthead layout

Mobile first, because the mock is a phone and because the mark-over-wordmark arrangement is what a café sign looks like.

```
< 768px                        ≥ 768px
┌───────────────┐              ┌───────────────────────────┐
│     (mark)    │              │ (mark)                    │
│    Rosetta    │              │ Rosetta                   │
│  Café de esp. │              │   Café de especialidad    │
│    tagline    │              │ tagline                   │
└───────────────┘              └───────────────────────────┘
     centred                        left-aligned
```

Implemented with `align-items` and `text-align` switching at the existing 768px breakpoint — no new media query tier, no container query, no layout JavaScript. The photograph band below keeps its 4:3 → 21:9 behaviour from the previous change.

## 5. Product rows

Two changes, both in `ProductListItem.astro`:

- `.menu-item__thumb` → `border-radius: 50%`. A circle reads as a plate seen from above, which is what the photographs are. The square box, `aspect-ratio: 1`, `object-fit: cover`, and the group-level column reservation are unchanged.
- `.menu-item__price` → `color: var(--terracotta-ink)`.

The price was already right-aligned, `tabular-nums`, and non-wrapping. It now reads as money rather than as a number that happens to sit on the right.

## 6. What the mock showed and the code does not

| Mock element | Decision | Reason |
|---|---|---|
| White rounded cards with shadow | rejected | The canonical spec forbids a row from being a card; adopting it reverses `menu-ledger-redesign`. |
| JS tabs, one category at a time | rejected | Stacked sections and anchors; no new JS. |
| Great Vibes script | rejected | Third font family; the spec caps at two. |
| `rose-500` accent | rejected | Replaced by terracotta. |
| Allergen line per dish | rejected | No data, and it is a claim the café must sign. |
| Photo banner per category | rejected | Zero category photographs exist. |
| `€ 22,00` prices | rejected | ARS through `formatPrice`. |
| Decorative flowers around headings | rejected | Ornament without meaning; the rule and the green `<h3>` already delimit the group. |
| Search icon in the nav | rejected | A filter over 94 products needs JavaScript and a result state we have not designed. |
| Circular thumbnails | **adopted** | No new data, no new JS, reads as a plate. |
| Terracotta money accent | **adopted** | Warmth the palette was missing. |
| Mark above the wordmark | **adopted** | The brand was invisible above the fold. |

## 7. Accessibility

- Every text pair clears AA; the numbers are in §2.2 and were computed, not sampled.
- The mark carries `alt=""` and is not a link, so it adds nothing to the tab order.
- No element's hit area changed, so no touch target regressed.
- `:focus-visible` keeps a 2px outline at 3px offset, now in `--terracotta-ink` (5.76:1 against paper — a focus ring must itself be perceivable).
- Contrast is preserved in both locales: the palette carries no locale-dependent text.

## 8. Motion policy

Unchanged from `menu-ledger-redesign`: no entrance animations, no scroll effects, no hover transforms. The only transitions on the page remain the nav link's colour and border, and the language switcher's colour.

## 9. Known deviations recorded, not fixed

1. **The logo source is a screenshot.** §3.5. Needs a real asset.
2. **`subCategories.es` / `.en` remain positionally coupled**, and `Product.subCategory` remains a Spanish string matched against the `es` array. Documented in `product-menu`; out of scope here.
