# Product Menu Specification

## Purpose

Define el menú de productos de Rosetta Café organizado por categorías. Cada categoría es una sección apilada, alcanzable desde una barra de navegación sticky que funciona sin JavaScript. Los productos se renderizan como filas de un ledger —una fila por producto, con miniatura opcional, nombre, descripción y precio— sobre los datos reales de `src/data/menu.ts`.

## Requirements

### Requirement: Sticky Nav Section Navigation

The system MUST provide a sticky horizontal navigation bar linking to vertically stacked sections via `href="#section-id"`, with each section carrying the corresponding `id` and enough `scroll-margin-top` to clear the sticky bar. The nav MUST work without JavaScript. The nav MUST render its label from `nav.label` and MUST NOT paint a translucent background over the content beneath it.

The nav MAY mark the section currently in view by setting `aria-current="true"` on the corresponding link, using an `IntersectionObserver`. That marking MUST be progressive enhancement: with JavaScript disabled, every link MUST still navigate correctly and no link MUST be left in a stale active state.

The active marker MUST be drawn as a 2px bottom border in `--terracotta` beneath a label in `--ink`. The language switcher's hover colour MUST resolve to `--green-ink`.

(Previously: the requirement did not address the nav's background opacity, its localized label, or an active-section marker; later it left the marker's colour unspecified, which resolved to the retired brass token)

#### Scenario: First section visible on load

- GIVEN the menu renders
- WHEN the page loads
- THEN the Café section is at the top of the menu area
- AND the sticky nav displays links to all sections

#### Scenario: Navigate via sticky nav

- GIVEN the sticky nav is visible
- WHEN the user clicks a nav link for a different section
- THEN the page scrolls to that section
- AND the section is offset to clear the nav height

#### Scenario: Active section is marked

- GIVEN the user has scrolled so that a section occupies the middle of the viewport
- WHEN the scroll-spy settles
- THEN that section's link carries `aria-current="true"`
- AND no other link carries it
- AND its bottom border resolves to `--terracotta`

#### Scenario: No-JavaScript fallback

- GIVEN JavaScript is disabled in the browser
- WHEN the user clicks a nav link
- THEN the browser scrolls natively to the target section via HTML anchor behaviour
- AND no link carries an active marker

#### Scenario: Nav ground is opaque

- GIVEN the nav is stuck at the top of the viewport with content scrolling beneath it
- WHEN inspecting the nav's computed background
- THEN it resolves to the opaque page background
- AND no backdrop filter is applied

### Requirement: Product Ledger Rows

Each product MUST render as a single ledger row inside a `<ul role="list">`, as an `<li>` element. A row MUST display the product name resolved via `tRecord(product.name, locale)`, its price formatted for the active locale, and its description resolved via `tRecord(product.description, locale)` when that description is non-empty. A row MUST NOT be rendered as a card: no background colour, border-radius, or box-shadow MAY be applied to the row container, and no hover transform, scale, or shadow transition MAY be applied.

The name and the price MUST share a two-column grid — `minmax(0, 1fr) auto` with `align-items: baseline` — so the price baseline follows the name's first line regardless of description length. The price MUST be right-aligned, MUST set `font-variant-numeric: tabular-nums`, MUST NOT wrap, and MUST resolve to `--terracotta-ink`.

A product with a non-empty `image` MUST render its photograph through the build pipeline — an `astro:assets` `<Image>` — inside a square box carrying intrinsic `width`/`height`, a `srcset`, and `sizes`, with the image filling it via `object-fit: cover` and no shape mask. A raw `<img>` pointing at a file in `public/images/products/` MUST NOT be used. The thumbnail MUST carry `alt=""` because the product name is adjacent and visible in the same row. A product with `image = ""` MUST render no image element and no decorative substitute: either an empty cell reserved for alignment, or no cell at all, per the `Sub-Category Dividers` requirement.

The thumbnail box MUST have square corners: `border-radius` MUST resolve to `0`. The absence of a shape mask applies to the thumbnail box, not to the row: the row MUST remain a full-width band with no radius of its own.

