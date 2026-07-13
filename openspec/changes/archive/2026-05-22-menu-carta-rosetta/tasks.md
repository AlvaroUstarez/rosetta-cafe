# Tasks: Menu Carta Rosetta

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | ~690 (483 additions + 207 deletions) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1: Data + Types; PR 2: Components + Integration + Cleanup |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Types + full menu data | PR 1 | Base: main. ~200 lines. Self-contained — can merge solo. |
| 2 | SectionNav, MenuSection, index wiring, CSS, cleanup | PR 2 | Base: main (after PR 1). ~400 lines. Depends on PR 1 types/data. |

## Phase 1: Foundation

- [x] 1.1 Extend `Category` union (6 cats), add `subCategory` to `Product`, define `MenuCategory` & `Protocolo` in `src/data/menu.ts`
- [x] 1.2 Write 88 real products across 6 categories + `protocolo` config entry in `src/data/menu.ts`

## Phase 2: Components

- [x] 2.1 Create `src/components/SectionNav.astro` — sticky nav with anchor links from `MenuCategory[]` and `overflow-x: auto`
- [x] 2.2 Create `src/components/MenuSection.astro` — renders section header, sub-category dividers, product grid, protocolo variant

## Phase 3: Integration

- [x] 3.1 Modify `src/pages/index.astro` — replace `<MenuTabs />` with `<SectionNav />` + mapped `<MenuSection />` instances + protocolo section
- [x] 3.2 Update `ProductCard.astro` component props to widened `Category` union type
- [x] 3.3 Add CSS to `global.css` — `.section-nav` layout, `scroll-margin-top`, alternating backgrounds, `.sub-category__heading`

## Phase 4: Cleanup

- [x] 4.1 Delete `src/components/MenuTabs.astro`
- [x] 4.2 Remove `input:checked` tab CSS and related dead styles from `global.css`
- [x] 4.3 Run `npm run build`, `npx astro check`, `npx @biomejs/biome check .`
