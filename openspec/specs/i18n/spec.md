# i18n Specification

## Purpose

Define el sistema de internacionalización del sitio estático de Rosetta Café: dos locales (`es` por defecto sin prefijo, `en` bajo `/en/`), archivos de traducción para el chrome de la UI, registros inline para el contenido del menú, helpers de resolución y formateo de precios por locale. Funciona sin JavaScript en runtime.

## Requirements

### Requirement: Astro i18n Routing

The system MUST configure Astro i18n with locales `["es", "en"]`. The `es` locale MUST be the default and MUST NOT have a URL prefix. The `en` locale MUST be prefixed with `/en/`. The system MUST generate separate static HTML files per locale.

#### Scenario: ES route is default

- GIVEN the site builds
- WHEN accessing `/`
- THEN the page renders in Spanish
- AND no language prefix appears in the URL

#### Scenario: EN route is prefixed

- GIVEN the site builds
- WHEN accessing `/en/`
- THEN the page renders in English
- AND the URL path starts with `/en/`

#### Scenario: Static HTML files per locale

- GIVEN the site builds
- WHEN inspecting the `dist/` output
- THEN `dist/index.html` exists (Spanish)
- AND `dist/en/index.html` exists (English)

### Requirement: UI Translation Files

The system MUST store UI translations in `src/i18n/{locale}.json` files. Each JSON file MUST contain a flat key-value mapping for UI strings, covering document metadata (`meta.title`, `meta.description`), accessibility (`a11y.skip`), hero (`hero.kind`, `hero.tagline`), navigation (`nav.label`, `lang.es`, `lang.en`), footer (`footer.location.title`, `footer.location.text`, `footer.hours.title`, `footer.hours.text`, `footer.social.title`, `footer.copyright`), and empty states (`menu.empty`). The keys MUST be identical across locales.

Menu content MUST NOT be added to these files. Product names, descriptions, category labels, sub-category labels, and the protocolo notice MUST remain inline `{ es, en }` records in `src/data/menu.ts`, resolved with `tRecord`. The two systems MUST NOT be mixed.

(Previously: the key set covered hero, footer, nav labels, empty states, and the protocolo heading, with no `meta.*`, `a11y.*`, `hero.kind`, `nav.label`, or `lang.*` keys, and no explicit prohibition on moving menu content into the JSON files)

#### Scenario: Translation keys match across locales

- GIVEN the JSON files `es.json` and `en.json`
- WHEN comparing their top-level keys
- THEN both files have the same set of keys
- AND no key is missing in either locale

#### Scenario: Metadata and accessibility strings are localized

- GIVEN both pages are built
- WHEN comparing their `title`, `meta description`, and skip-link text
- THEN each value differs per locale
- AND neither falls back to a key name

#### Scenario: Menu content stays out of the JSON files

- GIVEN `src/i18n/es.json`
- WHEN inspecting its keys
- THEN no product name, description, category label, or protocolo text appears in it
- AND those values remain inline records in `src/data/menu.ts`

### Requirement: Locale Helper

The system MUST provide two distinct helpers in `src/i18n/index.ts`.

`t(key, locale)` MUST resolve a **UI string key** against the `{locale}.json` files. When the key is absent, it MUST fall back to returning the key itself, so a missing translation degrades visibly rather than rendering nothing.

`tRecord(value, locale)` MUST resolve an **inline `{ es, en }` record**. When the value is a plain string, it MUST return it unchanged. It MUST NOT fall back: an inline record is typed as complete, so a missing locale is a type error rather than a runtime case.

(Previously: a single `t(record, locale)` helper resolved inline records and returned plain strings as-is, with no key-based lookup and no `tRecord`)

#### Scenario: Key lookup returns the locale string

- GIVEN `es.json` contains `"menu.empty": "Próximamente"`
- WHEN calling `t("menu.empty", "es")`
- THEN it returns `"Próximamente"`

#### Scenario: Missing key degrades to the key

- GIVEN no locale file defines `"does.not.exist"`
- WHEN calling `t("does.not.exist", "en")`
- THEN it returns `"does.not.exist"`

#### Scenario: Record helper returns the locale value

- GIVEN a record `{ es: "Café", en: "Coffee" }`
- WHEN calling `tRecord(record, "en")`
- THEN it returns `"Coffee"`

#### Scenario: Record helper handles plain strings

- GIVEN a value `"Espresso"` (plain string)
- WHEN calling `tRecord(value, "en")`
- THEN it returns `"Espresso"` unchanged

### Requirement: Locale-Aware Price Formatting

Menu prices MUST be formatted by a single exported helper in `src/i18n/index.ts`, not by string concatenation in components. The helper MUST use `Intl.NumberFormat` with the locale's regional tag (`es-AR` for `es`, `en-US` for `en`), `style: "currency"`, `currency: "ARS"`, `currencyDisplay: "narrowSymbol"`, and `maximumFractionDigits: 0`. The formatted output MUST group thousands per the locale — `$ 3.300` for `es` and `$3,300` for `en`.

A price of `0` MUST bypass the currency formatter and render the localized free label ("Gratis" / "Free") instead of a zero amount.

(Previously: no formatting helper existed; components concatenated `$` and the raw number, so prices rendered as `$ 3300` in both locales with no thousands separator)

#### Scenario: Price formats per locale

- GIVEN a product priced `3300`
- WHEN it renders on the Spanish page
- THEN the price reads `$ 3.300`
- WHEN it renders on the English page
- THEN the price reads `$3,300`

#### Scenario: Zero price reads as free

- GIVEN a product priced `0`
- WHEN it renders with `locale = "es"`
- THEN the price cell reads "Gratis"
- AND no currency symbol is rendered
- WHEN it renders with `locale = "en"`
- THEN the price cell reads "Free"

#### Scenario: Components do not format prices

- GIVEN the component sources
- WHEN searching for currency symbols or `toLocaleString` calls
- THEN no component concatenates a currency symbol with a price
- AND every price resolves through the exported helper

### Requirement: Language Switcher Mechanism

The system MUST render a static `<a>` link that navigates to the root of the other locale (`/` for ES, `/en/` for EN). Navigation MUST work without JavaScript, through native HTML anchor behaviour.

The rendered markup of the switcher — that it offers only the other locale, and the attributes it carries — is specified by `Language Switcher in Section Navigation` in the `homepage-layout` specification, so the rendering contract lives in one place.

(Previously: this requirement duplicated the rendering contract, requiring both "ES" and "EN" links with the active locale visually distinguished; the ledger redesign dropped the active-locale link)

#### Scenario: Switch from ES to EN

- GIVEN the user is on the Spanish page `/`
- WHEN clicking the "EN" link
- THEN the browser navigates to `/en/`
- AND the page renders in English

#### Scenario: Switch from EN to ES

- GIVEN the user is on the English page `/en/`
- WHEN clicking the "ES" link
- THEN the browser navigates to `/`
- AND the page renders in Spanish

#### Scenario: No-JavaScript fallback

- GIVEN JavaScript is disabled
- WHEN the user clicks a language switcher link
- THEN the browser navigates via native HTML anchor behavior

### Requirement: HTML Lang Attribute

The `<html>` element in `BaseLayout.astro` MUST set the `lang` attribute dynamically based on the current locale.

#### Scenario: ES page has lang=es

- GIVEN the Spanish page at `/`
- WHEN inspecting `<html>`
- THEN `lang="es"` is present

#### Scenario: EN page has lang=en

- GIVEN the English page at `/en/`
- WHEN inspecting `<html>`
- THEN `lang="en"` is present
