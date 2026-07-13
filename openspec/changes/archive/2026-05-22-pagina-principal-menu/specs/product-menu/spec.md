# Product Menu — Delta Spec

## ADDED Requirements

### Requirement: Category Tabs (CSS-only)

The system MUST provide tabs for Café, Pastelería, and Panadería. Switching MUST work without JavaScript via `input:checked`. The active tab MUST be visually distinct. Café MUST be selected by default.

#### Scenario: Default tab on load

- GIVEN the menu renders
- WHEN first viewed
- THEN "Café" tab is active with Café products visible
- AND other categories are hidden

#### Scenario: Switch tab

- GIVEN Café tab is active
- WHEN user clicks "Pastelería" label
- THEN Pastelería products display and Café products hide

#### Scenario: No-JS fallback

- GIVEN JavaScript is disabled
- WHEN the menu renders
- THEN tabs still switch via CSS alone

### Requirement: Product Cards

Each card MUST show a photo placeholder (gradient), product name, brief description, and price. Cards SHOULD have a subtle hover effect.

#### Scenario: Card renders fully

- GIVEN a product exists
- WHEN its card renders
- THEN name, description, price (with currency symbol), and image placeholder are visible

#### Scenario: Hover feedback

- GIVEN a product card
- WHEN the user hovers
- THEN a subtle visual effect occurs (lift/shadow/scale)

### Requirement: Responsive Product Grid

Products MUST use CSS Grid. Mobile: 1 column. Tablet (≥768px): 2 columns. Desktop (≥1024px): 3 columns. Cells MUST have consistent height regardless of description length.

#### Scenario: Mobile single column

- GIVEN a 375px viewport
- WHEN the grid renders
- THEN cards are full width and stack vertically

#### Scenario: Desktop three columns

- GIVEN a 1280px viewport
- WHEN the grid renders
- THEN cards are in 3 equal columns with matching heights

### Requirement: Typed Mock Data

The system MUST define `Product` and `Category` types in `src/data/menu.ts`. Each category MUST have ≥2 mock products.

#### Scenario: Data types defined

- GIVEN `src/data/menu.ts`
- WHEN inspecting exports
- THEN `Product` interface and mock array are exported

#### Scenario: Products per category

- GIVEN the mock data
- WHEN filtering by category
- THEN each category has ≥2 products

### Requirement: Empty Category State

The system SHOULD display a friendly message (e.g., "Próximamente") when a category has no products.

#### Scenario: Empty category handled

- GIVEN a category with zero products
- WHEN that tab is selected
- THEN a friendly empty-state message is shown instead of the grid
