---
name: normalize
description: Align a feature with your project's design system — tokens, components, patterns, and conventions
args:
  - name: focus
    description: The page, route, or feature to normalize (optional)
    required: false
---

Analyze a feature and align it with the project's design system. Discover what system exists before changing anything.

## 1. Read Project Context

Read the project config and understand the project's architecture, conventions, and design decisions. Do not skip this step.

## 2. Discover the Design System

Before normalizing anything, discover what already exists. Scan the codebase for:

- **CSS custom properties** (`--*`): grep for `--color`, `--space`, `--text`, `--font`, `--radius`, `--shadow`
- **Tailwind or framework config**: look for `tailwind.config`, theme extensions, design token files
- **Component libraries**: shared component directories, UI packages, barrel exports
- **Naming patterns**: how are tokens named? (`--color-primary` vs `--brand-blue` vs `--blue-500`)
- **Spacing scale**: what values are used? Is there a consistent 4px/8px base?
- **Typography system**: how many font sizes, weights, and families appear?

**Map what you find.** Create a mental inventory:
- Primitives (raw values)
- Semantic tokens (what values mean)
- Component tokens (how values are applied)
- Naming conventions in use

→ *Reference: [design-systems](references/design-systems.md) for token architecture and naming conventions.*

**CRITICAL**: If the design system is unclear, incomplete, or absent — stop and ask the user for clarification before proceeding. Do not invent a system.

## 3. Assess Current State

Compare the target feature against the discovered system:

- **Token compliance**: Which values are hardcoded that should use tokens?
- **Component alignment**: Which custom implementations duplicate design system components?
- **Pattern consistency**: Which UX flows deviate from established patterns elsewhere?
- **Naming drift**: Which class names, variable names, or file structures break conventions?

Categorize each deviation:
- **Direct replacement**: A token or component exists, just not used here
- **Minor adaptation**: An existing token/component needs a small extension
- **Promotion candidate**: A pattern appears 3+ times but has no shared implementation yet — flag it

→ *Reference: [design-systems](references/design-systems.md) for promotion rules (3+ uses = extraction candidate, per the Rule of Three).*

## 4. Propose Changes

Present a normalization plan organized by impact:

- Which hardcoded values become token references
- Which custom components become design system component usage
- Which patterns need alignment with existing conventions
- Which promotion candidates you spotted (note but do not extract — that is the **extract** workflow's job)

**IMPORTANT**: Normalization means matching what exists, not redesigning. If the design system uses `--space-4` for 1rem spacing, use it — do not introduce `--spacing-md` because you think it reads better.

## 5. Execute Normalization

Work through the plan systematically:

### Typography
→ *Reference: [typography](references/typography.md) for type scales and semantic tokens.*
- Replace hardcoded font sizes, weights, and line heights with typographic tokens
- Use semantic token names (`--text-heading`, `--text-body`) over size-based names (`--text-16`)
- Ensure hierarchy is unambiguous — readers should never wonder what level they are at

### Color
→ *Reference: [color-and-contrast](references/color-and-contrast.md) for token layers and contrast requirements.*
- Replace hex/rgb values with semantic color tokens
- Verify contrast ratios: 4.5:1 for body text, 3:1 for large text and UI elements
- Ensure theme consistency — only semantic tokens should change between light/dark

### Space & Layout
→ *Reference: [spatial-design](references/spatial-design.md) for spacing scales and surface layers.*
- Replace arbitrary pixel values with spacing tokens
- Align with the project's spacing scale (not your preferred one)
- Ensure surface layers are consistent: background → panel → surface

### Components
- Replace custom implementations with design system equivalents
- Match prop usage and variant selection to established patterns
- Preserve accessibility attributes during replacement

### Motion & Interaction
- Align transition timing, easing, and interaction patterns with existing conventions
- If the system defines motion tokens, use them

### Responsive
- Ensure breakpoints and responsive patterns match design system standards
- Verify container query usage matches project conventions

**NEVER**:
- Create new one-off tokens when existing ones cover the case
- Introduce a parallel naming system alongside the existing one
- Normalize visual style at the expense of accessibility
- Hardcode values that the design system provides as tokens
- Refactor architecture during normalization — stay focused on alignment

## 6. Clean Up

After normalization:

- Remove orphaned code made obsolete by the changes
- Verify no regressions: lint, type-check, and test per repository guidelines
- Consolidate any duplication introduced during the process
- Confirm the feature now reads as a natural part of the system, not a bolted-on addition
