# Delta for Homepage Layout

## MODIFIED Requirements

### Requirement: Hero Section Branding

(Previously: the hero SHOULD occupy the full viewport height and was painted as a full-bleed `background-size: cover` band, which cropped a portrait photograph into a landscape frame)

The homepage MUST display "Rosetta Café de Especialidad" as the primary heading. A tagline or evocative description SHOULD appear below the heading in the current locale. The hero MUST present its photograph at the photograph's own aspect ratio: the image MUST be rendered by the build pipeline as an image element carrying intrinsic `width` and `height` whose ratio equals the source asset's ratio (3024×4032, portrait 3:4), and the photograph MUST NOT be cropped by a frame of a different ratio. The hero MUST NOT be pinned to the viewport height: no `100vh` or `100dvh` value MAY be applied as the hero's height or min-height, and the hero's height MUST derive from its content and the photograph's aspect ratio so that the menu begins within the first viewport on a 1280×720 viewport. The hero photograph MUST be the page's highest-priority image: its rendered element MUST carry an explicit high fetch priority and eager loading, and the hero MUST NOT be delivered as a CSS `background-image`. The hero photograph MUST be processed by the build — responsive `srcset` and `sizes`, a modern output format, and intrinsic dimensions — and the unprocessed `public/` file MUST NOT be the requested source. The exact hero height, the photograph's placement, and its relationship to the heading are design-phase decisions.

#### Scenario: Hero renders with brand identity

- GIVEN the homepage loads
- WHEN the user views the hero section
- THEN the heading "Rosetta Café de Especialidad" is visible
- AND a tagline is present in the correct locale below the heading

#### Scenario: Hero tagline in English

- GIVEN the English page at `/en/`
- WHEN viewing the hero
- THEN the tagline is in English

#### Scenario: Hero responsive on mobile

- GIVEN a viewport width of 375px
- WHEN the homepage renders
- THEN the hero content is readable without horizontal scroll

#### Scenario: Hero photograph is not cropped by a landscape frame

- GIVEN the built homepage at a 1440×900 viewport
- WHEN the hero image element is inspected in `dist/index.html` and its CSS
- THEN the element carries `width` and `height` attributes whose ratio equals the source asset's 3:4 ratio
- AND the container the photograph fills has a matching aspect ratio, so no part of the photograph is discarded
- AND no rule applies a fixed landscape height with `object-fit: cover` to the hero photograph

#### Scenario: Hero is not pinned to the viewport height

- GIVEN `src/components/Hero.astro` and the compiled CSS
- WHEN searching the hero's own declarations for viewport-height units
- THEN no `height`, `min-height`, or `max-height` declaration on the hero uses `100vh` or `100dvh`
- AND the hero's height is derived from its content and the photograph's aspect ratio

#### Scenario: Hero photograph is the priority, optimized image

- GIVEN the built page `dist/index.html`
- WHEN the hero image element is inspected
- THEN it carries `fetchpriority="high"` and eager loading
- AND it is an `<img>` or `<picture>` element, not a CSS background image
- AND it carries `srcset` and `sizes`
- AND the file it requests is a build-emitted asset rather than the unprocessed source in `public/`

### Requirement: Warm Color Palette

(Previously: the palette defined seven `:root` tokens, but the page field was painted `rgb(112, 140, 100)` from a per-page `--section-accent` record repeated at six sites, the accent gold `#c4956a` failed AA as text at 2.31:1, and six foreground/background pairs shipped below their WCAG 2.1 AA threshold)

The system MUST define the warm color palette as one source of truth: every CSS colour value MUST be declared exactly once, as a custom property in the `:root` block of `src/styles/global.css`. No page and no component MAY declare a raw colour literal (`#hex`, `rgb()`, `rgba()`, `hsl()`), and no page or component MAY declare a per-section accent record or a `--section-accent` custom property. The existing token names `--color-primary`, `--color-secondary`, `--color-bg`, `--color-surface`, `--color-text`, and `--color-border` MUST be preserved; the redesign changes their values and roles, not their names. The only colour values outside the token block MUST be the glaze swatch values held as data in `src/data/category-visual.ts`.

The palette MUST be warm: it MUST include browns, creams, and earth tones. The page field MUST be the warm near-white `#F7F3EC`, resolved from `--color-bg`, and every menu section MUST render on that field. Page and section backgrounds MUST use cream/off-white tones; the footer MAY use the dark wood token as its ground. Accent elements and headings MUST use colours from the measured earth family — the warm browns, the creams, and the brand green in its accent role — and no colour outside that family MAY be introduced.

