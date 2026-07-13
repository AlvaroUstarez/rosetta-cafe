# Archive Report: Product Images

**Archived**: 2026-06-12
**Change**: product-images
**Source**: `openspec/changes/product-images/` → `openspec/changes/archive/2026-06-12-product-images/`

## Specs Synced

| Domain | Action | Details |
|--------|--------|---------|
| product-menu | Updated | 2 requirements MODIFIED (Product Cards, Typed Menu Data), 3 scenarios added, 2 scenarios updated |

### product-menu — Detailed Changes

**Requirement: Product Cards** (MODIFIED)
- Description updated: real image when available + category gradient fallback
- 2 scenarios added: "Card renders with real image", "Card renders with gradient fallback"
- 2 scenarios updated: "Card renders with translated fields" (now references image rendering), "Card hover interaction" (kept as-is)
- `(Previously: ...)` note updated to reflect image/gradient change

**Requirement: Typed Menu Data** (MODIFIED)
- Description updated: `image` field semantics (path vs `""`), gradient constants in `category-visual.ts`
- 1 scenario added: "Gradient constants in separate module"
- 2 scenarios replaced: "Product type supports two languages" → "Product type with new image semantics", "Real data covers all sections" → "Real data covers all sections with image assignments"
- `(Previously: ...)` note updated to append gradient/image changes
- `protocolo` config entry requirement preserved (not in delta scope)

## Archive Contents

- proposal.md ✅
- specs/product-menu/spec.md ✅ (delta spec)
- design.md ✅
- tasks.md ✅ (12/12 tasks complete)
- verify-report.md ✅ (PASS WITH WARNINGS)
- archive-report.md ✅ (this file)

## Verification

- [x] Main spec updated correctly (`openspec/specs/product-menu/spec.md`)
- [x] Change folder moved to archive (`openspec/changes/archive/2026-06-12-product-images/`)
- [x] Archive contains all artifacts (proposal, specs, design, tasks, verify)
- [x] Active changes directory no longer has this change
- [ ] No CRITICAL issues in verification report (PASS WITH WARNINGS — 1 partial: image count 17 vs spec 3)

## Notes

- Verify report flagged a spec deviation (17 products with images instead of 3 specified). This is a positive UX improvement but the spec delta was not updated. Recommend reconciling in a future change.
- `protocolo` config entry was preserved in the merged spec — not explicitly part of this delta but not removed either.
