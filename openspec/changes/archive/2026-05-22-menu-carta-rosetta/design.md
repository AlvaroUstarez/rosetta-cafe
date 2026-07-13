# Design: Menu Carta Rosetta

## Technical Approach

Replace CSS-only tabs (`input:checked` — 3 categories, 8 mock products) with a scroll-based layout: sticky horizontal nav + vertically stacked menu sections (~60 real products). Zero JavaScript — anchor links use `href="#section-id"` with `scroll-margin-top` offset for sticky nav clearance.

## Architecture Decisions

| Decision | Options | Chosen | Rationale |
|---|---|---|---|
| Navigation model | JS scroll spy, CSS `:target`, anchor links + sticky nav | Anchor links + sticky `nav` | Zero-JS constraint. `scroll-margin-top` offsets nav height. Native anchor behavior works without JS. |
| Data structure | Flat categories + imperative grouping, typed `subCategory` per product | `Product.subCategory?: string` + `MenuCategory[]` meta array | Normalized data keeps products queryable. Meta array drives both nav links and section rendering without hardcoding. |
| Component split | Single mega-section, split nav + section + card | `SectionNav` + `MenuSection` + `ProductCard` | Nav and sections render from same `categories[]` — single source of truth. `ProductCard` stays unchanged. |
| Section theming | CSS class per section, `:nth-child` alternation, custom properties | `:nth-child(odd/even)` + `--section-accent` custom property per section | Zero-class approach. Each `MenuSection` sets `style="--section-accent: ..."` via inline prop. |
| Grid system | CSS Grid (existing), Flexbox | CSS Grid (same as current) | `grid-template-columns: 1fr / repeat(2,1fr) / repeat(3,1fr)` matches existing ProductCard layout. No regressions. |

## Data Flow

```
src/data/menu.ts
  │
  ├── categories[] ──────→ SectionNav (renders <a href="#cafe">)
  │
  ├── products[] ───┐
  │                 ├──→ MenuSection (category matched + filtered)
  │                 │     ├── <h2> section header
  │                 │     ├── <h3> sub-category dividers (if any)
  │                 │     └── ProductCard × N
  │                 │
  └── protocolo ────→ MenuSection (last, plain-text variant)
```

## File Changes

| File | Action | Description |
|---|---|---|
| `src/data/menu.ts` | Modify | Expand `Category` union (6 cats), add `subCategory` to `Product`, add `MenuCategory[]` & `Protocolo` types, rewrite with ~60 real products + protocolo config |
| `src/components/SectionNav.astro` | Create | Sticky `position: sticky; top: 0` nav with `overflow-x: auto` on mobile. Renders `<a href="#{id}">` links from `MenuCategory[]` |
| `src/components/MenuSection.astro` | Create | Props: `section`, `products`, `protocolo?`. Renders header, optional sub-category `<h3>` dividers, and product grid |
| `src/components/ProductCard.astro` | Modify | Minor — `product.category` type widens to new `Category` union. No visual changes |
| `src/components/MenuTabs.astro` | Delete | Entirely replaced by section layout |
| `src/pages/index.astro` | Modify | Replace `<MenuTabs />` with `<SectionNav />` + mapped `<MenuSection />`s + protocolo section |
| `src/styles/global.css` | Modify | Add `.section-nav` styles, `scroll-margin-top` utility, alternating section backgrounds, `.sub-category__heading` |

## Interfaces

```typescript
// src/data/menu.ts
export type Category =
  | "cafe" | "sin-cafe" | "pasteleria-panaderia"
  | "opciones-saladas" | "menus" | "promos";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  subCategory?: string;  // "Calientes", "Fríos", etc.
  image: string;         // CSS gradient placeholder
}

export interface MenuCategory {
  id: Category;
  label: string;            // "Café", "Sin Café", etc.
  subCategories?: string[]; // ["Calientes", "Fríos", ...]
}

export interface Protocolo {
  title: string;
  content: string;
}
```

## Testing Strategy

| Layer | What | How |
|---|---|---|
| Build | `npm run build` | Must produce 0 errors |
| Types | `npx astro check` | All types resolve |
| Lint | `npx @biomejs/biome check .` | 0 warnings |
| Manual | Sticky nav + scroll-jump per section | Each nav link scrolls to correct section with `scroll-margin-top` offset |
| Manual | Sub-category dividers | Café shows Calientes/Fríos/Adicionales/Especiales as `<h3>` dividers |

## Migration / Rollout

Atomic replacement — `MenuTabs` is a single-component swap in `index.astro`:

1. Rewrite `menu.ts` (data only) — verifiable by build check alone
2. Create `SectionNav.astro` + `MenuSection.astro`
3. Wire in `index.astro`, remove `MenuTabs` import
4. Add styles to `global.css`, remove unused tab CSS
5. Delete `MenuTabs.astro`

Rollback: revert `menu.ts`, `index.astro`, `global.css`; restore `MenuTabs.astro` from git; delete new components.

## Open Questions

None.
