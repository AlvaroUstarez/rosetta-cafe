# Delta for product-menu

## MODIFIED Requirements

### Requirement: Typed Menu Data

The system MUST define menu data in `src/data/menu.ts`. The `Product` type MUST include fields: `id`, `name` (`{ es: string, en: string }`), `description` (`{ es: string, en: string }`), `price`, `category`, `image` (placeholder), and `subCategory` (optional string). The `MenuCategory` type MUST have `label` as `{ es: string, en: string }` and `subCategories` as `{ es: string[], en: string[] }`. The data array MUST contain real Carta Rosetta products (~88 items) across 6 categories. A standalone `protocolo` config entry MUST exist with multilingual `title` and `content`.
(Previously: Product.name and Product.description were plain strings; MenuCategory.label was a plain string; subCategories was string[]; protocolo was plain strings)

#### Scenario: Product type supports two languages

- GIVEN the TypeScript file `src/data/menu.ts`
- WHEN inspecting the `Product` type
- THEN `name` is of type `{ es: string, en: string }`
- AND `description` is of type `{ es: string, en: string }`
- AND all original fields (`id`, `price`, `category`, `image`, `subCategory`) are present

#### Scenario: MenuCategory supports two languages

- GIVEN the TypeScript file `src/data/menu.ts`
- WHEN inspecting the `MenuCategory` type
- THEN `label` is of type `{ es: string, en: string }`
- AND `subCategories` is of type `{ es: string[], en: string[] }`

#### Scenario: Real data covers all sections

- GIVEN the menu data module
- WHEN counting products per category
- THEN at least 6 categories are represented
- AND the total product count is approximately 88
- AND data for both `es` and `en` variants is present for name, description, and label fields

### Requirement: Product Cards

Each product card MUST display a photo placeholder (gradient background), product name and description resolved via `t(product, locale)`, and price. Cards MUST use a consistent layout: image on top, text content below. Cards SHOULD have a subtle hover effect (scale or shadow transition).
(Previously: name and description were plain strings rendered directly)

#### Scenario: Card renders with translated fields

- GIVEN a product exists in a category and `locale = "en"`
- WHEN its card renders
- THEN the product name is the English translation
- AND the description text is the English translation
- AND the price is formatted with currency symbol
- AND a visual placeholder occupies the image area

#### Scenario: Card hover interaction

- GIVEN a product card is displayed
- WHEN the user hovers over the card
- THEN a subtle visual feedback occurs (lift/shadow/scale transition)

### Requirement: Empty Category State

The system SHOULD display a locale-aware friendly message when a category has no products. The empty state MAY include an icon or illustration to soften the experience. The message MUST come from the i18n translation files.
(Previously: empty message was hardcoded in Spanish as "Próximamente")

#### Scenario: Empty category shows locale-aware message

- GIVEN a category with zero products and `locale = "en"`
- WHEN that category tab is selected
- THEN a translated message like "Coming soon" is displayed
- AND no grid or cards are rendered for that category

### Requirement: Sub-Category Dividers

The Café section MUST display sub-category dividers as `<h3>` elements. Sub-category headings MUST resolve via `t(record, locale)`. Products MUST be grouped under their respective sub-category heading.
(Previously: sub-category names were hardcoded Spanish strings: Calientes, Fríos, Adicionales, Especiales)

#### Scenario: Café section groups products by sub-category in correct locale

- GIVEN the Café section is visible and `locale = "en"`
- WHEN inspecting the section content
- THEN sub-category headings for "Hot", "Cold", "Add-ons", and "Specials" are displayed
- AND products appear under their matching sub-category heading

#### Scenario: Section without sub-categories

- GIVEN a section like "Pastelería y Panadería"
- WHEN inspecting the section content
- THEN no sub-category headings are rendered
- AND all products display in a flat grid

### Requirement: Section Visual Identity

Each menu section header MUST have a distinct visual treatment. The header MUST display the section name prominently via `t(section, locale)`. Headers SHOULD alternate background color or use a decorative element from the warm color palette to visually separate stacked sections.
(Previously: section names were plain strings)

#### Scenario: Section header renders locale-aware name

- GIVEN a menu section is visible
- WHEN inspecting the section header
- THEN the section name is displayed in the current locale
- AND the header has a visually distinct background from adjacent sections

#### Scenario: Protocolo section renders translated content

- GIVEN the Protocolo section and `locale = "en"`
- WHEN the section renders
- THEN it displays the English Pet Friendly informational text
- AND no product cards are rendered inside it