The brand green MUST keep its exact value `#708C64`. It MUST be used only as an accent: section rules and markers, the active-nav marker, and glaze swatches. It MUST NOT be used as a page, section, or cell background. White text MUST NOT be placed on it: `#FFFFFF` on `#708C64` is 3.73:1 and fails AA. A text-safe variant of the green, `#4E6B44`, MUST be defined in the same token block for any green text.

Every text pair MUST meet WCAG 2.1 AA, verified by recomputing the relative-luminance ratio from the declared hex values. On the `#F7F3EC` field: body text `#2C1810` MUST reach at least 4.5:1 (measured 15.25:1), headings and product names `#4A3728` at least 4.5:1 (measured 10.16:1), prices `#8A5A2B` at least 4.5:1 (measured 5.31:1), and section and sub-category labels `#4E6B44` at least 4.5:1 (measured 5.41:1). The brand green `#708C64` on the field is 3.38:1 and MAY be used only for decorative marks or text of at least 24px, never for normal-size text. On the footer's `#4A3728` ground, footer text `#D4C5B5` MUST reach at least 4.5:1 (measured 6.67:1); translucent white — including `rgba(255, 255, 255, 0.5)`, measured 4.12:1 — MUST NOT be used for footer text. The former price colour `#C4956A` MUST NOT be used as a text colour on any ground. No text MAY be rendered over a translucent white panel composited on a saturated ground.

#### Scenario: CSS custom properties defined

- GIVEN the global stylesheet loads
- WHEN the browser computes CSS custom properties
- THEN `--color-primary`, `--color-secondary`, `--color-bg`, `--color-surface`, and `--color-text` are defined with warm-toned values
- AND `--color-bg` resolves to `#F7F3EC`

#### Scenario: One source of truth for colour

- GIVEN the source tree under `src/`
- WHEN searching `src/styles/global.css` outside its `:root` block, and every file under `src/pages/` and `src/components/`, for raw colour literals
- THEN no `#hex`, `rgb()`, `rgba()`, or `hsl()` literal appears outside the `:root` block and `src/data/category-visual.ts`
- AND `--section-accent` appears in no file
- AND neither page declares a per-section accent record

#### Scenario: Cream field restored and green never a field

- GIVEN the built homepage in both locales
- WHEN inspecting the page and section backgrounds
- THEN the page field resolves to `#F7F3EC`
- AND no section, page, or product cell declares a background whose value is `#708C64` or `rgb(112, 140, 100)`
- AND heading text resolves to `#4A3728`

#### Scenario: Brand green keeps its exact value in an accent role

- GIVEN the token block in `src/styles/global.css`
- WHEN inspecting the green token
- THEN its value is exactly `#708C64`
- AND its use sites are limited to rules, markers, the active-nav indicator, and glaze swatches
- AND the text-safe variant `#4E6B44` is defined in the same block

#### Scenario: The six former AA failures pass numerically

- GIVEN the declared token values
- WHEN recomputing each WCAG 2.1 relative-luminance ratio
- THEN `#2C1810` on `#F7F3EC` is at least 4.5:1
- AND `#4A3728` on `#F7F3EC` is at least 4.5:1
- AND `#8A5A2B` on `#F7F3EC` is at least 4.5:1
- AND `#4E6B44` on `#F7F3EC` is at least 4.5:1
- AND `#D4C5B5` on `#4A3728` is at least 4.5:1
- AND `#C4956A` is not used as a text colour anywhere

#### Scenario: No text is placed on the brand green

- GIVEN every component that renders text
- WHEN inspecting the foreground and background pair of each text element
- THEN no text colour is placed on a `#708C64` ground
- AND the only green-ground elements are decorative marks, rules, and glaze swatches

#### Scenario: Interactive states pass AA

- GIVEN the sticky nav's default, hover, and active states
- WHEN recomputing the text/background ratio of each state
- THEN every state's ratio is at least 4.5:1
- AND no hover state paints a saturated ground behind white text

#### Scenario: List descriptions are legible on the field

- GIVEN a text-list product row
- WHEN recomputing its description colour against the field
- THEN the ratio is at least 4.5:1
- AND the description colour is an opaque palette token, not an alpha applied over a translucent panel

### Requirement: Institutional Footer

