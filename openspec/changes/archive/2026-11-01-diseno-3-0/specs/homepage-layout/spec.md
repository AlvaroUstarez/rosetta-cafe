# Delta for Homepage Layout

## MODIFIED Requirements

### Requirement: Paper and Ink Palette

The system MUST define its entire colour system as CSS custom properties in one `:root` block in `src/styles/global.css`: `--paper`, `--ink`, `--ink-muted`, `--rule`, `--wash`, `--terracotta`, `--terracotta-ink`, `--green`, and `--green-ink`. No component MAY declare a literal colour for a visible surface, border, or text, and no page MAY pass a per-section colour to a component. The page field MUST be a warm near-white paper tone.

Two sites are exempt because neither can resolve a custom property: the alpha-only `#000` stops inside the nav's `mask-image` gradient, which paint no colour, and the `theme-color` meta value, which is a document-head string.

The system MUST carry two accents, and each MUST be split by role. `--terracotta` and `--green` are decorative and MUST NOT be applied to text below the large-text threshold; `--terracotta-ink` and `--green-ink` are the only values of their hue permitted on text. `--green` MUST be the brand value `#86a479`, used unchanged wherever it paints a surface.

The accents MUST be assigned by meaning, not by element: terracotta carries money and position (prices, the active nav marker, text selection, the focus ring), and green carries identity (the hero kind label, sub-category headings, the protocolo note's left border, the language switcher hover).

Every foreground/background pair used for text MUST clear WCAG 2.1 AA contrast for its size, verified numerically rather than visually.

(Previously: the token set was `--paper`, `--ink`, `--ink-muted`, `--rule`, `--wash`, `--brass`, and `--brass-ink`, with a single brass hue split by role. Brass is retired: `--brass` and `--brass-ink` MUST NOT exist.)

#### Scenario: Tokens are defined once

- GIVEN the global stylesheet loads
- WHEN the browser computes CSS custom properties
- THEN `--paper`, `--ink`, `--ink-muted`, `--rule`, `--wash`, `--terracotta`, `--terracotta-ink`, `--green`, and `--green-ink` are defined
- AND no `--color-*` token is defined
- AND neither `--brass` nor `--brass-ink` is defined

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
- AND `--terracotta-ink` on `--paper` is at least 4.5:1
- AND `--green-ink` on `--paper` is at least 4.5:1

#### Scenario: The brand green is never text

- GIVEN the brand value `#86a479`
- WHEN computing its contrast against `--paper`
- THEN the ratio is below 4.5:1
- AND no text element smaller than the large-text threshold resolves to `--green`
- AND every such element of the green hue resolves to `--green-ink`

#### Scenario: Terracotta is not used as small text

- GIVEN a text element smaller than the large-text threshold
- WHEN inspecting its colour
- THEN it resolves to `--terracotta-ink` and not `--terracotta`

### Requirement: Hero Section Branding

The homepage MUST display the brand mark above the wordmark as a circular image, followed by "Rosetta" as the primary heading at display scale, the kind label "Café de especialidad" (`hero.kind`) as a subordinate block within or immediately below the heading, and the tagline (`hero.tagline`) below both, each in the current locale.

The masthead text block MUST be centred below 768px, with the mark above the wordmark, and MUST be left-aligned at 768px and above, with the mark above the wordmark on the left margin. The mark MUST measure 5.5rem below 768px and 6rem at 768px and above.

The mark MUST be rendered through the build pipeline — an `astro:assets` `<Image>` from a module imported out of `src/assets/` — and MUST be masked to a circle in CSS rather than shipped as a pre-cropped image with transparency. It MUST carry `alt=""`, because the adjacent wordmark already names the brand.

The hero MUST NOT be pinned to the full viewport height: no viewport-height unit MAY constrain it, and its height MUST be the sum of its padding, text block, and photograph band.

The hero MUST include the café photograph as a band whose aspect ratio is 4:3 on viewports below 768px and 21:9 at 768px and above. The photograph MUST be the LCP element and MUST carry a priority hint, responsive `srcset`/`sizes`, and intrinsic dimensions.

(Previously: the hero carried no brand mark, and the masthead block's alignment and the mark's size were unspecified)

#### Scenario: Hero renders with brand identity

- GIVEN the homepage loads
- WHEN the user views the hero section
- THEN the brand mark is visible above the wordmark
- AND the wordmark "Rosetta" is the page's only `<h1>`
- AND the kind label and tagline appear in the correct locale below it

#### Scenario: Mark is decorative

- GIVEN the brand mark is rendered
- WHEN reading its accessible name
- THEN it is empty
- AND the mark is not a link and adds no stop to the tab order

#### Scenario: Mark is emitted by the build pipeline

- GIVEN the mark is rendered
- WHEN inspecting the emitted element
- THEN it carries `srcset`, `sizes`, `width`, and `height`
- AND its source is an imported module from `src/assets/`
- AND its circular mask comes from CSS, not from a transparent cutout

#### Scenario: Masthead is centred on mobile

- GIVEN a viewport width of 375px
- WHEN the masthead renders
- THEN the mark, wordmark, kind label and tagline are horizontally centred
- AND the mark measures 5.5rem

#### Scenario: Masthead is left-aligned on desktop

- GIVEN a viewport width of 1280px
- WHEN the masthead renders
- THEN the mark, wordmark, kind label and tagline align to the left margin
- AND the mark measures 6rem

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
