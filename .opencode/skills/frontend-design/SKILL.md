---
name: frontend-design
description: "Trigger: frontend design, building or redesigning UI, visual direction, typography, palette, layout. Produce distinctive, non-templated design choices."
license: Apache-2.0
metadata:
  author: "Anthropic"
  version: "1.0"
---

# Frontend Design

## Activation Contract

Load when designing new UI, reshaping an existing one, or choosing palette, typography, layout, or motion for a page or component.

## Hard Rules

- The brief's own words win over every rule here, including when it asks for a look catalogued as a default tell in `references/design-guidance.md`.
- Never ship a treatment you would reach for on any project. Ground choices in the subject's industry, materials, and vernacular.
- Spend boldness in one place: one memorable element, everything around it quiet.
- Build to the quality floor without announcing it: responsive to mobile, visible keyboard focus, reduced motion respected, accessible contrast.
- Read `references/design-guidance.md` before proposing a direction. It carries the full typography, structure, motion, and writing detail.

## Decision Gates

| Situation | Action |
| --- | --- |
| Brief names a visual direction | Follow it exactly; do not dilute it. |
| Brief leaves an axis free | Choose for this subject, never spend the freedom on a catalogued default. |
| Brief names no subject matter | Pick one concrete subject, audience, and primary job; confirm before designing. |
| No real copy exists | Write it yourself; copy is design content, not filler. |

## Execution Steps

1. Identify the subject, audience, and the page's primary job.
2. Draft a token plan: 4–6 named hex colors, typefaces and their roles, one layout concept (one-sentence prose plus ASCII wireframe), and the principles that make this page unique.
3. Review the plan against the brief. Where any part reads like what you would produce for any similar page, revise it and state what changed and why.
4. Build the code from the revised plan. Watch CSS selector specificity collisions, especially section padding and margins.
5. Self-critique while building; screenshot when the environment supports it.

## Output Contract

Return the plan (colors, type, layout, principles), then the code. For every axis revised away from a default, state what changed and why.

## References

- `references/design-guidance.md` — full guidance: typography, visual structure, motion, restraint, writing, and the catalogue of AI-default tells.
- `LICENSE.txt` — Apache-2.0 terms; this skill is vendored from Anthropic's skills repository.
