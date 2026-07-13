# Homepage Layout — Delta Spec

## ADDED Requirements

### Requirement: Hero Section Branding

The homepage MUST display "Rosetta Café de Especialidad" as primary heading with an evocative tagline below. The hero SHOULD occupy full viewport height on desktop and adapt proportionally on mobile.

#### Scenario: Hero renders brand identity

- GIVEN the homepage loads
- WHEN the user views the hero section
- THEN the café name is visible as heading
- AND a tagline is present below it

#### Scenario: Hero responsive on mobile

- GIVEN a 375px viewport
- WHEN the hero renders
- THEN content is centered and readable without horizontal scroll

### Requirement: Responsive Mobile-First Layout

The layout MUST stack hero → menu → footer in a single column on mobile. On tablet (≥768px) and desktop (≥1024px), spacing and type scale SHOULD increase.

#### Scenario: Single column on mobile

- GIVEN a 375px viewport
- WHEN the page renders
- THEN all sections stack vertically without overflow

#### Scenario: Desktop spacing

- GIVEN a 1280px viewport
- WHEN the page renders
- THEN sections have increased whitespace with constrained max-width

### Requirement: Warm Color Palette

The system MUST define CSS custom properties for a warm palette: browns, creams, earth tones. Backgrounds SHOULD use cream/off-white; headings MUST use deep brown.

#### Scenario: Custom properties defined

- GIVEN the stylesheet loads
- WHEN inspecting `:root`
- THEN `--color-primary`, `--color-secondary`, `--color-bg`, and `--color-text` exist with warm values

### Requirement: Institutional Footer

The footer MUST display location, hours, and social links. It SHOULD use dark background (deep brown) with light text.

#### Scenario: Footer renders complete

- GIVEN the page loads
- WHEN scrolling to footer
- THEN location, hours, and social links are visible

#### Scenario: Footer responsive

- GIVEN a 375px viewport
- WHEN the footer renders
- THEN content stacks vertically with tappable links (≥44×44px)

### Requirement: Typography

The system MUST use Playfair Display (headings) and Inter (body) via Google Fonts `<link>`, with serif/sans-serif fallbacks declared.

#### Scenario: Font loading

- GIVEN the layout renders
- WHEN the browser requests the page
- THEN Google Fonts stylesheets for both faces are requested

#### Scenario: Fallback rendering

- GIVEN Google Fonts fail to load
- WHEN text paints
- THEN headings use serif fallback, body uses sans-serif fallback
