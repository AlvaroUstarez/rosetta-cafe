# AGENTS.md

Static menu website for Rosetta Café (specialty coffee shop, Salta, Argentina). Astro 6, ES/EN, no backend, no tests.

## Commands

- `npm run dev` — dev server
- `npm run build` / `npm run preview` — production build (verified: 2 pages, `dist/`)
- Types: `npx astro check` (verified: 0 errors). No `typecheck` npm script exists.
- No test runner exists (`openspec/config.yaml`: `runner: none`). Verification = `npx astro check` + `npm run build`; don't add tests unless asked.
- Node `>=22.12.0` required (`engines`).

## Gotchas

- **Biome is configured (`biome.json`) but its native binary will not launch on this machine.** `npx biome check src/`, the `.bin` shim, and `node_modules/@biomejs/cli-win32-x64/biome.exe` all exit `-1073741515` (`0xC0000135`, missing DLL) with no output. That exit code is an environment failure, NOT a lint result — don't report it as findings, and don't try to "fix" the code because of it. Format manually to match `biome.json`: 2-space indent, LF, double quotes.
- Biome's config only covers `src/**/*.astro` and `src/**/*.ts`; anything outside `src/` is intentionally unlinted.
- `package.json` name is `second-spectrum` — stale, not a mistake to "fix" unprompted.
- Product photos are WebP in `public/images/products/`. Source photos arrive as HEIC; `heic-convert` is installed to convert them. Never commit HEIC files — `src/data/espresso-leche-grande.HEIC` is a stray leftover, not a template.
- `.atl/` is an auto-generated skill registry: gitignored, never commit or hand-edit.
- `dist/` and `.astro/` are gitignored build output.
- `faltan-imagenes.txt` tracks products still missing photos (source of truth for that gap).

## Architecture (non-obvious parts)

- **Two translation systems — don't mix them:**
  - UI chrome (nav, footer, hero) → keys in `src/i18n/es.json` + `en.json`, resolved with `t(key, locale)`.
  - Menu content → inline `{ es, en }` objects (`I18nRecord`) inside `src/data/menu.ts`, resolved with `tRecord(value, locale)`.
- **Locale threading is manual.** Each page hardcodes `const locale` (`src/pages/index.astro` → `"es"`, `src/pages/en/index.astro` → `"en"`) and passes it as a prop through every component. No Astro i18n helpers are used in code. Adding a locale means a new page + threading, not just config (`astro.config.mjs` declares `es` as default with no prefix).
- `src/data/menu.ts` is the single source of truth: `categories`, `products` (94 — README's "88" is stale), `protocolo` (pet-friendly notice). A product's `category` MUST match an id in `categories`.
- Subcategories: `subCategories` holds parallel `es`/`en` arrays — keep the same order across locales. The menu renders as a single ledger of rows (`ProductListItem.astro`); a subcategory group shows the thumbnail column only when at least one of its products has an image.
- `image: ""` is a valid state meaning "no photo" — the row renders without a thumbnail. Not an error.
- `BaseLayout.astro` wraps both pages; components live in `src/components/` and all receive `locale` as a prop.
- **Design system:** all tokens live in `src/styles/global.css` (`:root` — paper/ink/brass palette, type scale, spacing). Typefaces are Newsreader (display) and IBM Plex Sans (text), loaded from Google Fonts in `BaseLayout.astro`. Styling is Astro scoped `<style>` only; no Tailwind.

## Workflow

- Substantial changes are planned via OpenSpec: active changes in `openspec/changes/`, canonical specs in `openspec/specs/` (`homepage-layout`, `product-menu`, `i18n`). Rules and build command live in `openspec/config.yaml`. Check for an active change before starting significant work.
- Review budget: 400 changed lines (per `openspec/config.yaml`).

## Project Skills

- Skills live in `.agents/skills/` and are auto-discovered by OpenCode; `.opencode/skills/` is the retired location.
- `frontend-design` — `.agents/skills/frontend-design/SKILL.md`. Vendored from Anthropic's skills repository under Apache-2.0: keep the bundled `LICENSE.txt`.
- `web-design-guidelines` — `.agents/skills/web-design-guidelines/SKILL.md`, from `vercel-labs/agent-skills`.
- `skills-lock.json` pins both sources and content hashes. Regenerating it is a deliberate act, not a side effect of editing a skill.

[[memory.md]]
