# Rosetta Café

Menú web estático para café de especialidad con panadería y pastelería artesanal.

## Stack

- **Astro 6** — SSG, i18n nativo (ES/EN)
- **TypeScript** — datos tipados de 94 productos
- **Biome** — lint + format

## Estructura

```
src/
├── assets/        hero.webp, products/ (31 fotos WebP)
├── components/    Hero, SectionNav, MenuSection, ProductListItem, Footer
├── data/          menu.ts (94 productos)
├── i18n/          es.json, en.json, index.ts
├── layouts/       BaseLayout
├── pages/         index.astro (ES), en/index.astro (EN)
└── styles/        global.css
public/
└── favicon.ico, favicon.svg
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
