# Teoría — SDD, Gentle AI y el proyecto Rosetta

## 1. SDD — Spec-Driven Development

**SDD** es una metodología para construir software con IA de forma estructurada. En vez de decir "hacé tal cosa" y que la IA improvise, SDD fuerza un proceso en fases donde cada fase produce un artefacto que la siguiente consume.

El ciclo completo:

```
Proposal → Specs → Design → Tasks → Apply → Verify → Archive
               ↑              ↑
           (opcional)    (desglose en tareas)
```

**¿Por qué existe?** Porque cuando laburás con IA, si no estructurás el proceso, pasan dos cosas:

1. **La IA se pierde** en contexto enorme y empieza a alucinar.
2. **No sabés si lo que hizo está bien** porque no hay especificación contra la cual verificar.

SDD resuelve eso: cada fase es chica, enfocada, y verificable.

---

## 2. Las fases

### 🔵 SDD Init
La primera vez en un proyecto. Detecta el stack, las herramientas de testing, y crea la carpeta `openspec/` que va a contener todos los artefactos. También crea el **skill registry** (`.atl/skill-registry.md`) que indexa todas las skills disponibles.

### 🟢 Proposal (Propuesta)
Define **QUÉ** vamos a hacer y **POR QUÉ**. Incluye:
- **Intent**: el problema a resolver
- **Scope**: qué entra y qué NO entra (importantísimo)
- **Capabilities**: las capacidades nuevas o modificadas
- **Approach**: enfoque técnico de alto nivel
- **Risks** y **Rollback plan**

### 🟡 Specs (Especificaciones)
Describe **cómo se comporta** el sistema. Usa lenguaje formal:
- **RFC 2119**: `MUST` (obligatorio), `SHOULD` (recomendado), `MAY` (opcional)
- **Given/When/Then**: escenarios tipo BDD

Cada `Capability` de la proposal se convierte en un archivo de spec. Para nuevas capacidades = spec completa. Para cambios sobre existentes = delta spec.

### 🟠 Design (Diseño técnico)
Acá pasamos del QUÉ al **CÓMO**. Decisiones de arquitectura concretas:
- **Architecture Decisions**: opciones consideradas, elegidas, y el rationale (por qué)
- **Data Flow**: cómo se mueven los datos
- **File Changes**: archivos a crear/modificar/eliminar
- **Interfaces/Contracts**: tipos, props, APIs

Cada decisión documenta alternativas descartadas con su razón. Esto evita el "por qué usamos X" meses después.

### 🟣 Tasks (Tareas)
Desglose del diseño en **tareas atómicas e independientes**. Cada tarea tiene:
- Descripción concreta
- Comandos a ejecutar
- Criterio de éxito

Incluye un **Review Workload Forecast** que estima líneas cambiadas y decide si el cambio entra en un solo PR o necesita dividirse en PRs encadenados.

### 🔴 Apply (Implementación)
Un agente **ejecutor** (sin memoria, contexto limpio) lee solo lo que necesita y escribe código. Marca tareas como completadas a medida que avanza.

Puede operar en dos modos:
- **Standard**: implementa nomás.
- **Strict TDD**: primero escribe el test que falla (RED), después implementa (GREEN), después refactoriza.

### ✅ Verify (Verificación)
Ejecuta los comandos reales (build, type check, lint, tests) y compara el resultado contra specs y diseño. Produce un reporte con issues clasificados:
- **CRITICAL**: bloqueante
- **WARNING**: no bloqueante pero importante
- **SUGGESTION**: mejora opcional

Veredicto: **PASS**, **PASS WITH WARNINGS**, o **FAIL**.

### 📦 Archive (Archivo)
Cierra el ciclo: mueve la carpeta del cambio a `openspec/changes/archive/` con fecha. Si había delta specs, las mergea a las specs principales.

---

## 3. Arquitectura de Gentle AI

### Orchestrator vs Executors

```
Tú (usuario)
    │
    ▼
Orchestrator (el agente principal) — coordina, pregunta, decide
    │
    ├── Delegación async → tareas de fondo
    └── Delegación sync  → sub-agentes especializados
                            ├── sdd-init
                            ├── sdd-propose
                            ├── sdd-spec
                            ├── sdd-design
                            ├── sdd-tasks
                            ├── sdd-apply
                            ├── sdd-verify
                            └── sdd-archive
```

**El orchestrator NUNCA ejecuta trabajo pesado.** Lee archivos para decidir, pero todo lo que toca 4+ archivos o requiere escribir código lo delega. Cada sub-agente arranca con contexto limpio — esto evita que la IA se contamine con información de tareas anteriores.

### Skills

Las **skills** son instrucciones especializadas que un agente puede cargar para saber exactamente cómo hacer una tarea (por ejemplo, `sdd-apply` tiene su propio SKILL.md). El **skill registry** (`.atl/skill-registry.md`) es el índice de todas las skills disponibles.

---

## 4. Astro

Astro es un **framework de contenido estático** que por defecto manda **cero JavaScript al navegador**. Ideal para un menú web porque:
- Es un sitio **informativo** (no una app interactiva).
- Cargar rápido es parte de la experiencia.
- Cuando necesitemos interactividad (admin panel), podemos sumar componentes React *dentro de Astro* sin cambiar de proyecto.
- `output: 'static'` → genera HTML plano en build time.
- `output: 'server'` → genera en servidor.

---

## 5. Decisiones de arquitectura del proyecto

| Decisión | Elegido | Rationale |
|----------|---------|-----------|
| Framework | **Astro** | Cero JS por defecto, ideal para contenido, escala con componentes |
| CSS | **Vanilla + custom properties** | Tailwind es overkill para una página chica |
| Tabs sin JS | **`input:checked`** | No contamina URL, markup limpio, 100% CSS |
| Tipografía | **Google Fonts (Playfair + Inter)** | Dos requests, aceptable para sitio informativo |
| Lint/Format | **Biome** | Una herramienta, zero config, soporte Astro nativo |
| TypeScript | **Strict mode** | Null checks atrapan bugs antes de producción |
| Gestor de paquetes | **npm** (fallback por falta de Bun) | Sin drama |

---

## 6. Estado del proyecto

```
    ┌── Completado ──┐   ──►   En progreso        ──►   Futuro
    │                 │         │                           │
    │ Setup Astro ✅  │         Menú web               Admin panel
    │ SDD Init ✅     │         Homepage               CRUD productos
    │ Archive 1 ✅    │         Tabs categorías         Imágenes
    │                 │         Cards productos         Promociones
    └─────────────────┘         Mobile responsive       Ingredientes
```

---

## 7. Conceptos clave sueltos

- **Greenfield**: proyecto que arranca desde 0, sin código existente.
- **OpenSpec**: modo de persistencia donde los artefactos SDD viven como archivos en el repo (`openspec/`), trazables en revisiones.
- **Engram**: sistema de memoria persistente de Gentle AI; sobrevive entre sesiones y compactaciones.
- **Veredicto PASS**: todas las verificaciones pasaron sin issues críticos.
- **workload forecast**: estimación de líneas cambiadas para decidir si un cambio cabe en un solo PR o hay que dividirlo.
