# Design: Menú Multilenguaje (ES/EN)

## Technical Approach

i18n 100% estático con Astro 6 nativo. Build genera `/index.html` (ES, default sin prefijo) y `/en/index.html` (EN, prefijado). Traducciones en dos capas: UI strings en JSON plano (`src/i18n/{locale}.json`) y datos de producto como registros `{ es, en }` en los tipos (`I18nRecord`). Dos helpers: `t(key, locale)` para UI strings y `tRecord(record, locale)` para datos. `Locale` se pasa como prop desde cada page (`index.astro` → `"es"`, `en/index.astro` → `"en"`).

## Architecture Decisions

| Decisión | Opciones | Elección | Rationale |
|----------|----------|----------|-----------|
| Ruteo | Astro i18n vs carpetas manuales | Astro i18n | Routing declarativo, genera `sitemap` correcto, sin plumbing manual |
| Datos de producto | JSON aparte vs `{ es, en }` inline | `{ es, en }` inline | Co-locado, tipado, escala a más idiomas sin cambiar consumers |
| Traducciones UI | JSON vs TS vs YAML | JSON | Import estático, editable por no-devs, tipado opcional vía `satisfies` |
| Switch idioma | JS toggle vs `<a>` links | `<a>` links | Zero JS, instantáneo, SEO-friendly |
| Helper API | `t(val, locale)` única vs separada | `t(key, locale)` + `tRecord(record, locale)` | JSON keys vs records tienen distinta naturaleza; separar evita ambigüedad |

## Data Flow

```
Build:
  astro.config.mjs i18n → rutas / (es) y /en/

Page (index.astro o en/index.astro):
  define locale: "es" | "en"
  ↓ pasa como prop
Componentes (Hero, Footer, SectionNav, MenuSection, ProductCard):
  ↓
  UI strings:  t("hero.tagline", locale)      ← src/i18n/{locale}.json
  Data:        tRecord(product.name, locale)    ← src/data/menu.ts records

Browser:
  GET /       → lang=es, textos español, nav categorías español
  GET /en/    → lang=en, textos inglés, nav categorías inglés
  Click "EN"  → <a href="/en/">, navegación nativa
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `astro.config.mjs` | Modify | `i18n` con locales `["es", "en"]`, default `es`, `prefixDefaultLocale: false` |
| `src/i18n/es.json` | Create | UI strings español (hero, footer, nav, menu) |
| `src/i18n/en.json` | Create | UI strings inglés (mismas keys) |
| `src/i18n/index.ts` | Create | Helpers `t()`, `tRecord()`, tipos `Locale` e `I18nRecord` |
| `src/data/menu.ts` | Modify | Todos los strings textuales → `I18nRecord { es, en }` |
| `src/layouts/BaseLayout.astro` | Modify | `<html lang={locale}>`, import i18n |
| `src/components/Hero.astro` | Modify | Tagline via `t("hero.tagline", locale)` |
| `src/components/Footer.astro` | Modify | Todos los textos via `t()` |
| `src/components/SectionNav.astro` | Modify | Labels via `tRecord()`, language switcher |
| `src/components/MenuSection.astro` | Modify | Section label via `tRecord()`, subCategories indexado por locale |
| `src/components/ProductCard.astro` | Modify | name/description via `tRecord()` |
| `src/pages/index.astro` | Modify | Pasa `locale="es"` a componentes |
| `src/pages/en/index.astro` | Create | Pasa `locale="en"` a componentes |

## Interfaces / Contracts

```ts
// src/i18n/index.ts
type Locale = "es" | "en";
type I18nRecord = { es: string; en: string };

function t(key: string, locale: Locale): string;
function tRecord(value: string | I18nRecord, locale: Locale): string;

// src/data/menu.ts
interface Product {
  id: string;
  name: I18nRecord;
  description: I18nRecord;
  price: number;
  category: Category;
  subCategory?: string;
  image: string;
}

interface MenuCategory {
  id: Category;
  label: I18nRecord;
  subCategories?: { es: string[]; en: string[] };
}

interface Protocolo {
  title: I18nRecord;
  content: I18nRecord;
}
```

## Testing Strategy

No test runner. Verificación: `astro build`, `tsc --noEmit`, revisión visual de `/` y `/en/`.

## Migration / Rollout

No migration required. Rollback: revertir commit.