(Previously: this content lived under "Product Cards" — cream container, 12px radius, soft shadow, identical hover lift, a fixed 180px image box with `object-fit: cover`, a `categoryGradients` `<div>` fallback, and an image-on-top/text-below layout. Later, the thumbnail was a square box with no shape mask, then a circle masked by `border-radius: 50%`, and the price's colour was unspecified, so it inherited `--ink`)

#### Scenario: Row renders with a photograph

- GIVEN a product whose `image` is a non-empty imported image module
- WHEN its row is rendered into the built page
- THEN an `<img>` element is emitted inside a square box with `srcset`, `sizes`, `width`, and `height`
- AND the thumbnail carries an empty `alt`
- AND the translated name, description, and price are rendered in the row body

#### Scenario: Thumbnail is a square

- GIVEN a row that displays a thumbnail
- WHEN inspecting the thumbnail box
- THEN `border-radius` resolves to `0`
- AND the image fills the box with `object-fit: cover`
- AND the row container itself carries no border-radius

#### Scenario: Price carries the money accent

- GIVEN any row with a non-zero price
- WHEN inspecting the price element
- THEN its colour resolves to `--terracotta-ink`
- AND it is right-aligned, sets `tabular-nums`, and does not wrap

#### Scenario: Row renders without a photograph

- GIVEN a product with `image = ""` inside a group that has at least one photograph
- WHEN its row is rendered
- THEN no `<img>` element is emitted for it
- AND an empty thumbnail cell is reserved so the text column stays aligned with its siblings
- AND the cell is hidden from assistive technology

#### Scenario: Row is not a card

- GIVEN any product row in the built page
- WHEN inspecting its container rules
- THEN no background colour, border-radius, or box-shadow is applied
- AND a single hairline rule separates it from the next row

#### Scenario: No hover lift and no added motion

- GIVEN a product row is displayed
- WHEN the user hovers over it
- THEN no transform, scale, or shadow transition is applied
- AND no entrance animation runs on load or on scroll

#### Scenario: Money column is aligned

- GIVEN the product rows of a section
- WHEN inspecting the rendered prices
- THEN each price sets `font-variant-numeric: tabular-nums`
- AND each price is right-aligned and does not wrap
- AND the prices form one continuous column down the section

#### Scenario: Zero-price product reads as free

- GIVEN a product whose `price` is `0`
- WHEN its row renders
- THEN the price cell reads "Gratis" in `es` and "Free" in `en`
- AND no currency symbol is rendered

### Requirement: Ledger Row Layout

Products MUST be laid out as a single column of full-width rows at every breakpoint. A multi-column product grid MUST NOT be used, and equal cell height MUST NOT be required. Rows MUST stack vertically inside their sub-category group and MUST NOT be wrapped into columns on tablet or desktop.

A row that displays a thumbnail MUST reserve a fixed thumbnail column — `--thumb` (5rem) on desktop and 4rem at widths of 480px and below, declared once as a token in `src/styles/global.css` — with the text occupying the remaining width. A row without a thumbnail column MUST let its text span the full row width.

(Previously: "Responsive Product Grid" mandated CSS Grid with 1 column on mobile, 2 at ≥768px, and 3 at ≥1024px, with consistent cell height across a row)

#### Scenario: Single column at every breakpoint

- GIVEN viewport widths of 375px, 768px, and 1280px
- WHEN the menu renders at each width
- THEN rows stack vertically in one column at all three widths
- AND no row is placed beside another row

#### Scenario: Thumbnail column is fixed

- GIVEN a group whose rows display thumbnails
- WHEN inspecting the row grid at 1280px and at 375px
- THEN the thumbnail column measures 5rem and 4rem respectively
- AND the text occupies the remaining width without overflow

#### Scenario: Group without photographs uses the full width

- GIVEN a group in which no product has a photograph
- WHEN its rows render
- THEN no thumbnail column is reserved
- AND each row's text spans the full width

### Requirement: Typed Menu Data

The system MUST define menu data in `src/data/menu.ts`. The `Product` type MUST include: `id`, `name` (`{ es, en }`), `description` (`{ es, en }`), `price`, `category`, `image` (an imported image module for products with a photograph, or `""` for products without), and `subCategory` (optional). The `MenuCategory` type MUST have `label` as `{ es, en }` and an optional `subCategories` as `{ es: string[], en: string[] }`. Data MUST contain 94 products across 6 categories. A standalone `protocolo` config entry MUST exist with multilingual `title` and `content`. A product's `category` MUST match an `id` in `categories`. The two `subCategories` arrays MUST stay parallel, index for index.

No visual-decor module MAY be required by the menu data: `src/data/category-visual.ts` and its `categoryGradients` map MUST NOT exist, and no gradient value MAY appear in the data layer. The `MenuCategory` type MUST NOT carry a `listSubCategories` field.

(Previously: `categoryGradients: Record<Category, string>` was mandated in `src/data/category-visual.ts`; `MenuCategory` carried a `listSubCategories` field; the product count was stated as ~88; `Product.image` was a path or `""`)

#### Scenario: Product type carries image modules

- GIVEN `src/data/menu.ts`
- WHEN inspecting the `Product` type
- THEN `image` is typed to accept either an imported image module or `""`
- AND all original fields (`id`, `name`, `description`, `price`, `category`, `subCategory`) are present

#### Scenario: No decorative module is required

- GIVEN the repository
- WHEN listing `src/data/`
- THEN `category-visual.ts` does not exist
- AND no module exports `categoryGradients`
- AND no gradient value is declared in `menu.ts`

#### Scenario: MenuCategory drops the unused list field

- GIVEN `src/data/menu.ts`
- WHEN inspecting `MenuCategory`
- THEN `label` is `{ es: string, en: string }`
- AND `subCategories` is optional and typed `{ es: string[], en: string[] }`
- AND no `listSubCategories` field is declared

#### Scenario: Real data covers all sections

- GIVEN the menu data module
- WHEN counting products
- THEN 6 categories are represented with 94 total products
- AND every product's `category` matches an id in `categories`
- AND products with available photographs hold a non-empty image module
- AND products without photographs hold `image = ""`

### Requirement: Empty Category State

The system SHOULD display a locale-aware friendly message when a category has no products. The empty state MAY include an icon or illustration to soften the experience. The message MUST come from the i18n translation files.
(Previously: empty message was hardcoded in Spanish as "Próximamente")

#### Scenario: Empty category shows locale-aware message

- GIVEN a category with zero products and `locale = "en"`
- WHEN that section is reached
- THEN a translated message like "Coming soon" is displayed
- AND no product rows are rendered for that section

### Requirement: Sub-Category Dividers

A section that declares sub-categories MUST display them as `<h3>` elements resolved via `tRecord(record, locale)`, and each product MUST appear under the heading matching its `subCategory`. A sub-category with no products MUST NOT render a heading. A section that declares no sub-categories MUST render its products as one flat group with no `<h3>`.

The thumbnail column MUST be decided per sub-category group, not per row: a group MUST display thumbnails for its rows when at least one product in that group has a photograph, and MUST reserve an empty cell for the rows that have none. A group in which no product has a photograph MUST NOT reserve the column.

(Previously: dividers were `<h3>` elements resolved via `t(record, locale)`; the section without sub-categories was required to render "all products in a flat grid", and no photo-column rule existed)

#### Scenario: Section groups products by sub-category in the correct locale

- GIVEN the Café section is visible and `locale = "en"`
- WHEN inspecting the section content
- THEN sub-category headings "Hot", "Cold", "Add-ons", and "Specials" are displayed
- AND products appear under the heading matching their `subCategory`

#### Scenario: Empty sub-category renders no heading

- GIVEN a declared sub-category whose product list is empty
- WHEN the section renders
- THEN no `<h3>` is emitted for it

#### Scenario: Section without sub-categories

- GIVEN a section that declares no sub-categories
- WHEN inspecting the section content
- THEN no sub-category headings are rendered
- AND all its products render as one flat group of rows

#### Scenario: Photo column follows the group, not the row

- GIVEN a group with 3 products, one of which has a photograph
- WHEN the group renders
- THEN all 3 rows reserve the thumbnail column
- AND the 2 rows without a photograph render an empty hidden cell

### Requirement: Section Visual Identity

Each menu section MUST be delimited by a hairline rule at its top edge and identified by its name resolved via `tRecord(section.label, locale)` as an `<h2>`. A section MUST NOT paint a background block, and adjacent sections MUST NOT be distinguished by alternating background colours. Section identity MUST come from the rule and the label only. A section MUST NOT receive a per-section accent value from the page.

Sub-category headings MUST resolve to `--green-ink`.

The protocolo section MUST render its content as a note — a 2px left border in `--green` over the `--wash` ground — and MUST NOT render product rows or a duplicated heading.

(Previously: headers were required to "alternate background color or use a decorative element from the warm color palette to visually separate stacked sections", and pages passed a `sectionAccent` to every section. Later, the protocolo note's border was described only as "a left border in the accent colour" and sub-category headings had no specified colour; both resolved to the retired brass tokens)

#### Scenario: Section header renders locale-aware name

- GIVEN a menu section is visible
- WHEN inspecting the section header
- THEN the section name is displayed in the current locale as an `<h2>`
- AND the section is separated from the previous one by a hairline rule
- AND no background colour is applied to the section

#### Scenario: Sections are not colour-coded

- GIVEN two adjacent sections
- WHEN comparing their computed backgrounds
- THEN both resolve to the same page background
- AND neither section carries a per-section accent value

#### Scenario: Sub-category headings carry the green

- GIVEN a section that declares sub-categories
- WHEN inspecting an `<h3>` heading
- THEN its colour resolves to `--green-ink`
- AND it does not resolve to `--green`

#### Scenario: Protocolo section renders translated content

- GIVEN the Protocolo section and `locale = "en"`
- WHEN the section renders
- THEN it displays the English pet-friendly text once
- AND no product rows are rendered inside it
- AND its left border resolves to `--green`
