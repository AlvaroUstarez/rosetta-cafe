# Delta for Product Menu

## MODIFIED Requirements

### Requirement: Sticky Nav Section Navigation

The system MUST provide a sticky horizontal navigation bar linking to vertically stacked sections via `href="#section-id"`, with each section carrying the corresponding `id` and enough `scroll-margin-top` to clear the sticky bar. The nav MUST work without JavaScript. The nav MUST render its label from `nav.label` and MUST NOT paint a translucent background over the content beneath it.

The nav MAY mark the section currently in view by setting `aria-current="true"` on the corresponding link, using an `IntersectionObserver`. That marking MUST be progressive enhancement: with JavaScript disabled, every link MUST still navigate correctly and no link MUST be left in a stale active state.

The active marker MUST be drawn as a 2px bottom border in `--terracotta` beneath a label in `--ink`. The language switcher's hover colour MUST resolve to `--green-ink`.

(Previously: the requirement did not name the colours of the active marker or of the language switcher's hover state, both of which resolved to the retired brass tokens)

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

A product with a non-empty `image` MUST render its photograph through the build pipeline — an `astro:assets` `<Image>` — inside a square box carrying intrinsic `width`/`height`, a `srcset`, and `sizes`, masked to a circle by `border-radius: 50%` with the image filling it via `object-fit: cover`. A raw `<img>` pointing at a file in `public/images/products/` MUST NOT be used. The thumbnail MUST carry `alt=""` because the product name is adjacent and visible in the same row. A product with `image = ""` MUST render no image element and no decorative substitute: either an empty cell reserved for alignment, or no cell at all, per the `Sub-Category Dividers` requirement.

The circular mask applies to the thumbnail box, not to the row: the row MUST remain a full-width band with no radius of its own.

(Previously: the thumbnail was a square box with no shape mask, and the price's colour was unspecified — it inherited `--ink`)

#### Scenario: Row renders with a photograph

- GIVEN a product whose `image` is a non-empty imported image module
- WHEN its row is rendered into the built page
- THEN an `<img>` element is emitted inside a square box with `srcset`, `sizes`, `width`, and `height`
- AND the thumbnail carries an empty `alt`
- AND the translated name, description, and price are rendered in the row body

#### Scenario: Thumbnail is a circle

- GIVEN a row that displays a thumbnail
- WHEN inspecting the thumbnail box
- THEN `border-radius` resolves to `50%`
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

### Requirement: Section Visual Identity

Each menu section MUST be delimited by a hairline rule at its top edge and identified by its name resolved via `tRecord(section.label, locale)` as an `<h2>`. A section MUST NOT paint a background block, and adjacent sections MUST NOT be distinguished by alternating background colours. Section identity MUST come from the rule and the label only. A section MUST NOT receive a per-section accent value from the page.

Sub-category headings MUST resolve to `--green-ink`.

The protocolo section MUST render its content as a note — a 2px left border in `--green` over the `--wash` ground — and MUST NOT render product rows or a duplicated heading.

(Previously: the protocolo note's border was described only as "a left border in the accent colour", and sub-category headings had no specified colour; both resolved to the retired brass tokens)

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
