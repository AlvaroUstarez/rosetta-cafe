# Rosetta Café

Menú web estático para café de especialidad con panadería y pastelería artesanal.

## Stack

- **Astro 6** — SSG, i18n nativo (ES/EN)
- **TypeScript** — datos tipados de 88 productos
- **Biome** — lint + format

## Estructura

```
src/
├── components/    ProductCard, MenuSection, SectionNav, Hero, Footer
├── data/          menu.ts (88 productos), category-visual.ts
├── i18n/          es.json, en.json, index.ts
├── layouts/       BaseLayout
├── pages/         index.astro (ES), en/index.astro (EN)
└── styles/        global.css
public/
└── images/products/  17 fotos WebP
```

## Desarrollo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Licencia

MIT
