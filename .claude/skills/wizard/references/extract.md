---
name: extract
description: Pull reusable components, tokens, and patterns out of feature code into the design system
args:
  - name: target
    description: The feature, component, or area to extract from (optional)
    required: false
---

Identify reusable patterns, components, and design tokens in feature code and extract them into shared, systematic locations.

## 1. Read Project Context

Read the project config and understand the project's component organization, token architecture, and design system conventions.

## 2. Discover What Exists

→ *Reference: [design-systems](references/design-systems.md) for token architecture, naming conventions, and governance.*

Before extracting anything, map the existing system:

- **Component library**: Where do shared components live? What naming conventions are used?
- **Token structure**: How are tokens organized? (Primitives → semantic → component layers? Flat list? Tailwind config?)
- **Import conventions**: How are shared components imported and consumed?
- **Documentation patterns**: Is there a Storybook, component catalog, or docs pattern?

**CRITICAL**: If no design system or shared component location exists, STOP and call the AskUserQuestionTool to clarify. before creating one. Understand where things should go and what structure is preferred.

## 3. Identify Extraction Candidates

Scan the target area for:

### Component candidates
- **Repeated UI patterns**: Similar markup used in 2+ places (cards, list items, form groups, badges, etc.)
- **Inconsistent variations**: Multiple implementations of the same concept (3 different button styles, 2 modal implementations)
- **Complex local components**: Well-built components trapped in a single feature that others could use

### Token candidates
- **Hardcoded colors**: Hex, rgb, or hsl values in component files that should be CSS custom properties
- **Hardcoded spacing**: Arbitrary pixel values that should reference the spacing scale
- **Hardcoded typography**: Font sizes, weights, line heights that should be typographic tokens
- **Hardcoded shadows, radii, z-indices**: Any repeated visual value

### Pattern candidates
- **Layout patterns**: Consistent approaches to page structure, grid usage, or content arrangement
- **Interaction patterns**: Common flows (create, edit, delete, search, filter) that could be documented

## 4. Apply Promotion Rules

→ *Reference: [design-systems](references/design-systems.md) for promotion criteria.*

Not everything should be extracted. Apply these rules:

| Occurrences | Action |
|-------------|--------|
| 1 use | Keep local. It is not a pattern yet — it is a feature. Premature extraction adds complexity. |
| 2 uses | Flag as a candidate. It may be ready for extraction, but examine whether the two uses are truly the same pattern or coincidentally similar. |
| 3+ uses | Extract. This is a proven pattern that benefits from a shared implementation. |

**Additional criteria:**
- Is the pattern stable, or still evolving? (Extracting a moving target creates churn)
- Is it general-purpose, or tightly coupled to one domain? (A "UserCard" is not the same as a generic "Card")
- Would systematizing this genuinely improve consistency, or just add indirection?

## 5. Propose Extraction Plan

Present findings before executing:

- **Components to extract**: Which UI elements, where they will live, what their API will be
- **Tokens to create**: Which hardcoded values become tokens, what they will be named
- **Patterns to document**: Which interaction or layout patterns to codify
- **Things to leave alone**: What you considered extracting but decided against, and why

For each component, specify:
- Name (matching existing naming conventions)
- Props API with types and defaults
- Variants needed
- Where it will live in the project structure

## 6. Extract

### Component Extraction

Build well-designed, reusable versions:

- **Clear props API**: Sensible defaults, minimal required props
- **Proper variants**: Cover known use cases without over-engineering (3 variants that cover 90% beats 12 that cover 100%)
- **Accessibility built in**: ARIA attributes, keyboard navigation, focus management as part of the component, not left to consumers
- **Match existing conventions**: File location, naming, export pattern, style approach — all match the project's established patterns

```tsx
// Good: Focused component with clear API
interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

// Bad: Over-abstracted component that tries to be everything
interface FlexibleContainerProps {
  as?: keyof JSX.IntrinsicElements;
  variant?: string;
  size?: string;
  color?: string;
  // ... 20 more props
}
```

### Token Extraction

Create tokens with proper layering:

- **Primitives**: Raw values named by what they are (`--blue-500`, `--space-4`)
- **Semantic**: Values named by what they mean (`--color-primary`, `--space-component-gap`)
- **Component**: Values scoped to component context (`--button-padding`, `--card-radius`)

Only tokenize values that are:
- Reused across 2+ components
- Theme-dependent (change between light/dark)
- Part of a scale or system (spacing, typography, color)

Do NOT tokenize one-off values that happen to be hardcoded. A border-radius used on exactly one element is fine as a local value.

### Pattern Documentation

For interaction or layout patterns worth codifying:
- When to use this pattern
- Code example
- Known variations
- Accessibility considerations

## 7. Migrate

Replace existing implementations with the extracted versions:

- Find all instances of the pattern you extracted
- Replace each with the shared version, passing appropriate props
- Verify visual and functional parity at each replacement
- Delete the old inline implementations
- Remove any orphaned styles, utilities, or helpers

## 8. Verify

- **Visual parity**: Extracted components look identical to the originals in context
- **Functional parity**: All interactions, states, and behaviors preserved
- **No orphaned code**: Old implementations fully removed
- **Consistent API**: Extracted components follow project conventions for naming, props, and exports
- **Accessible**: Keyboard navigation, screen reader support, and ARIA attributes verified
- **Documented**: New components discoverable by other developers (Storybook, JSDoc, or README as appropriate)
