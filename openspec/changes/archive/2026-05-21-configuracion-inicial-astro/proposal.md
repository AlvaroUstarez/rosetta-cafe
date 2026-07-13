# Proposal: Configuración Inicial de Astro

## Intent

Greenfield total — no hay package.json ni nada instalado. Este cambio prepara el terreno para construir el menú web de Rosetta Café de Especialidad instalando Astro y las herramientas base necesarias para arrancar el desarrollo.

## Scope

### In Scope
- Inicializar proyecto Astro con `create astro` (template minimal)
- Configurar TypeScript (strict mode)
- Setup de estructura de carpetas base: `src/layouts/`, `src/components/`, `src/pages/`
- Configurar Biome como linter + formatter (rápido, cero config, integración Astro nativa)

### Out of Scope
- Diseño visual del menú (CSS, layout visual, tipografía, paleta)
- Contenido del menú (productos, precios, fotos, categorías)
- Funcionalidad interactiva (filtros, tabs con JS, carrito)
- Panel de administración
- Tests (se configuran en cambio posterior)
- CI/CD o deploy

## Capabilities

> Cambio puramente infraestructural — setup de herramientas. No introduce ni modifica capacidades del dominio.

### New Capabilities
None.

### Modified Capabilities
None.

## Approach

1. **`bun create astro`** con template minimal (sin TypeScript estricto por defecto, se ajusta después)
2. **Habilitar TypeScript strict**: `tsconfig.json` con `strict: true`, `noUncheckedIndexedAccess`
3. **Instalar Biome**: `bun add --dev @biomejs/biome`, generar `biome.json` con reglas recomendadas + formateo al guardar
4. **Estructura base**: crear carpetas `src/{layouts,components,pages}` con un `.gitkeep` cada una y un layout base mínimo (`BaseLayout.astro`)
5. **Verificar**: `bun run build` exitoso y `bun astro check` sin errores

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `./` | New | Raíz del proyecto con `package.json`, `tsconfig.json`, `astro.config.mjs`, `biome.json` |
| `src/` | New | Carpetas `layouts/`, `components/`, `pages/` + `BaseLayout.astro` |
| `.gitignore` | New | Generado por Astro |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Versión de Bun incompatible con template de Astro | Baja | Usar Bun LTS, verificar compatibilidad en docs |
| Biome no soporte `.astro` en version early | Baja | Usar plugin `@biomejs/biome` post-1.9 que ya soporta Astro |

## Rollback Plan

Eliminar todo: `Remove-Item -Recurse -Force *` desde la raíz del proyecto y borrar `.gitignore`. Es greenfield — no hay código que preservar.

## Dependencies

- **Bun** instalado en el sistema (`bun --version` debe funcionar)
- Conexión a internet para `bun create astro` y `bun install`

## Success Criteria

- [ ] `bun run dev` levanta servidor sin errores
- [ ] `bun run build` produce `/dist/` sin errores
- [ ] `bun astro check` pasa sin errores de tipos
- [ ] `bun biome check .` pasa sin errores de linting
- [ ] Estructura `src/{layouts,components,pages}` existe
