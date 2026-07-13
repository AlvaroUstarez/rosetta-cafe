# Design: Configuración Inicial de Astro

## Technical Approach

Inicialización greenfield de un proyecto Astro con la mínima superficie posible. Se parte del template `minimal` de Astro, se endurece TypeScript a strict mode, se incorpora Biome como herramienta unificada de lint + format, y se establece la estructura de directorios base que escalará con el proyecto.

No hay specs de dominio — este cambio es puramente infraestructural.

## Architecture Decisions

### Template: `minimal` vs `default` (con blog/starter)

| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| `minimal` | Cero páginas de ejemplo, sin configuración superflua. Arrancamos de una hoja en blanco. | ✅ **Elegido** |
| `default` (blog) | Incluye ejemplo de blog, rutas, layouts que habría que limpiar. Agrega ruido cognitivo. | ❌ Descartado |

**Rationale**: `minimal` nos da un `index.astro` con el hola mundo y nada más. No tenemos que hacer "arqueología inversa" borrando código de ejemplo. Para un menú web que va a tener su propia estructura, arrancar limpio ahorra fricción.

### Linter/Formatter: Biome vs ESLint + Prettier

| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| **Biome** | Herramienta unificada (lint + format), zero config, soporte Astro nativo (`biome.json` simple), órdenes de magnitud más rápido que ESLint + Prettier juntos. | ✅ **Elegido** |
| ESLint + Prettier | Dos herramientas, config separada, plugins para Astro inmaduros. Mayor ecosistema de reglas custom, pero no lo necesitamos. | ❌ Descartado |

**Rationale**: Para un proyecto chico que arranca, Biome es la opción correcta: una dependencia dev, un archivo de config, velocidad. ESLint + Prettier tiene sentido cuando necesitás reglas muy específicas o integrarte con un ecosistema legacy. No es el caso.

### TypeScript: Strict Mode

| Opción | Tradeoff | Decisión |
|--------|----------|----------|
| **Strict: true** | Catch de errores más agresivo (null checks, index access). Pequeña fricción inicial, grandes beneficios a largo plazo. | ✅ **Elegido** |
| Non-strict | Menos ruido al arrancar, pero bugs que aparecen en runtime en vez de en `astro check`. | ❌ Descartado |

**Rationale**: En un menú web los datos vienen de un CMS o JSON, y los null checks en strict mode previenen crashes en producción. `noUncheckedIndexedAccess` se incluye por el mismo motivo: TypeScript nos fuerza a manejar el caso `undefined` al acceder a arreglos/objetos.

### Estructura de Carpetas

Se opta por layout-atómico pensando en escalar, no por pages router plano:

```
src/
├── layouts/       → BaseLayout.astro (y futuros layouts: MenuLayout, AdminLayout)
├── components/    → Componentes reutilizables (atoms → molecules → organisms)
└── pages/         → Rutas de Astro (index.astro, menu/, about/)
```

No se implementa Atomic Design formal ahora (no hay componentes), pero la estructura de carpetas lo permite sin renombrar después. `layouts/` separado de `components/` porque un layout es un contenedor estructural (html, head, body, slots), no un componente de UI.

## Data Flow

No aplica — cambio puramente infraestructural. No hay flujo de datos que diseñar.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Create | Generado por `bun create astro`. Dependencias: astro, @astrojs/check, typescript, @biomejs/biome. |
| `tsconfig.json` | Create | Generado por Astro + ajustes: `strict: true`, `noUncheckedIndexedAccess: true`. |
| `astro.config.mjs` | Create | Config base de Astro con output `server` (static por ahora, pero preparado para SSR si hace falta después). |
| `biome.json` | Create | Config de Biome: reglas recomendadas, formateo con indent 2 spaces, soporte `.astro`. |
| `src/layouts/BaseLayout.astro` | Create | Layout mínimo: `<!DOCTYPE html>` con slots para head y body. |
| `src/layouts/.gitkeep` | Create | Preserva directorio en git. |
| `src/components/.gitkeep` | Create | Preserva directorio en git. |
| `src/pages/.gitkeep` | Create | Preserva directorio en git (index.astro ya existe del template). |
| `.gitignore` | Create | Generado por Astro. |

## Interfaces / Contracts

```astro
---
// src/layouts/BaseLayout.astro
// Contrato: recibe title opcional, renderiza HTML shell
export interface Props {
  title?: string;
}
const { title = "Rosetta Café" } = Astro.props;
---
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Testing Strategy

No aplica para este cambio. Es setup de herramientas sin lógica de dominio ni componentes funcionales. La verificación es manual:

| Verificación | Comando | Criterio |
|-------------|---------|----------|
| Build | `bun run build` | Exit 0, `/dist/` generado |
| Type check | `bun astro check` | 0 errores de tipos |
| Lint | `bun biome check .` | 0 errores de linting |
| Dev | `bun run dev` | Servidor escucha en puerto sin errores |

## Migration / Rollout

No migration required. Es greenfield — no hay código previo.

Rollback: `Remove-Item -Recurse -Force *` desde raíz del proyecto + borrar `.gitignore`.

## Open Questions

Ninguna. Todas las decisiones están tomadas en la proposal.
