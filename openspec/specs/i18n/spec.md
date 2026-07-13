# i18n Specification

## Purpose

Define el sistema de internacionalización del sitio estático de Rosetta Café. Usa el sistema de i18n routing nativo de Astro 6 para generar rutas separadas por idioma, sin JavaScript runtime.

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

The system MUST store UI translations in `src/i18n/{locale}.json` files. Each JSON file MUST contain a flat key-value mapping for UI strings (hero, footer, nav labels, empty states, protocolo heading, etc.). The keys MUST be identical across locales.

#### Scenario: Translation keys match across locales

- GIVEN the JSON files `es.json` and `en.json`
- WHEN comparing their top-level keys
- THEN both files have the same set of keys
- AND no key is missing in either locale

### Requirement: Locale Helper

The system MUST provide a `t(record, locale)` helper function that returns the locale-specific value from a record. If the value is a plain string (not a record), the helper MUST return it as-is.

#### Scenario: Helper returns locale value

- GIVEN a record `{ es: "Café", en: "Coffee" }`
- WHEN calling `t(record, "en")`
- THEN it returns `"Coffee"`

#### Scenario: Helper handles plain strings

- GIVEN a value `"Espresso"` (plain string)
- WHEN calling `t(value, "en")`
- THEN it returns `"Espresso"` unchanged

### Requirement: Language Switcher Mechanism

The system MUST render static `<a>` links to switch between locales. The link MUST point to the root of the target locale (`/` for ES, `/en/` for EN). The active locale SHOULD be visually distinguished. The switcher MUST work without JavaScript.

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
