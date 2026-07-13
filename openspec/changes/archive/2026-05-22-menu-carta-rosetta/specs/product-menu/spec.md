# Delta for product-menu

## ADDED Requirements

### Requirement: Sub-Category Dividers

The Café section MUST display sub-category dividers as `<h3>` elements. Sub-categories are: Calientes, Fríos, Adicionales, Especiales. Products MUST be grouped under their respective sub-category heading. The Sin Café section SHOULD also display sub-categories: Infusiones, Jugos, Licuados, Otras opciones.

#### Scenario: Café section groups products by sub-category

- GIVEN the Café section is visible
- WHEN inspecting the section content
- THEN sub-category headings for "Calientes", "Fríos", "Adicionales", and "Especiales" are displayed
- AND products appear under their matching sub-category heading

#### Scenario: Section without sub-categories

- GIVEN a section like "Pastelería y Panadería"
- WHEN inspecting the section content
- THEN no sub-category headings are rendered
- AND all products display in a flat grid

### Requirement: Section Visual Identity

Each menu section header MUST have a distinct visual treatment. The header MUST display the section name prominently. Headers SHOULD alternate background color or use a decorative element from the warm color palette to visually separate stacked sections.

#### Scenario: Section header is visually distinct

- GIVEN a menu section is visible
- WHEN inspecting the section header
- THEN the section name is displayed as a prominent heading
- AND the header has a visually distinct background from adjacent sections

#### Scenario: Protocolo section renders as informational block

- GIVEN the Protocolo section
- WHEN the section renders
- THEN it displays Pet Friendly informational text
- AND no product cards are rendered inside it

## MODIFIED Requirements

### Requirement: Sticky Nav Section Navigation

(Previously: CSS-only tabs using `input:checked` technique with 3 mock categories)

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

### Requirement: Typed Menu Data

(Previously: typed mock data with 3 categories and 2+ mock products each)

The system MUST define menu data in `src/data/menu.ts`. The `Product` type MUST include fields: `id`, `name`, `description`, `price`, `category`, `image` (placeholder), and `subCategory` (optional string). The data array MUST contain real Carta Rosetta products (~60+ items) across 6 categories: Café, Sin Café, Pastelería y Panadería, Opciones Saladas, Menús, Promos. A standalone `protocolo` config entry MUST exist outside the product array.

#### Scenario: Data type includes sub-category field

- GIVEN the TypeScript file `src/data/menu.ts`
- WHEN inspecting the `Product` type
- THEN it includes an optional `subCategory: string` field
- AND all original fields (`id`, `name`, `description`, `price`, `category`, `image`) are present

#### Scenario: Real data covers all sections

- GIVEN the menu data module
- WHEN counting products per category
- THEN at least 6 categories are represented
- AND the total product count is approximately 60 or more
- AND Café products populate all four sub-categories

## REMOVED Requirements

None.
