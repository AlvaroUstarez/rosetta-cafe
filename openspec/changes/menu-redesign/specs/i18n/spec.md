# Delta for i18n

## ADDED Requirements

### Requirement: Locale Alternates and Document Head Metadata

`src/layouts/BaseLayout.astro` MUST emit, on both pages, a `meta description` in the page's locale; the Open Graph tags `og:title`, `og:description`, `og:image`, and `og:locale`; a Twitter card tag; a `meta name="theme-color"`; and `link rel="alternate"` elements declaring `hreflang="es"` and `hreflang="en"`, plus a self-referencing alternate for the page's own locale. The ES page's `hreflang="es"` alternate MUST point to `/` and its `hreflang="en"` alternate to `/en/`; the EN page MUST declare those same two targets. `og:locale` MUST identify the page's own locale and MUST therefore differ between the two pages. `og:image` MUST reference the hero photograph as emitted by the build, and the referenced file MUST exist in `dist/`. `theme-color` MUST be the page-field colour of the palette, `#F7F3EC`. The description and title strings MUST resolve from `src/i18n/{locale}.json` through `t(key, locale)`, so the key-parity contract holds and no head string is hardcoded in the layout. A canonical link MAY be emitted once a production origin is configured; it is not required by this change.

#### Scenario: Spanish page emits localized head metadata

- GIVEN the built page `dist/index.html`
- WHEN inspecting its `<head>`
- THEN a non-empty `meta name="description"` is present and written in Spanish
- AND `og:title`, `og:description`, `og:image`, `og:locale`, and a Twitter card tag are present
- AND `og:locale` identifies the Spanish locale

#### Scenario: English page emits its own localized metadata

- GIVEN the built page `dist/en/index.html`
- WHEN inspecting its `<head>`
- THEN a non-empty `meta name="description"` is present and written in English
- AND it differs from the Spanish description
- AND `og:locale` identifies the English locale and differs from the Spanish page's value

#### Scenario: hreflang alternates on both pages

- GIVEN either built page
- WHEN inspecting its `link rel="alternate"` elements
- THEN an alternate with `hreflang="es"` points to `/`
- AND an alternate with `hreflang="en"` points to `/en/`
- AND an alternate whose `hreflang` equals the page's own locale is present

#### Scenario: Theme colour comes from the palette

- GIVEN either built page
- WHEN inspecting `meta name="theme-color"`
- THEN its value is `#F7F3EC`
- AND the same value is declared as the page-field token in `src/styles/global.css`

#### Scenario: Social image is the optimized hero

- GIVEN either built page
- WHEN inspecting `og:image`
- THEN it references an image asset emitted by the build rather than the unprocessed source in `public/`
- AND the referenced file exists in `dist/`

#### Scenario: Head strings resolve via i18n

- GIVEN `src/layouts/BaseLayout.astro` and the two locale files
- WHEN inspecting where the description and title strings come from
- THEN each is produced by `t(key, locale)`
- AND the same keys exist in both `es.json` and `en.json`
- AND no head string is written inline in the layout

## MODIFIED Requirements

### Requirement: UI Translation Files

(Previously: the files were required to hold UI strings including nav labels and the protocolo heading, which left four dead keys — `footer.location.text` was never rendered and `nav.es`, `nav.en`, and `protocolo.title` duplicated strings sourced elsewhere)

The system MUST store UI translations in `src/i18n/{locale}.json` files. Each JSON file MUST contain a flat key-value mapping for UI chrome strings — hero, footer, section nav, document head metadata, empty states, and similar interface text. The keys MUST be identical across locales: no key MAY exist in one locale only. Every stored key MUST be referenced by at least one component through `t(key, locale)`; a key with no use site MUST NOT be stored, and a string a component renders MUST NOT be inlined where a key exists. The `footer.location.text` key and the document-head description and title keys MUST be present in both locales and MUST be rendered on both pages. Menu content MUST NOT be stored in these files: product names, descriptions, category labels, sub-category labels, and the protocolo entry stay as inline `{ es, en }` records in `src/data/menu.ts`, resolved with `tRecord(value, locale)`. The two systems MUST NOT be mixed.

#### Scenario: Translation keys match across locales

- GIVEN the JSON files `es.json` and `en.json`
- WHEN comparing their top-level keys
- THEN both files have the same set of keys
- AND no key is missing in either locale

#### Scenario: No dead key remains

- GIVEN the two locale files and the components that consume them
- WHEN searching each stored key for a use site in `src/`
- THEN every key is referenced through `t(key, locale)` at least once
- AND no key exists only to duplicate a string that another source already owns

#### Scenario: Footer location resolves from the locale files

- GIVEN the built page in either locale
- WHEN inspecting the rendered footer location text
- THEN its value equals the `footer.location.text` entry of that locale
- AND the string is not written inline in `src/components/Footer.astro`

#### Scenario: Language codes are derived, not stored

- GIVEN `src/components/SectionNav.astro` and the two locale files
- WHEN inspecting how the "ES" and "EN" labels are produced
- THEN they are derived from the `locale` prop
- AND no `nav.es` or `nav.en` key exists in either locale file

#### Scenario: Protocolo heading is not duplicated in i18n

- GIVEN the two locale files and `src/data/menu.ts`
- WHEN inspecting the Protocolo heading
- THEN it resolves from the `protocolo` entry in `menu.ts`
- AND no `protocolo.title` key exists in either locale file

#### Scenario: Menu content is not stored in the translation files

- GIVEN the two locale files
- WHEN searching them for product names, descriptions, category labels, and sub-category labels
- THEN none of those strings appear
- AND they are present only as inline `{ es, en }` records in `src/data/menu.ts`
