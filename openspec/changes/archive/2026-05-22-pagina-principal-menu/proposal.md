# Proposal: Página Principal — Menú Visual de Rosetta Café

## Intent

Construir la homepage de Rosetta Café de Especialidad que comunique la calidez del espacio y muestre el menú visual de productos. El sitio debe sentirse como entrar al café: texturas cálidas, fotos que invitan, y navegación clara por categorías. Es la carta de presentación digital del negocio.

## Scope

### In Scope
- Hero con nombre "Rosetta Café de Especialidad" y tagline que evoque el ritual del café
- Menú visual con tabs de categoría: Café, Pastelería, Panadería
- Cards de producto con foto placeholder, nombre, descripción breve, precio
- Diseño responsive mobile-first con CSS Grid
- Paleta cálida (marrones, cremas, tonos tierra) y tipografía elegante
- Footer con ubicación, horarios y redes sociales
- Datos mock en archivo TypeScript separado

### Out of Scope
- Admin panel para CRUD de productos (próximo cambio)
- Carrito / compra online
- Datos reales de Rosetta Salta (usamos datos mock)
- SEO / meta tags avanzados
- Animaciones complejas (solo CSS transitions)
- Integración con CMS o backend

## Capabilities

### New Capabilities
- `homepage-layout`: Hero section con branding, layout responsive, footer institucional
- `product-menu`: Tabs de categoría, grilla de productos, cards con foto y precio, datos mock

### Modified Capabilities
None — no hay specs existentes.

## Approach

1. Variables CSS globales (colores, tipografía) en `BaseLayout.astro`
2. Hero con nombre, tagline e imagen de fondo evocativa
3. Tabs de categoría en CSS puro (`input:checked`) para cambio sin JS
4. Grid de productos con CSS Grid (`auto-fill`, `minmax`)
5. Data mock en `src/data/menu.ts` con tipado estricto
6. Footer con layout flex e íconos SVG inline
7. Mobile-first: 1 columna → 2 (tablet) → 3 (desktop)

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/index.astro` | Modified | Homepage completa con hero + menú + footer |
| `src/layouts/BaseLayout.astro` | Modified | Variables CSS globales, Google Fonts |
| `src/data/menu.ts` | New | Datos mock con tipado estricto |
| `src/components/Hero.astro` | New | Hero section |
| `src/components/MenuTabs.astro` | New | Tabs de categoría |
| `src/components/ProductCard.astro` | New | Card de producto |
| `src/components/Footer.astro` | New | Footer institucional |
| `src/styles/global.css` | New | Variables CSS, reset, utilidades |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Tabs sin JS no funcionan en browsers antiguos | Low | `input:checked` tiene soporte amplio; fallback graceful muestra todas las categorías |
| Fotos placeholder distraen del diseño | Low | Usar fondos con gradientes cálidos en lugar de imágenes genéricas |

## Rollback Plan

Revertir cambios en `index.astro` y `BaseLayout.astro`, eliminar componentes y archivos nuevos. Como es greenfield sin datos reales, no hay riesgo de corrupción.

## Dependencies

- Astro (ya presente en el scaffold)
- Google Fonts: Playfair Display (títulos), Inter (cuerpo) — vía `<link>` en layout

## Success Criteria

- [ ] Homepage carga sin errores en mobile, tablet y desktop
- [ ] Tabs alternan entre categorías sin JavaScript
- [ ] Cada categoría muestra al menos 2 productos mock
- [ ] Variables CSS definidas en archivo global y aplicadas
- [ ] Footer muestra ubicación, horarios y redes sociales
- [ ] `astro build` produce output sin errores
- [ ] Diseño se percibe cálido y coherente con la marca
