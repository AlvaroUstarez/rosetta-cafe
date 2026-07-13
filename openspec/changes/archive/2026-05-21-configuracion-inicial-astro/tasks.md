# Tasks: Configuración Inicial de Astro

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 80-120 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 1: Foundation — Scaffold Astro Project

- [x] 1.1 Ejecutar `npm create astro@latest` (fallback: bun no disponible) con template minimal: no TypeScript strict (se configura después), no install deps, no git init. Files generados: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`.
- [x] 1.2 Instalar dependencias con `npm install` (fallback: bun no disponible) y verificar que `package.json` contiene `astro`, `@astrojs/check`, `typescript`.

## Phase 2: Configuration — Tooling Setup

- [x] 2.1 Editar `tsconfig.json`: agregar `"strict": true` y `"noUncheckedIndexedAccess": true` en `compilerOptions`.
- [x] 2.2 Configurar `astro.config.mjs` con `output: 'static'` y limpiar defaults del template minimal.
- [x] 2.3 Instalar Biome con `npm install --save-dev @biomejs/biome` (fallback: bun no disponible) y crear `biome.json` con: `$schema`, `linter.rules.recommended: true`, `formatter.indentStyle: "space"`, `formatter.indentWidth: 2`, `formatter.lineEnding: "lf"`, `javascript.formatter.quoteStyle: "double"`, `files.include: ["src/**/*.astro", "src/**/*.ts"]`.

## Phase 3: Structure — Directorios y BaseLayout

- [x] 3.1 Crear carpetas `src/layouts/`, `src/components/`, `src/pages/` con un archivo `.gitkeep` vacío en cada una.
- [x] 3.2 Crear `src/layouts/BaseLayout.astro` con interfaz `Props { title?: string }`, default `title = "Rosetta Café"`, y HTML shell con `<slot />`.

## Phase 4: Verification — Build y Checks

- [x] 4.1 `npm run build` (fallback: bun no disponible) → exit 0 y carpeta `dist/` generada.
- [x] 4.2 `npx astro check` (fallback: bun no disponible) → 0 errores, 0 warnings, 0 hints.
- [x] 4.3 `npx @biomejs/biome check .` (fallback: bun no disponible) → 0 errores, 0 warnings.
