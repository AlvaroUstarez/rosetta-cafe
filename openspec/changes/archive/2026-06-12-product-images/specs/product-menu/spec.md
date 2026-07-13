# Delta for Product Menu

## MODIFIED Requirements

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

### Requirement: Typed Menu Data

The system MUST define menu data in `src/data/menu.ts`. The `Product` type MUST include: `id`, `name` (`{ es, en }`), `description` (`{ es, en }`), `price`, `category`, `image` (path starting with `/` or `""` for fallback), and `subCategory` (optional). Gradient constants MUST live in `src/data/category-visual.ts` as `categoryGradients: Record<Category, string>`. The `MenuCategory` type MUST have `label` as `{ es, en }` and `subCategories` as `{ es: string[], en: string[] }`. Data MUST contain ~88 products across 6 categories.
(Previously: gradient constants were in menu.ts; Product.image held gradient strings)

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
