# Product Menu Specification

## Purpose

Define el menú visual de productos de Rosetta Café organizado por categorías. Implementa tabs de categoría sin JavaScript mediante CSS puro (`input:checked`), cards de producto con datos mock, y un grid responsivo que se adapta a mobile, tablet y desktop.

## Requirements

### Requirement: Sticky Nav Section Navigation

The system MUST replace CSS-only tabs with a sticky horizontal navigation bar and vertically stacked sections. The nav MUST use `position: sticky; top: 0` and link to sections via `href="#section-id"`. Each section MUST have a corresponding HTML `id`. Section targets MUST set `scroll-margin-top` to offset the sticky nav height. The nav MUST work without JavaScript.

#### Scenario: First section visible on load

- GIVEN the menu renders
- WHEN the page loads
- THEN the Café section is at the top of the menu area
- AND the sticky nav displays links to all sections

#### Scenario: Navigate via sticky nav

- GIVEN the sticky nav is visible
- WHEN the user clicks a nav link for a different section
- THEN the page scrolls to that section
- AND the section is offset by `scroll-margin-top` to account for nav height

#### Scenario: No-JavaScript fallback

- GIVEN JavaScript is disabled in the browser
- WHEN the user clicks a nav link
- THEN the browser scrolls natively to the target section via HTML anchor behavior

### Requirement: Product Cards

Each product card MUST display a product photo (real image when available, category gradient fallback otherwise), name and description resolved via `t(product, locale)`, and price. Cards MUST use image-on-top, text-below layout. Cards SHOULD have a subtle hover effect. Products with a non-empty `image` field MUST render an `<img>` element. Products with `image = ""` MUST render a `<div>` with the category gradient as `background`.
(Previously: cards always displayed gradient placeholder; Product.image held gradient strings directly)

#### Scenario: Card renders with real image

- GIVEN a product with a non-empty `image` field starting with `/`
- WHEN its card renders
- THEN an `<img>` element fills the image area with `object-fit: cover`
- AND translated name, description, and price are rendered below

#### Scenario: Card renders with gradient fallback

- GIVEN a product with `image = ""`
- WHEN its card renders
- THEN a `<div>` with the category gradient as `background` occupies the image area
- AND no `<img>` element is rendered

#### Scenario: Card renders with translated fields

- GIVEN a product exists in a category and `locale = "en"`
- WHEN its card renders
- THEN the product name and description are the English translations
- AND the price is formatted with currency symbol
- AND the image area renders `<img>` or gradient `<div>` per `image` value

#### Scenario: Card hover interaction

- GIVEN a product card is displayed
- WHEN the user hovers over the card
- THEN a subtle visual feedback occurs (lift/shadow/scale transition)

### Requirement: Responsive Product Grid

Products MUST be laid out using CSS Grid. On mobile, cards MUST display in a single column. On tablet (≥768px), cards MUST display in 2 columns. On desktop (≥1024px), cards MUST display in 3 columns. The grid cells MUST have consistent height regardless of description length.

#### Scenario: Single column on mobile

- GIVEN a viewport width of 375px
- WHEN the product grid renders
- THEN each product card takes full width of the container
- AND cards stack vertically

#### Scenario: Three columns on desktop

- GIVEN a viewport width of 1280px
- WHEN the product grid renders
- THEN cards are arranged in 3 equal-width columns
- AND cards in the same row have equal height

### Requirement: Typed Menu Data

The system MUST define menu data in `src/data/menu.ts`. The `Product` type MUST include: `id`, `name` (`{ es, en }`), `description` (`{ es, en }`), `price`, `category`, `image` (path starting with `/` or `""` for fallback), and `subCategory` (optional). Gradient constants MUST live in `src/data/category-visual.ts` as `categoryGradients: Record<Category, string>`. The `MenuCategory` type MUST have `label` as `{ es, en }` and `subCategories` as `{ es: string[], en: string[] }`. Data MUST contain ~88 products across 6 categories. A standalone `protocolo` config entry MUST exist with multilingual `title` and `content`.
(Previously: Product.name and Product.description were plain strings; MenuCategory.label was a plain string; subCategories was string[]; protocolo was plain strings; gradient constants were in menu.ts; Product.image held gradient strings)

#### Scenario: Product type with new image semantics

- GIVEN `src/data/menu.ts`
- WHEN inspecting the `Product` type
- THEN `image` is `string` — either a path starting with `/images/products/` or `""`
- AND all original fields (`id`, `name`, `description`, `price`, `category`, `subCategory`) are present

#### Scenario: Gradient constants in separate module

- GIVEN `src/data/category-visual.ts`
- WHEN inspecting its exports
- THEN `categoryGradients` maps all 6 `Category` values to gradient strings
- AND no gradient variables remain in `src/data/menu.ts`

#### Scenario: MenuCategory supports two languages

- GIVEN `src/data/menu.ts`
- WHEN inspecting `MenuCategory`
- THEN `label` is `{ es: string, en: string }`
- AND `subCategories` is `{ es: string[], en: string[] }`

#### Scenario: Real data covers all sections with image assignments

- GIVEN the menu data module
- WHEN counting products
- THEN at least 6 categories are represented with ~88 total products
- AND products with available images have non-empty `image` paths (matching filenames in `public/images/products/`)
- AND products without images have `image = ""`

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
