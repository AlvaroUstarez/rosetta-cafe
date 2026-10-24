# Delta for Product Menu

## MODIFIED Requirements

### Requirement: Product Cards

(Previously: each product was a card — cream container, 12px radius, soft shadow, identical hover lift, a fixed 180px image box with `object-fit: cover`, a `categoryGradients` `<div>` fallback revealed by an inline `onerror`, and a raw `<img>` served from `public/`; name and description were described as resolved via `t(...)`)

Each product cell MUST display the product's photograph when it has one, its name and description resolved via `tRecord(record, locale)`, and its price. A cell MUST NOT be rendered as a card: no background container, border-radius, or box-shadow MAY be applied, and the photograph MUST be separated from its text by exactly one hairline rule. The photograph MUST render at its own intrinsic aspect ratio, and a fixed image-box height with `object-fit: cover` MUST NOT be applied to it. A product with a photograph MUST render an image emitted by the build pipeline — an `astro:assets` `<Image>` or `<Picture>` — carrying responsive `srcset`, `sizes`, and intrinsic `width` and `height`; a raw `<img>` pointing at a file in `public/images/products/` MUST NOT be used. A product with `image = ""` MUST render a flat glaze tile: one ungraded fill from the glaze library plus a 1px inner rim. A gradient tile MUST NOT be rendered, no `linear-gradient` MAY appear in a cell's background, and no `<img>` element MAY be emitted for an imageless product. A cell MUST NOT emit an inline `onerror` handler or a hidden duplicate fallback node. Prices MUST be right-aligned and MUST set `font-variant-numeric: tabular-nums`; the dotted leader of the text-list rows MUST be preserved. A cell MUST NOT apply a hover lift, scale, or shadow transition, and no non-user-triggered motion MAY be added.

#### Scenario: Cell renders with a real photograph

- GIVEN a product whose `image` is a non-empty imported image module
- WHEN its cell is rendered into the built page
- THEN an `<img>` or `<picture>` element is emitted with `srcset`, `sizes`, `width`, and `height`
- AND the rendered aspect ratio equals the asset's intrinsic ratio
- AND the translated name, description, and price are rendered below it

#### Scenario: Cell renders a glaze tile for an imageless product

- GIVEN a product with `image = ""`
- WHEN its cell is rendered
- THEN a flat fill from the glaze library occupies the image area with a 1px inner rim
- AND no `<img>` element is rendered for it
- AND no `linear-gradient` value appears in the cell's background declarations

#### Scenario: Cell is not a card

- GIVEN any product cell in the built page
- WHEN inspecting its container rules
- THEN no background colour, border-radius, or box-shadow is applied to the cell container
- AND exactly one hairline rule separates the photograph or glaze tile from the text

#### Scenario: Cell renders with translated fields

- GIVEN a product exists in a category and `locale = "en"`
- WHEN its cell renders
- THEN the product name and description are the English values of their inline records
- AND the price is formatted with its currency symbol
- AND the image area renders a photograph or a glaze tile per the `image` value

#### Scenario: No hover lift and no added motion

- GIVEN a product cell is displayed
- WHEN the user hovers over it
- THEN no transform, scale, or shadow transition is applied
- AND no entrance animation runs on load or on scroll

#### Scenario: Money column is aligned

- GIVEN the product cells of a section
- WHEN inspecting the rendered prices
- THEN each price sets `font-variant-numeric: tabular-nums`
- AND each price is right-aligned within its cell
- AND text-list rows keep their dotted leader between the name and the price

#### Scenario: No runtime image fallback is emitted

- GIVEN the built page for a product that has a photograph
- WHEN inspecting its cell markup
- THEN exactly one image node is present
- AND no `onerror` attribute and no hidden duplicate fallback node is emitted

### Requirement: Responsive Product Grid

(Previously: the grid mandated 1 / 2 / 3 uniform columns with consistent cell height, which is incompatible with aspect-preserving photographs)

Products MUST be laid out using CSS Grid. On mobile (below 768px) cells MUST display in a single column. On tablet (768px and above) the grid MUST render at least 2 columns. On desktop (1024px and above) the grid MUST render at least 3 columns. The grid MUST NOT mandate equal cell height: each cell's height MUST be derived from its own photograph's aspect ratio and its own text, so cells in the same row MAY differ in height. The grid MUST NOT set a fixed row height and MUST NOT stretch a photograph to fill a row. The exact column count above the stated minimums, and any asymmetry between cells, are design-phase decisions. The grid MUST NOT overflow horizontally at 375px.

#### Scenario: Single column on mobile

- GIVEN a viewport width of 375px
- WHEN the product grid renders
- THEN each product cell takes the full width of the container
- AND cells stack vertically
- AND no horizontal overflow occurs

#### Scenario: Multi-column grid on desktop

- GIVEN a viewport width of 1280px
- WHEN the product grid renders
- THEN the grid renders at least 3 columns
- AND no cell is stretched to a fixed row height

#### Scenario: Cells keep their own height

- GIVEN a row of cells whose photographs have different aspect ratios and whose descriptions differ in length
- WHEN the row renders
- THEN each cell's height follows its own photograph and text
- AND cells in the same row are not forced to a common height

#### Scenario: Tablet keeps at least two columns

- GIVEN a viewport width of 768px
- WHEN the product grid renders
- THEN at least 2 columns are rendered

### Requirement: Typed Menu Data

