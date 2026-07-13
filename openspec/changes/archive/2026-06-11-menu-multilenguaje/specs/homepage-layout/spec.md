# Delta for homepage-layout

## ADDED Requirements

### Requirement: Language Switcher in Section Navigation

The section nav MUST include a language switcher rendered as static `<a>` links. The switcher MUST display the language codes ("ES" / "EN"). The link for the active locale SHOULD be visually distinct (e.g., grayed out or marked as active). The inactive locale link MUST navigate to the root of the other language (`/` for ES, `/en/` for EN).

#### Scenario: Language switcher present in nav

- GIVEN the section nav is visible
- WHEN inspecting the nav bar
- THEN both "ES" and "EN" links are present
- AND the current locale link is visually marked as active

#### Scenario: Language switcher navigates between locales

- GIVEN the user is on the Spanish page
- WHEN they click "EN" in the language switcher
- THEN the browser navigates to `/en/`
- AND the nav renders with "EN" marked as active

## MODIFIED Requirements

### Requirement: Hero Section Branding

(Previously: tagline was hardcoded in Spanish; now resolved via i18n translation)

The homepage MUST display "Rosetta Café de Especialidad" as the primary heading. A tagline or evocative description SHOULD appear below the heading in the current locale. The hero SHOULD occupy the full viewport height on desktop and adapt proportionally on mobile.

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
- THEN the hero content is centered and text is readable without horizontal scroll

### Requirement: Institutional Footer

(Previously: footer text (location, hours, social heading) was hardcoded in Spanish; now resolved via i18n translation)

The footer MUST display the café location, operating hours, and social media links. Footer text MUST resolve via i18n translations. The footer SHOULD use a dark background from the warm palette (deep brown) with light text for contrast.

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

#### Scenario: Footer responsive

- GIVEN a viewport width of 375px
- WHEN the footer renders
- THEN all footer content stacks vertically without overflow
- AND links are tappable (minimum 44×44px touch target)
