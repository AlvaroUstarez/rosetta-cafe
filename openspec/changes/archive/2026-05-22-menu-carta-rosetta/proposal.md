# Proposal: Menu Carta Rosetta

## Intent

Replace mock menu data (8 products, CSS-only tabs) with the real Rosetta Café carta (~60+ products) and refactor from tab to scroll + sticky nav UX. The current tabs don't scale to 6+ categories with sub-groups.

## Scope

### In Scope
- `src/data/menu.ts`: complete rewrite with all real products, sub-categories, typed pricing
- New `MenuSection.astro`: reusable section component (replaces `MenuTabs.astro`)
- New `SectionNav.astro`: sticky horizontal nav with anchor links
- `index.astro`: render sections instead of single tab container
- `global.css`: section nav, section header, sub-category styles
- `ProductCard.astro`: minor adjustments if needed
- Remove `input:checked` tab CSS and MenuTabs component

### Out of Scope
- Backend/admin panel, search/filter, cart/ordering
- Live price updates — prices stay static in code
- Image assets — placeholders remain

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `product-menu`: UX shifts from CSS-only tabs to scroll + sticky nav sections. Data changes from 8 mock items to ~60+ real products with sub-categories.
- `homepage-layout`: Page structure evolves from hero + tab container + footer to hero + section nav + stacked sections + footer.

## Approach

- Single page, sections stacked vertically
- Sticky horizontal `<nav>` with `position: sticky; top: 0` — links use `href="#section-id"` with `scroll-margin` on targets
- Each section: visual header (bg color / typography), responsive grid (`grid-template-columns: 1fr → 2fr → 3fr`)
- Café section: sub-category subtitles (Calientes, Fríos, etc.) as `<h3>` dividers
- Zero JS: anchor links + CSS only
- Protocolo as plain text section at bottom
- Data typed with `Product` interface, exported array

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/data/menu.ts` | Modified | Complete rewrite — ~60+ products |
| `src/components/MenuTabs.astro` | Removed | Replaced by section approach |
| `src/components/MenuSection.astro` | New | Reusable section component |
| `src/components/SectionNav.astro` | New | Sticky nav component |
| `src/components/ProductCard.astro` | Modified | Minor adjustments if needed |
| `src/pages/index.astro` | Modified | Replace MenuTabs with sections |
| `src/styles/global.css` | Modified | Add section nav + section styles |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| ~500+ lines changed | Med | Review in sliceable units: data first, then components |
| Manual data entry errors | Med | Cross-check against Carta Rosetta PDF during verification |
| `scroll-margin` no support in legacy browsers | Low | Graceful degradation — nav still works, just less precise |

## Rollback Plan

- Revert changes to `src/data/menu.ts`, `src/pages/index.astro`, `src/styles/global.css`
- Remove `src/components/MenuSection.astro` and `src/components/SectionNav.astro`
- Restore `src/components/MenuTabs.astro` from git
- Delete delta spec from `openspec/changes/menu-carta-rosetta/specs/`

## Dependencies

None.

## Success Criteria

- [ ] All ~60+ products from Carta Rosetta present in data
- [ ] Sticky nav allows jumping to any of the 6 sections
- [ ] Each section displays products in responsive grid (1→2→3 cols)
- [ ] Café section shows sub-category dividers
- [ ] `npm run build` passes with 0 errors
- [ ] `npx astro check` passes with 0 errors
- [ ] `npx @biomejs/biome check .` passes with 0 errors
