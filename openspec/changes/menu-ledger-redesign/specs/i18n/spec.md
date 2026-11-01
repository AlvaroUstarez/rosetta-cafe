# Delta for i18n

## ADDED Requirements

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

## MODIFIED Requirements

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
