# Tasks: diseno-3-0

## 1. Foundations

### 1.1 Palette and tokens

- [x] 1.1.1 Delete `--brass` and `--brass-ink` from the `:root` block in `src/styles/global.css`.
- [x] 1.1.2 Add `--terracotta: #b4553a`, `--terracotta-ink: #a04934`, `--green: #86a479`, `--green-ink: #4a6b3f`, each with its measured ratio in a comment beside it.
- [x] 1.1.3 Compute every foreground/background pair with the WCAG relative-luminance formula before committing the values. Result: terracotta 4.68:1, terracotta-ink 5.76:1, green 2.65:1, green-ink 5.81:1 on `--paper`. Recorded in `design.md` §2.2.
- [x] 1.1.4 Move `::selection` to `color-mix(in srgb, var(--terracotta) 24%, var(--paper))` and `:focus-visible` to `--terracotta-ink`.
- [x] 1.1.5 Rewrite the stylesheet header comment: "one metal accent" no longer describes the system.

### 1.2 Logo asset

- [x] 1.2.1 Identify the source: `WhatsApp Image 2026-11-01 at 00.44.13.jpeg` is a 720×1600 screenshot of the Instagram profile, not a logo file.
- [x] 1.2.2 Probe candidate crop boxes and sample all four corners plus top-centre of each. Box `(120, 400, 480, 480)` returned `#8aa97d` at every sample — entirely inside the green disc, no IG chrome.
- [x] 1.2.3 Crop, resize to 512×512, write as WebP q90 → `src/assets/logo-mark.webp`.

## 2. Masthead

- [x] 2.1 Import `logoMark` in `Hero.astro` and render it through `astro:assets` with `widths={[96, 192]}`, `sizes="96px"`, `alt=""`.
- [x] 2.2 Mask the wrapper to a circle (`border-radius: 50%`, `overflow: hidden`) with `object-fit: cover` on the image, instead of shipping a pre-cropped transparent PNG.
- [x] 2.3 Centre the masthead block below 768px (mark → wordmark → kind → tagline) and return it to the left margin at 768px, reusing the existing breakpoint.
- [x] 2.4 Size the mark 5.5rem below 768px and 6rem above.
- [x] 2.5 Move the kind label from `--brass-ink` to `--green-ink`.
- [x] 2.6 Leave the photograph band, its aspect ratios and its `priority` hint untouched.

## 3. Rows

- [x] 3.1 `border-radius: 50%` on `.menu-item__thumb`; box, `aspect-ratio: 1`, `object-fit: cover` and the group-level column rule unchanged.
- [x] 3.2 `.menu-item__price` → `--terracotta-ink`; right alignment, `tabular-nums` and `nowrap` unchanged.

## 4. Chrome accents

- [x] 4.1 `SectionNav.astro`: active link underline `--brass` → `--terracotta`; language switcher hover `--brass-ink` → `--green-ink`.
- [x] 4.2 `MenuSection.astro`: `.menu-group__title` `--brass-ink` → `--green-ink`; protocolo note left border `--brass` → `--green`.
- [x] 4.3 Confirm no `<script>` was added: `git grep -n "<script" -- src/` returns only the pre-existing `IntersectionObserver` in `SectionNav.astro`.

## 5. Documentation

- [x] 5.1 `proposal.md`, `design.md` and this file for `diseno-3-0`.
- [x] 5.2 Spec deltas for `homepage-layout` and `product-menu`. No delta for `i18n` — nothing in it changed.
- [x] 5.3 Note the palette and the logo asset's origin in `AGENTS.md`.

## 6. Verification

- [x] 6.1 `git grep -n "brass" -- src/` → no matches.
- [x] 6.2 `npx astro check` → 0 errors, 0 warnings, 0 hints (12 files).
- [x] 6.3 `npm run build` → 2 pages, 133 assets (was 130).
- [x] 6.4 Inspect `dist/index.html`: 33 `<img>`, the mark present, `masthead__mark` before `masthead__name` before `masthead__plate`.
- [x] 6.5 Re-read `AGENTS.md`'s design-system line and confirm it still describes the file it points at.

## 7. Open items

- [ ] 7.1 Obtain a real logo asset (PNG or SVG). The current mark is interpolated from a lossy 480×480 JPEG crop and is not fit for print or for any size above roughly 200px.
- [ ] 7.2 Decide whether the cropped screenshot stays in the repository root. It is untracked and never committed; once a real asset exists it is dead weight.
- [ ] 7.3 (Carried from `2026-11-01-menu-ledger-redesign`) Wire the three footer social links to real URLs.
- [ ] 7.4 (Carried) Decide whether `openspec/changes/menu-redesign/` is archived as superseded or deleted.
