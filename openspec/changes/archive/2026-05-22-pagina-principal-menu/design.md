# Design: Página Principal — Menú Visual

## Technical Approach

Homepage estática generada en build time por Astro. Cuatro componentes Astro independientes (Hero, MenuTabs, ProductCard, Footer) montados en `index.astro` dentro de `BaseLayout.astro`. Un archivo `src/data/menu.ts` con tipos y datos mock alimenta el menú. CSS vanilla con custom properties para la paleta cálida. Tabs implementadas con `input:checked` para cero JavaScript.

## Architecture Decisions

### CSS: Vanilla + Custom Properties vs Tailwind/CSS Modules
| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| **Vanilla + custom props** | Sin build step extra, zero dependencias. Un solo `global.css` con reset, variables y estilos compartidos. | ✅ Elegido |
| Tailwind | Agrega dependencia, config, y clases utilitarias para una página chica. Overkill. | ❌ |
| CSS Modules | +1 archivo por componente. Para 4 componentes chicos, el overhead no justifica el aislamiento. | ❌ |

### Tabs sin JS: `input:checked` vs `:target` vs `<details>`
| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| **`input:checked`** | Markup ordenado: inputs radio hermanos de los panels. CSS con `~` combinator. Sin efectos secundarios en URL. | ✅ Elegido |
| `:target` | Usa fragmentos de URL (`#cafe`). Contamina history, causa scroll jumping. Fricción UX. | ❌ |
| `<details>/<summary>` | Nativo de disclosure, no de tabs. Solo un panel abierto a la vez requiere JS extra. | ❌ |

### Grid de productos: CSS Grid explícito vs `auto-fill`
| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| **`repeat(3, 1fr)` con media queries** | Control exacto de columnas por breakpoint (1→2→3). Coincide con spec. | ✅ Elegido |
| `auto-fill`, `minmax(280px, 1fr)` | Delegamos column-count al layout. No garantiza 2 en tablet / 3 en desktop. | ❌ |

### Tipografía: Google Fonts `<link>` vs self-hosted
| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| **Google Fonts `<link>`** | Simple, cero config. Dos requests externos (Playfair Display + Inter). | ✅ Elegido |
| Self-hosted (woff2 en proyecto) | +2 archivos, + líneas en `@font-face`. Mejor performance offline, pero no crítica para sitio informativo. | ❌ |

## Data Flow

```
src/data/menu.ts (Product[], categories)
       │
       ▼
MenuTabs.astro ──categoriza──► for each category: tab-panel
       │                              │
       │                         ProductCard.astro
       │                         props: { product: Product }
       │                              │
       │                         card: placeholder ─ nombre ─ descripción ─ precio
```

`menu.ts` exporta un array plano de `Product[]`. `MenuTabs.astro` lo agrupa por `category` usando `Array.filter()` en template. No hay estado compartido, props drilling ni store — cada componente recibe solo los datos que necesita.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/data/menu.ts` | Create | Tipos `Product`, `Category` y array mock (≥6 productos) |
| `src/styles/global.css` | Create | Reset mínimo, custom properties (colores, tipografía, spacing) |
| `src/components/Hero.astro` | Create | Hero full-height con heading, tagline, fondo |
| `src/components/MenuTabs.astro` | Create | Tabs categoría + grilla de productos (`input:checked`) |
| `src/components/ProductCard.astro` | Create | Card individual con placeholder, nombre, desc, precio |
| `src/components/Footer.astro` | Create | Footer con locación, horarios, redes |
| `src/pages/index.astro` | Modify | Reemplazar boilerplate por Hero + MenuTabs + Footer |
| `src/layouts/BaseLayout.astro` | Modify | Importar `global.css`, agregar Google Fonts `<link>` |

No se eliminan archivos.

## Interfaces / Contracts

```ts
// src/data/menu.ts
export type Category = "cafe" | "pasteleria" | "panaderia";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;          // en ARS, sin separador
  category: Category;
  image: string;          // gradiente CSS inline (placeholder)
}

export const products: Product[] = [ /* ≥6 items */ ];
```

```astro
---
// ProductCard.astro — contrato
import type { Product } from "../data/menu";
export interface Props {
  product: Product;
}
const { product } = Astro.props;
---
```

## Testing Strategy

| Verificación | Comando | Criterio |
|-------------|---------|----------|
| Build | `bun run build` | Exit 0, sin errores |
| Type check | `bun astro check` | 0 errores de tipos |
| Lint | `bun biome check .` | 0 errores |
| Tabs sin JS | Inspección manual | Cada input radio alterna visibilidad de panels |

## Migration / Rollout

No migration required. Es greenfield — `index.astro` actual es boilerplate de template. Rollback: revertir cambios en `index.astro` y `BaseLayout.astro`, eliminar `src/data/menu.ts`, `src/styles/global.css` y los 4 componentes.

## Open Questions

- [ ] **Paleta de colores exacta**: ¿Definimos valores hex ahora o los ajustamos con diseño visual después? Propongo valores iniciales en el design para desbloquear implementación.