(Previously: `Product.image` was a string path starting with `/` served from `public/`; `categoryGradients: Record<Category, string>` held six linear gradients; the product count was stated as ~88 against a reality of 94)

The system MUST define menu data in `src/data/menu.ts`. The `Product` type MUST include: `id`, `name` (`{ es, en }`), `description` (`{ es, en }`), `price`, `category`, `image`, and `subCategory` (optional). `Product.image` MUST be either `""` or a statically imported image module (an `ImageMetadata` value) so the build can optimize it; it MUST NOT be a string path into `public/`, because files served from `public/` are served raw and cannot be optimized. The imageless fill MUST live in `src/data/category-visual.ts` as a glaze-token map keyed by every `Category` value, holding flat ungraded swatch values sampled from colours measured in the product photography — 4 to 5 distinct swatches drawn from the ochre/gold family, the brand green as an object colour, the ceramic light `#d8d2bf`, and the walnut dark `#5b3c2b`. The former `categoryGradients: Record<Category, string>` and every `linear-gradient` string MUST be removed, and the map MUST cover all 6 categories so no cell can resolve an undefined fill. The `MenuCategory` type MUST have `label` as `{ es, en }` and `subCategories` as `{ es: string[], en: string[] }`, with both locale arrays in the same order. Data MUST contain 94 products across 6 categories; 31 currently carry a photograph and 63 have `image = ""`. The count of imageless products MAY decrease only by assigning a photograph, never by removing a product or a category. A standalone `protocolo` config entry MUST exist with multilingual `title` and `content`. Menu content MUST stay as inline `{ es, en }` records in this module and MUST be resolved with `tRecord(value, locale)`; it MUST NOT be moved into `src/i18n/{locale}.json`, and UI chrome strings MUST NOT be inlined here.

#### Scenario: Product type with new image semantics

- GIVEN `src/data/menu.ts`
- WHEN inspecting the `Product` type
- THEN `image` is typed as `""` or an imported image module
- AND no product declares a string path into `public/`
- AND all original fields (`id`, `name`, `description`, `price`, `category`, `subCategory`) are present

#### Scenario: Glaze library replaces the gradients

- GIVEN `src/data/category-visual.ts`
- WHEN inspecting its exports
- THEN a glaze-token map covers all 6 `Category` values
- AND each entry is a flat, ungraded fill value
- AND no `linear-gradient` string remains in the module or anywhere under `src/`

#### Scenario: MenuCategory supports two languages

- GIVEN `src/data/menu.ts`
- WHEN inspecting `MenuCategory`
- THEN `label` is `{ es: string, en: string }`
- AND `subCategories` is `{ es: string[], en: string[] }`
- AND both locale arrays hold the same number of entries in the same order

#### Scenario: Real data covers all sections with image assignments

- GIVEN the menu data module
- WHEN counting products
- THEN 6 categories and 94 products are present
- AND 31 products hold an imported image module
- AND 63 products have `image = ""`
- AND no product has an undefined or empty-string path that resolves to a `public/` URL

#### Scenario: The two translation systems stay separate

- GIVEN `src/data/menu.ts` and `src/i18n/{es,en}.json`
- WHEN inspecting where each string lives
- THEN product names, descriptions, category labels, sub-category labels, and the protocolo entry are inline `{ es, en }` records in `menu.ts`
- AND UI chrome strings live only in the locale JSON files
- AND menu content is resolved with `tRecord(value, locale)` and chrome strings with `t(key, locale)`
- AND no product string appears in the locale JSON files

### Requirement: Section Visual Identity

(Previously: section headers SHOULD alternate background colour or use a decorative element, which produced one flat green rectangle per section — both `:nth-child` fallbacks were unreachable — and every section already failed the "visually distinct background" scenario)

Each menu section MUST be introduced by a header that displays the section name prominently via `t(section, locale)`, set in the text-safe green `#4E6B44` on a single hairline rule that spans the content column and is broken by the label. Menu sections MUST NOT paint a per-section background: no section MAY set a background colour or a `--section-accent` custom property, and adjacent sections MUST be distinguishable by the rule and the label alone rather than by a background block or a colour alternation. Sub-category headings MUST use a lighter rule weight than category headings, and MUST set the same `#4E6B44` label colour. The Protocolo section MUST follow the same rule-and-label treatment and MUST NOT render product cells.

#### Scenario: Section header renders locale-aware name

- GIVEN a menu section is visible
- WHEN inspecting the section header
- THEN the section name is displayed in the current locale
- AND the name is set in `#4E6B44` on a hairline rule that the label interrupts
- AND no background colour is declared on the section or its header

#### Scenario: Adjacent sections are distinguishable without a background block

- GIVEN two adjacent sections in the built page
- WHEN comparing their headers
- THEN each renders its own rule and its own label
- AND neither section declares a background colour
- AND `--section-accent` appears in no page or component

#### Scenario: Sub-category headings carry less weight than the category heading

- GIVEN a section that has sub-categories
- WHEN comparing the category heading's rule with a sub-category heading's rule
- THEN the sub-category rule is lighter
- AND both labels use the same `#4E6B44` colour

#### Scenario: Protocolo section renders translated content

- GIVEN the Protocolo section and `locale = "en"`
- WHEN the section renders
- THEN it displays the English Pet Friendly informational text
- AND it uses the same rule-and-label treatment as the other sections
- AND no product cells are rendered inside it
