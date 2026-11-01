# Delta for Homepage Layout

## REMOVED Requirements

### Requirement: Warm Color Palette

**Reason**: Replaced by `Paper and Ink Palette`. The requirement named `--color-primary`, `--color-secondary`, `--color-bg`, and `--color-text` as the palette contract; none of those tokens exist after the redesign, and the requirement's "browns, creams, and earth tones" framing no longer describes a paper-and-ink system whose accent is brass.

**Migration**: Every colour resolves from the seven tokens in `src/styles/global.css` (`--paper`, `--ink`, `--ink-muted`, `--rule`, `--wash`, `--brass`, `--brass-ink`). Any reference to a `--color-*` token is dead and must be deleted rather than aliased.

## ADDED Requirements

### Requirement: Paper and Ink Palette

The system MUST define its entire colour system as CSS custom properties in one `:root` block in `src/styles/global.css`: `--paper`, `--ink`, `--ink-muted`, `--rule`, `--wash`, `--brass`, and `--brass-ink`. No component MAY declare a literal colour for a visible surface, border, or text, and no page MAY pass a per-section colour to a component. The page field MUST be a warm near-white paper tone.

Two sites are exempt because neither can resolve a custom property: the alpha-only `#000` stops inside the nav's `mask-image` gradient, which paint no colour, and the `theme-color` meta value, which is a document-head string.

The brass hue MUST be split by role: `--brass` is decorative and MUST NOT be applied to text below the large-text threshold, while `--brass-ink` is the only brass value permitted on text. Every foreground/background pair used for text MUST clear WCAG 2.1 AA contrast for its size, verified numerically rather than visually.

(Previously: "Warm Color Palette" required browns, creams, and earth tones with `--color-primary`, `--color-secondary`, `--color-bg`, and `--color-text` defined, and left contrast unverified — six AA failures existed under it)

#### Scenario: Tokens are defined once

- GIVEN the global stylesheet loads
- WHEN the browser computes CSS custom properties
- THEN `--paper`, `--ink`, `--ink-muted`, `--rule`, `--wash`, `--brass`, and `--brass-ink` are defined
- AND no `--color-*` token is defined

#### Scenario: No literal colours outside the token block

- GIVEN the component stylesheets
- WHEN searching for hex, `rgb()`, or `hsl()` values
- THEN every colour reference resolves to a custom property
- AND no component declares a literal colour

#### Scenario: Text pairs clear AA

- GIVEN every foreground/background pair used for text
- WHEN its contrast ratio is computed
- THEN each pair meets its WCAG 2.1 AA threshold
- AND `--ink-muted` on `--paper` is at least 4.5:1
- AND `--brass-ink` on `--paper` is at least 4.5:1

#### Scenario: Brass is not used as small text

- GIVEN a text element smaller than the large-text threshold
- WHEN inspecting its colour
- THEN it resolves to `--brass-ink` and not `--brass`

### Requirement: Document Head Metadata

