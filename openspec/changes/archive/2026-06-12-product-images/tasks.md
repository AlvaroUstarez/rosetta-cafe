# Tasks: Product Images

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~230 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Foundation + Data + UI + Verify | PR 1 | Single PR — under 400 lines, low risk |

## Phase 1: Foundation

- [x] 1.1 Create `src/data/category-visual.ts` — import `Category` type from `./menu`, export `categoryGradients: Record<Category, string>` with 6 entries per design mapping

## Phase 2: Data

- [x] 2.1 Remove 10 gradient `const` declarations from `src/data/menu.ts` (`cafe`, `cafeFrio`, `cafeEspecial`, `infusion`, `jugo`, `pasteleria`, `panaderia`, `salado`, `menuGrad`, `promo`)
- [x] 2.2 Set `image: "/images/products/{id}.webp"` for 3 products: `espresso`, `espresso-leche-grande`, `iced-cappuccino`
- [x] 2.3 Set `image: ""` for the remaining ~85 products

## Phase 3: UI

- [x] 3.1 Import `categoryGradients` from `../data/category-visual` in `ProductCard.astro`
- [x] 3.2 Replace static gradient render with conditional: `<img>` when `product.image` truthy, `<div style="background: categoryGradients[product.category]">` when falsy
- [x] 3.3 Add `onerror` handler on `<img>`: hide the image, show gradient fallback div sibling on 404
- [x] 3.4 Set `loading="lazy"` on `<img>` elements

## Phase 4: Verify

- [x] 4.1 Run `npx @biomejs/biome check .` and fix any lint issues
- [x] 4.2 Run `npx astro check` and fix type errors
- [x] 4.3 Run `npm run build` (`astro build`) — verify clean build
- [x] 4.4 Visual check: confirmed by user — images render correctly, fallback works
