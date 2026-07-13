# Proposal: Menú Multilenguaje (ES/EN)

## Intent

Add English language support to the Rosetta Café static site. The site currently renders only in Spanish. This change adds full i18n support with Astro's native i18n routing, producing separate static HTML files per locale with zero JavaScript runtime.

## Scope

- Configure Astro i18n routing with `["es", "en"]`, ES as default (no prefix), EN prefixed `/en/`
- Create UI translation files in `src/i18n/{locale}.json` for hero, footer, nav, empty states, protocolo
- Refactor product data types from plain strings to `{ es: string; en: string }` (I18nRecord)
- Create `t(key, locale)` and `tRecord(record, locale)` helper functions
- Add language switcher (`<a>` links) to section navigation
- Set `<html lang>` dynamically
- Create `src/pages/en/index.astro` for English route
- Translate all ~88 products, 6 categories, sub-categories, and protocolo content
- No JavaScript runtime — pure static HTML per locale

## Out of Scope

- Dynamic language switching (no JS toggles)
- Multi-language SEO (hreflang, sitemap)
- User language detection / redirect (no server)
- Third translation (only ES/EN)
- Translation management system or CMS

## Approach

Use Astro 6's built-in i18n routing for static output. UI strings stored as flat JSON per locale. Product data co-located in TypeScript using `I18nRecord = { es: string; en: string }`. Static `<a>` links for language switching.

## Rollback

Revert the implementation commit. The main spec files in `openspec/specs/` would retain the delta changes but no code would reference them.