Both pages MUST emit a localized `meta description`, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:locale`), a `twitter:card`, `hreflang` alternates between `es` and `en`, a `theme-color` matching the page field, and `color-scheme: light`. The `og:image` MUST be produced by the build pipeline from the hero photograph and MUST NOT point at an unprocessed source file.

#### Scenario: Head metadata is present on both pages

- GIVEN the built pages `dist/index.html` and `dist/en/index.html`
- WHEN inspecting the document head
- THEN each carries a non-empty `meta description` in its own locale
- AND each carries `og:title`, `og:description`, `og:image`, and `og:locale`
- AND each carries `twitter:card`

#### Scenario: Alternates link both locales

- GIVEN the built pages
- WHEN inspecting the `hreflang` alternates
- THEN an `es` alternate points at `/`
- AND an `en` alternate points at `/en/`

#### Scenario: Theme colour matches the page field

- GIVEN the built pages
- WHEN reading `theme-color`
- THEN its value equals the `--paper` token
- AND `color-scheme` is declared as `light`

## MODIFIED Requirements

### Requirement: Typography

The system MUST use **Newsreader** for display text and **IBM Plex Sans** for text and data, loaded via Google Fonts `<link>` in the layout head with `preconnect` to both Google Fonts hosts. Newsreader MUST be requested with weights 300, 400, and 500 and with its optical-size axis; IBM Plex Sans MUST be requested with weights 400 and 500. An explicit fallback stack MUST be declared for each role: a serif stack for display and a sans-serif stack for text.

All font sizes MUST resolve from the type-scale custom properties declared in the global stylesheet. No component MAY hardcode a font size, and no more than two font families MAY be loaded.

(Previously: Playfair Display for headings and Inter for body text, with no type scale and 13 hardcoded sizes across the components)

#### Scenario: Google Fonts load

- GIVEN the layout component renders
- WHEN the browser requests the page
- THEN Newsreader and IBM Plex Sans stylesheets are requested from Google Fonts
- AND both Google Fonts hosts are preconnected

#### Scenario: Font fallback works

- GIVEN Google Fonts fail to load
- WHEN the browser paints text
- THEN display text renders in a serif fallback
- AND body text renders in a sans-serif fallback

#### Scenario: Sizes come from the scale

- GIVEN the component stylesheets
- WHEN searching for `font-size` declarations
- THEN every value resolves to a `--text-*` custom property
- AND no component declares a literal font size or an inline `clamp()`

### Requirement: Hero Section Branding

The homepage MUST display "Rosetta" as the primary heading at display scale, with the kind label "Café de especialidad" (`hero.kind`) as a subordinate block within or immediately below the heading, and the tagline (`hero.tagline`) below both, each in the current locale. The hero MUST NOT be pinned to the full viewport height: no viewport-height unit MAY constrain it, and its height MUST be the sum of its padding, text block, and photograph band.

The hero MUST include the café photograph as a band whose aspect ratio is 4:3 on viewports below 768px and 21:9 at 768px and above. The photograph MUST be the LCP element and MUST carry a priority hint, responsive `srcset`/`sizes`, and intrinsic dimensions.

(Previously: the hero was required to occupy the full viewport height on desktop, and the heading was specified as the single string "Rosetta Café de Especialidad")

#### Scenario: Hero renders with brand identity

- GIVEN the homepage loads
- WHEN the user views the hero section
- THEN the wordmark "Rosetta" is the page's only `<h1>`
- AND the kind label and tagline appear in the correct locale below it

#### Scenario: Hero is not locked to the viewport

- GIVEN a viewport of 1280×800
- WHEN measuring the masthead
- THEN no `min-height` or `height` expressed in viewport units is applied to it
- AND its height equals its padding plus its text block plus its photograph band
- AND the first menu section follows the band directly, with no spacer element between them

#### Scenario: Hero photograph is responsive

- GIVEN the hero photograph is rendered
- WHEN inspecting the emitted element
- THEN it carries `srcset`, `sizes`, `width`, and `height`
- AND it carries a priority hint
- AND its container aspect ratio is 4:3 below 768px and 21:9 at 768px and above

#### Scenario: Hero responsive on mobile

- GIVEN a viewport width of 375px
- WHEN the homepage renders
- THEN the hero text is readable without horizontal scroll
- AND the photograph band is 4:3

### Requirement: Institutional Footer

The footer MUST display the café location, operating hours, and social media links, all resolved via i18n translations. The footer MUST use the `--wash` ground with `--ink` text and a hairline top border; a dark ground MUST NOT be used. The footer MUST lay out as three columns at 768px and above and as a single stacked column below. Social links MUST provide at least a 44×44px touch target.

(Previously: the footer was required to use a dark background from the warm palette — deep brown — with light text, and the location was hardcoded in JSX as "Vicente López 357" while i18n carried "Balcarce 350")

#### Scenario: Footer renders complete information

- GIVEN the homepage has loaded
- WHEN the user scrolls to the footer
- THEN location text in the current locale is visible
- AND operating hours in the current locale are displayed
- AND social media links are present

#### Scenario: Footer address matches i18n

- GIVEN the footer on either locale
- WHEN reading the location value
- THEN it renders the `footer.location.text` translation
- AND no address is hardcoded in the component

#### Scenario: Footer in English locale

- GIVEN the English page at `/en/`
- WHEN viewing the footer
- THEN location text is in English
- AND operating hours labels are in English
- AND the social heading is "Follow Us"

#### Scenario: Footer uses the light ground

- GIVEN the footer renders
- WHEN inspecting its computed background
- THEN it resolves to `--wash`
- AND its text resolves to `--ink` or `--ink-muted`

#### Scenario: Footer responsive

- GIVEN a viewport width of 375px
- WHEN the footer renders
- THEN all footer content stacks vertically without overflow
- AND each social link provides at least a 44×44px touch target

### Requirement: Language Switcher in Section Navigation

The section nav MUST include a language switcher rendered as a static `<a>` link to the root of the other locale (`/` for ES, `/en/` for EN). The link MUST display the other locale's code ("ES" or "EN"), MUST carry `hreflang` and `lang` attributes for that locale, and MUST carry an `aria-label` resolved from `lang.es` or `lang.en` describing the destination. The switcher MUST work without JavaScript.

A link to the locale currently displayed MUST NOT be rendered.

(Previously: the nav was required to render both "ES" and "EN" links with the active one visually dimmed)

#### Scenario: Switcher offers the other locale only

- GIVEN the user is on the Spanish page
- WHEN inspecting the nav
- THEN a single "EN" link is present
- AND no "ES" link is present in the nav

#### Scenario: Switcher is labelled for assistive technology

- GIVEN the language link renders
- WHEN reading its accessible name
- THEN it resolves from the `lang.*` translation for the current locale
- AND it carries `hreflang` and `lang` for the destination locale

#### Scenario: Language switcher navigates between locales

- GIVEN the user is on the Spanish page
- WHEN they click "EN" in the switcher
- THEN the browser navigates to `/en/`
- AND the nav now offers "ES"

#### Scenario: No-JavaScript fallback

- GIVEN JavaScript is disabled
- WHEN the user clicks the language link
- THEN the browser navigates via native HTML anchor behaviour
