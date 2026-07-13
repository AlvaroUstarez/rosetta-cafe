# Design: Product Images

## Technical Approach

Replace CSS gradient strings in `Product.image` with real image paths or empty strings. Extract the gradient constants into a dedicated `category-visual.ts` module that maps each `Category` to one representative gradient. `ProductCard.astro` renders `<img>` when `product.image` is truthy, with a gradient `<div>` fallback — for missing `image` values and for `onerror` recovery.

## Architecture Decisions

### Decision: Category-to-Gradient Mapping

| Option | Tradeoff | Decision |
|--------|----------|----------|
| All 10 gradients in `Record<Category, string>` | Some categories used multiple gradients (e.g. `cafe` had 3). Mapping 1 per category loses sub-category visual distinction. | **Accepted**. The proposal explicitly asks for `Record<Category, string>` — one gradient per category. The lost nuance is acceptable since gradients are placeholders until real images ship. |
| Keep gradient constants in `menu.ts` | Increases coupling — `menu.ts` would need to import from `category-visual.ts` just to re-export them. | **Rejected**. The whole point is extracting visual concerns from data. |

**Choice**: `categoryGradients` maps each of the 6 categories to the most-used gradient within that category.

**Mapping**:
- `cafe` → `cafe` (`#6F4E37` / `#8B6914` — brown coffee)
- `sin-cafe` → `jugo` (`#E68A2E` / `#D4731A` — orange, covers 7 of 12 items)
- `pasteleria-panaderia` → `pasteleria` (`#D4A574` / `#F5DEB3` — beige, covers 16 of 18 items)
- `opciones-saladas` → `salado` (`#A67B5B` / `#8B6342` — warm brown)
- `menus` → `menuGrad` (`#6B8E5A` / `#4A6B3A` — green)
- `promos` → `promo` (`#C0392B` / `#8B1A1A` — red)

### Decision: Image Fallback Strategy

**Choice**: `onerror` handler on `<img>` that hides the image and reveals a gradient `<div>` sibling.
**Alternatives considered**: CSS `background-image` fallback via multiple backgrounds. Rejected because `onerror` on `<img>` is the idiomatic HTML pattern and keeps the markup declarative.
**Rationale**: The `onerror` fires only when the image actually 404s — a CSS-only approach can't detect a failed network fetch. A hidden fallback `<div>` is toggled via inline `onerror` + `onload` to avoid flash-of-fallback.

## Data Flow

```
menu.ts                          ProductCard.astro
┌──────────────┐                ┌─────────────────┐
│ products[].image │                │ product.image   │
│  → "/images/…"  │─── props ──→│  │ truthy? → <img> │
│  → ""           │                │  falsy?  → <div> │
└──────────────┘                │  (gradient)   │
                                    │                 │
category-visual.ts                 │ onerror: hide   │
┌──────────────┐                │  img, show div │
│ Category →    │─── import ──→│                 │
│ gradient str  │                └─────────────────┘
└──────────────┘
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/data/category-visual.ts` | Create | `categoryGradients: Record<Category, string>` — 6 category→gradient entries |
| `src/data/menu.ts` | Modify | Remove 10 `const` gradient declarations. Set `image: "/images/products/{id}.webp"` for 3 products, `image: ""` for 85 others |
| `src/components/ProductCard.astro` | Modify | Import `categoryGradients`. Conditional render: `<img>` (truthy) or `<div>` with gradient background (falsy). `onerror` fallback. `loading="lazy"` on img |

## Interfaces / Contracts

```typescript
// src/data/category-visual.ts
import type { Category } from "./menu";
export const categoryGradients: Record<Category, string>;
```

3 products with images:
- `espresso` → `/images/products/espresso.webp`
- `espresso-leche-grande` → `/images/products/espresso-leche-grande.webp`
- `iced-cappuccino` → `/images/products/iced-cappuccino.webp`

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `categoryGradients` covers all 6 categories | TypeScript compilation check (keyof) |
| Build | `astro build` succeeds with no type errors | Run `astro build` |
| Visual | Cards render img vs gradient correctly | Manual visual check on 3 image products + 1 gradient product |
| Error | Missing image falls back to gradient | Manual: rename a WebP, verify fallback renders |

## Migration / Rollout

No migration required. This is a static site — deploy replaces all pages atomically.

## Open Questions

- [ ] Should we add a `default` catch-all gradient in `categoryGradients` lookup for defensive coding, or trust the type system? (Trust type system — `Record<Category, string>` guarantees completeness at compile time.)
