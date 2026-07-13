# Tasks: Página Principal — Menú Visual

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~250 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-on-risk |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 1: Foundation

- [x] 1.1 Create `src/data/menu.ts` — `Product` interface, `Category` type, mock array (≥6 products, ≥2 per category)
- [x] 1.2 Create `src/styles/global.css` — CSS reset, custom properties (warm palette), base typography

## Phase 2: Components

- [x] 2.1 Create `src/components/ProductCard.astro` — Card with gradient placeholder, name, description, price, hover effect
- [x] 2.2 Create `src/components/MenuTabs.astro` — `input:checked` tabs, filter products by category, wire ProductCard grid
- [x] 2.3 Create `src/components/Hero.astro` — Full-height hero with heading, tagline, background
- [x] 2.4 Create `src/components/Footer.astro` — Location, hours, social links, dark background

## Phase 3: Integration

- [x] 3.1 Modify `src/layouts/BaseLayout.astro` — Import `global.css`, add Google Fonts `<link>` (Playfair Display + Inter)
- [x] 3.2 Modify `src/pages/index.astro` — Replace boilerplate with Hero + MenuTabs + Footer

## Phase 4: Verification

- [x] 4.1 Run `npm run build` — exit 0, no errors
- [x] 4.2 Run `npm run astro check` — 0 type errors
- [x] 4.3 Run `npx @biomejs/biome check .` — 0 lint errors
- [x] 4.4 Verify tabs switch categories manually (CSS-only)
