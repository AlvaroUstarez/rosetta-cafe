# Delta for homepage-layout

## MODIFIED Requirements

### Requirement: Responsive Mobile-First Layout

(Previously: page structure hero → menu section → footer, single column on mobile)

The layout MUST be mobile-first with CSS media queries. The page structure — hero → sticky section nav → stacked menu sections → footer — MUST stack in a single column on mobile. The section nav MUST be sticky at `top: 0` and horizontally scrollable on narrow viewports if links overflow. On tablet (≥768px) and desktop (≥1024px), spacing and typography scale SHOULD increase proportionally.

#### Scenario: Column stacking with sticky nav on mobile

- GIVEN a viewport width of 375px
- WHEN the homepage renders
- THEN all sections stack vertically in a single column
- THEN the nav bar is sticky at the top after scrolling past the hero
- THEN no content overflows horizontally

#### Scenario: Layout scales on desktop

- GIVEN a viewport width of 1280px
- WHEN the homepage renders
- THEN sections have increased whitespace and constrained max-width for readability
- AND the sticky nav spans the full content width

## REMOVED Requirements

None.