(Previously: footer text was required to resolve via i18n, but the location was hardcoded JSX, the footer hardcoded `#fff` and `#d4c5b5`, and the copyright text shipped at 4.12:1)

The footer MUST display the café location, operating hours, and social media links. All footer text MUST resolve via i18n translations from `src/i18n/{locale}.json` through `t(key, locale)`; no footer string MAY be hardcoded in the component, and the `footer.location.text` key MUST be present in both locale files and rendered. The footer MUST use a single dark ground from the warm palette — the wood/walnut token — with light text, and every footer text colour MUST be a palette token that reaches at least 4.5:1 against that ground. The footer MUST NOT declare colour literals of its own; `#fff`, `#d4c5b5`, and translucent white MUST NOT appear in `src/components/Footer.astro`.

#### Scenario: Footer renders complete information

- GIVEN the homepage has loaded
- WHEN the user scrolls to the footer
- THEN location text (in current locale) is visible
- AND operating hours (in current locale) are displayed
- AND social media links are present as icons or text

#### Scenario: Footer in English locale

- GIVEN the English page at `/en/`
- WHEN viewing the footer
- THEN location text is in English
- AND operating hours labels are in English
- AND social media heading is "Follow us"

#### Scenario: Footer text resolves via i18n

- GIVEN `src/components/Footer.astro` and the two locale files
- WHEN inspecting every text node the footer renders
- THEN each string is produced by `t(key, locale)`
- AND `footer.location.text` exists in both `es.json` and `en.json` and is rendered on both pages
- AND no location, hours, or social-heading string is written inline in the component

#### Scenario: Footer contrast passes on the dark ground

- GIVEN the footer ground `#4A3728` and its text tokens
- WHEN recomputing each pair's ratio
- THEN every pair is at least 4.5:1
- AND no footer text colour is a translucent white or a literal hex declared in the component

#### Scenario: Footer responsive

- GIVEN a viewport width of 375px
- WHEN the footer renders
- THEN all footer content stacks vertically without overflow
- AND links are tappable (minimum 44×44px touch target)

### Requirement: Typography

(Previously: the requirement mandated Playfair Display for headings and Inter for body text; the pairing is now a design-phase decision governed by the `frontend-design` skill, and a type scale plus tabular figures are added)

The system MUST use a typeface pairing chosen in the design phase under the `frontend-design` skill. The pairing MUST be recorded before implementation begins, and its families MUST be declared exactly once, as `--font-heading` and `--font-body` in the `:root` block of `src/styles/global.css`. The pairing MUST consist of at most two families, and headings MUST use a family whose voice is distinguishable from the body family; no browser-default family MAY be the primary family of either role. Fonts MUST be loaded via `<link>` in the layout head with `display=swap`, and the number of font stylesheet requests MUST NOT exceed two. A fallback stack MUST be declared for each role — a display/serif fallback for headings and a sans-serif or system fallback for body — so text remains readable when the web font fails to load. The system MUST define one modular type scale on `clamp()` covering every text role; hardcoded per-component font sizes MUST NOT be reintroduced, and one line-height rhythm MUST be shared across roles. Body text MUST set a measure between 65 and 75 characters. Every price MUST set `font-variant-numeric: tabular-nums`.

#### Scenario: Type pairing is declared once

- GIVEN the `:root` block in `src/styles/global.css`
- WHEN inspecting `--font-heading` and `--font-body`
- THEN both are declared and name the pairing recorded for this change
- AND each value carries an explicit fallback family
- AND no component declares a font family of its own

#### Scenario: Fonts load with an explicit strategy

- GIVEN the layout head in `src/layouts/BaseLayout.astro`
- WHEN inspecting the font requests
- THEN at most two font stylesheets are requested via `<link>`
- AND each request sets `display=swap`

#### Scenario: Font fallback works

- GIVEN the web fonts fail to load
- WHEN the browser paints text
- THEN headings render in the declared display/serif fallback
- AND body text renders in the declared sans-serif or system fallback

#### Scenario: One scale replaces hardcoded sizes

- GIVEN the global stylesheet and the components
- WHEN inspecting the font-size declarations
- THEN every text role resolves from the scale defined on `clamp()`
- AND no component declares an ad-hoc per-breakpoint font size outside the scale

#### Scenario: Money column uses tabular figures

- GIVEN any rendered price
- WHEN inspecting its computed typography
- THEN `font-variant-numeric: tabular-nums` is applied
- AND the price is right-aligned in its column
