# Proposal: Product Images

## Intent

Replace CSS gradient placeholders with real product images (WebP) on the Rosetta Café menu. Currently `Product.image` holds a gradient string — the field needs to support both image paths and gradient fallbacks. 3 WebP files already exist. Extract gradient constants into a dedicated module to keep `menu.ts` focused on data.

## Scope

### In Scope
- 3 products show real images (espresso, espresso-leche-grande, iced-cappuccino)
- Remaining ~85 products show category-based gradient fallback
- Gradient constants moved to `src/data/category-visual.ts`
- `ProductCard.astro` renders `<img>` for images, gradient `<div>` for fallback

### Out of Scope
- Adding new product images beyond the 3 existing WebP files
- Image optimization, lazy loading, or responsive srcsets
- Image upload UI or CMS integration
- Changing the i18n or data model beyond `image` field semantics

## Capabilities

### New Capabilities

None

### Modified Capabilities

- `product-menu`: Product cards now render real images when available, with per-category gradient fallback. `Product.image` changes from CSS gradient string to image path or empty string.

## Approach

1. Create `src/data/category-visual.ts` — exports `categoryGradients: Record<Category, string>` mapping each category to one representative gradient.
2. Remove gradient variables from `src/data/menu.ts`. Set `image: "/images/products/{id}.webp"` for the 3 products with files, `image: ""` for all others.
3. Update `ProductCard.astro`: if `product.image` is truthy and starts with `/`, render `<img>`. If empty, render a `<div>` with the category gradient from the new map.
4. Keep existing CSS — `<img>` uses `object-fit: cover; height: 180px`.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/data/menu.ts` | Modified | Remove gradient vars, update `image` values |
| `src/data/category-visual.ts` | New | Category-to-gradient lookup map |
| `src/components/ProductCard.astro` | Modified | Conditional img/gradient rendering |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Image 404 if file missing | Low | `onerror` handler hides img, falls back to gradient div |
| Category gradient mismatch | Low | Default fallback gradient for any missing category key |

## Rollback Plan

Revert each file: restore gradient variables in `menu.ts`, delete `category-visual.ts`, restore `ProductCard.astro` to always-render gradient div.

## Dependencies

None. Images already exist in `public/images/products/`.

## Success Criteria

- [ ] `astro build` succeeds with no type errors
- [ ] Products with WebP images render `<img>` tags
- [ ] Products without images render category gradient fallback
- [ ] All gradient constants removed from `menu.ts`
- [ ] `categoryGradients` map covers all 6 categories
