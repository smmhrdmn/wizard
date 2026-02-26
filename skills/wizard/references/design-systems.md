# Design Systems

Governance, token architecture, and organizational patterns for maintaining a healthy design system. These rules come from maintaining production systems across multiple apps — they prioritize durability over cleverness.

## Token Architecture

Design tokens use three layers. Each layer has a distinct naming strategy and a clear role.

### Primitives

Raw values named by what they ARE. These never change between themes — they're the full palette of available values.

```css
:root {
  /* Color primitives */
  --blue-100: oklch(0.93 0.04 250);
  --blue-300: oklch(0.75 0.12 250);
  --blue-500: oklch(0.55 0.2 250);
  --blue-700: oklch(0.4 0.18 250);
  --blue-900: oklch(0.25 0.12 250);

  --neutral-0: oklch(1 0 0);
  --neutral-50: oklch(0.97 0 0);
  --neutral-100: oklch(0.93 0 0);
  --neutral-800: oklch(0.25 0 0);
  --neutral-900: oklch(0.15 0 0);
  --neutral-1000: oklch(0 0 0);

  /* Space primitives */
  --space-2: 0.125rem;
  --space-4: 0.25rem;
  --space-8: 0.5rem;
  --space-12: 0.75rem;
  --space-16: 1rem;
  --space-24: 1.5rem;
  --space-32: 2rem;
  --space-48: 3rem;
  --space-64: 4rem;

  /* Type primitives */
  --font-size-12: 0.75rem;
  --font-size-14: 0.875rem;
  --font-size-16: 1rem;
  --font-size-20: 1.25rem;
  --font-size-24: 1.5rem;
  --font-size-32: 2rem;

  --font-weight-400: 400;
  --font-weight-500: 500;
  --font-weight-600: 600;
  --font-weight-700: 700;

  --radius-4: 4px;
  --radius-8: 8px;
  --radius-12: 12px;
  --radius-full: 9999px;
}
```

### Semantic

Role-based tokens named by what they MEAN. This is the only layer that changes between themes.

```css
:root {
  /* Color roles */
  --color-primary: var(--blue-500);
  --color-primary-subtle: var(--blue-100);
  --color-primary-strong: var(--blue-700);

  --color-text: var(--neutral-900);
  --color-text-muted: var(--neutral-800);
  --color-text-subtle: var(--neutral-600);
  --color-text-on-primary: var(--neutral-0);

  --color-border: var(--neutral-200);
  --color-border-strong: var(--neutral-400);

  /* Space roles */
  --space-xs: var(--space-4);
  --space-sm: var(--space-8);
  --space-md: var(--space-16);
  --space-lg: var(--space-24);
  --space-xl: var(--space-48);

  /* Type roles */
  --text-body: var(--font-size-16);
  --text-sm: var(--font-size-14);
  --text-caption: var(--font-size-12);
  --text-heading: var(--font-size-24);
  --text-display: var(--font-size-32);
}
```

### Component

Scoped tokens named by where they're USED. Only create these when a component needs to deviate from semantic defaults or manage internal variants.

```css
.button {
  --button-bg: var(--color-primary);
  --button-text: var(--color-text-on-primary);
  --button-radius: var(--radius-8);
  --button-padding-x: var(--space-md);
  --button-padding-y: var(--space-sm);

  background: var(--button-bg);
  color: var(--button-text);
  border-radius: var(--button-radius);
  padding: var(--button-padding-y) var(--button-padding-x);
}

.button--secondary {
  --button-bg: var(--color-primary-subtle);
  --button-text: var(--color-primary-strong);
}

.button--ghost {
  --button-bg: transparent;
  --button-text: var(--color-primary);
}
```

### Theming Through the Semantic Layer

Themes work by reassigning the semantic layer only. Primitives and component tokens stay untouched.

```css
/* Light theme (default) */
:root {
  --color-primary: var(--blue-500);
  --color-text: var(--neutral-900);
  --color-text-muted: var(--neutral-600);
  --bg-page: var(--neutral-0);
  --bg-raised: var(--neutral-50);
  --panel-bg: var(--neutral-0);
  --surface-bg: var(--neutral-100);
  --color-border: var(--neutral-200);
}

/* Dark theme — only semantic tokens change */
[data-theme="dark"] {
  --color-primary: var(--blue-300);
  --color-text: var(--neutral-100);
  --color-text-muted: var(--neutral-400);
  --bg-page: var(--neutral-900);
  --bg-raised: var(--neutral-800);
  --panel-bg: var(--neutral-800);
  --surface-bg: var(--neutral-700);
  --color-border: var(--neutral-700);
}
```

No component CSS changes. No new overrides. The theme propagates through the semantic layer automatically.

## Naming Conventions

### Prefix Strategy

Namespace all tokens with a project prefix to prevent collisions:

```css
/* Mythril design system */
--myth-color-primary: oklch(0.55 0.2 250);
--myth-space-md: 1rem;
--myth-radius-default: 8px;

/* App-specific extensions */
--app-sidebar-width: 280px;
--app-header-height: 64px;
```

### Semantic Over Value-Based

Name tokens by role, not by appearance:

```css
/* Correct — survives a rebrand */
--color-primary: oklch(0.55 0.2 250);
--color-danger: oklch(0.55 0.22 25);

/* Wrong — breaks when blue is no longer primary */
--blue: oklch(0.55 0.2 250);
--red: oklch(0.55 0.22 25);
```

### Consistent Vocabulary

Pick one set of modifiers and use it everywhere. Do not mix:

```css
/* Consistent — one vocabulary for intensity */
--color-primary-subtle: ...;
--color-primary-default: ...;
--color-primary-strong: ...;
--color-danger-subtle: ...;
--color-danger-default: ...;
--color-danger-strong: ...;

/* Inconsistent — mixing modifier systems */
--color-primary-light: ...;   /* "light" */
--color-danger-faint: ...;    /* "faint" */
--color-warning-subtle: ...;  /* "subtle" */
```

For size scales, pick one system:

- Word scale: `xs / sm / md / lg / xl / 2xl`
- Numeric scale: `100 / 200 / 300 / 400 / 500`

Never mix them. If `--space-md` exists, don't also define `--space-300`.

### Predictable Patterns

If a token exists, its modifiers should follow a predictable pattern:

```css
/* If --color-primary exists, these should too */
--color-primary-subtle   /* lighter, for backgrounds */
--color-primary-default  /* standard use (can be aliased as just --color-primary) */
--color-primary-strong   /* darker, for emphasis or hover */

/* Same pattern for every color role */
--color-danger-subtle
--color-danger-default
--color-danger-strong
```

## Surface Systems

Three layers of background handle all container contexts. Each layer has a distinct spatial role.

### Background (`--bg-*`)

Page-level regions. The outermost containers.

```css
--bg-page: var(--neutral-0);        /* default page */
--bg-raised: var(--neutral-50);     /* sidebar, header, footer */
--bg-sunken: var(--neutral-100);    /* inset regions, wells */
```

### Panel (`--panel-*`)

Floating or elevated elements that sit above the background.

```css
--panel-bg: var(--neutral-0);
--panel-border: var(--color-border);
--panel-shadow: 0 1px 3px oklch(0 0 0 / 0.08), 0 4px 12px oklch(0 0 0 / 0.04);
--panel-radius: var(--radius-12);
```

Used for: cards, modals, dropdowns, popovers, tooltips.

### Surface (`--surface-*`)

Inline interactive states within panels or backgrounds.

```css
--surface-bg: var(--neutral-100);
--surface-bg-hover: var(--neutral-150);
--surface-bg-active: var(--neutral-200);
--surface-bg-selected: var(--color-primary-subtle);
```

Used for: button fills, input backgrounds, hover states, selected rows, toggle tracks.

### How They Compose

```html
<!-- bg-page: outermost layer -->
<main style="background: var(--bg-page);">

  <!-- panel: floating card -->
  <div class="card" style="background: var(--panel-bg); box-shadow: var(--panel-shadow);">
    <h2>Card title</h2>
    <p>Card content on the panel surface.</p>

    <!-- surface: interactive element inside the card -->
    <button style="background: var(--surface-bg);">
      Action
    </button>
  </div>
</main>
```

Each layer nests cleanly. A surface never appears at page level. A background never floats. This prevents the "everything is the same shade of gray" problem by giving each spatial role its own color logic.

## Promotion Rules

A pattern earns promotion to the shared design system when all three conditions are met:

1. **Used in 3+ apps or contexts.** One or two uses stay local. Premature extraction creates tokens nobody else needs (Rule of Three — Glass, Fowler).
2. **Stable for 2+ iterations.** If the pattern is still evolving, extracting it forces every consumer to absorb churn.
3. **General without modification.** If each context needs its own variant, it's not a shared pattern — it's a coincidence.

### Before Promotion

Keep it in the app's local CSS. Duplication across apps is cheaper than a wrong shared abstraction.

```css
/* app-a/styles.css — local pattern */
.pricing-card {
  --pricing-card-bg: var(--panel-bg);
  --pricing-card-accent: var(--color-primary);
  padding: var(--space-lg);
  border-radius: var(--radius-12);
}
```

### After Promotion

Move to the shared system. Update all consumers. Document the token's role.

```css
/* design-system/tokens.css — promoted */
--card-padding: var(--space-lg);
--card-radius: var(--radius-12);
--card-bg: var(--panel-bg);
```

## Drift Detection

### Signs of Drift

| Signal | Example | Risk |
|---|---|---|
| Hardcoded values | `color: #3b82f6` in a component | Bypasses theming |
| Magic numbers | `padding: 13px` when no token is 13 | Scale violation |
| Duplicate-but-different | `--card-bg` and `--panel-bg` resolving to the same value | Confusion, divergence over time |
| Unused tokens | `--color-accent` defined but never referenced | Dead weight, misleading palette |
| Naming inconsistency | `--color-text-light` alongside `--text-muted` alongside `--fg-subtle` | Unpredictable API |

### How to Audit

Search component CSS for raw values:

```bash
# Find hardcoded colors
grep -rn '#[0-9a-fA-F]\{3,8\}' src/components/
grep -rn 'rgb\|rgba\|hsl\|oklch' src/components/

# Find hardcoded spacing (px values not in token definitions)
grep -rn '[0-9]\+px' src/components/

# Find unused tokens
# 1. List all defined tokens
grep -oh '\-\-[a-z][a-z0-9-]*' src/tokens.css | sort -u > defined.txt
# 2. List all referenced tokens
grep -roh 'var(\-\-[a-z][a-z0-9-]*)' src/ | sort -u > used.txt
# 3. Compare
diff defined.txt used.txt
```

Any raw value in a component file is a potential drift. Not every match is a problem — some values are genuinely one-off (animation durations, specific SVG coordinates). But every match deserves a glance.

## When to Extract vs. Keep Local

| Extract when | Keep local when |
|---|---|
| Reused in 2+ places | Used in only one place |
| Stable for 2+ iterations | Still evolving or experimental |
| Works across contexts without changes | App-specific or context-dependent |
| Theme-dependent (needs to change in dark mode) | Static value that never varies |

**The cost of wrong abstraction exceeds the cost of duplication.** A bad shared token forces every consumer to work around it. Duplicated local CSS only costs a few extra bytes and can be cleaned up later with no coordination.

If you're debating whether to extract: don't. Wait until the second or third use forces the decision.

## Component Token Scoping

### Use Semantic Tokens Directly

Most components should consume semantic tokens without creating their own:

```css
.badge {
  background: var(--color-primary-subtle);
  color: var(--color-primary-strong);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: var(--text-caption);
}
```

No component tokens needed. The badge follows the system defaults.

### Add Component Tokens for Variants

Create component tokens when internal variants need coordinated overrides:

```css
.input {
  --input-bg: var(--surface-bg);
  --input-border: var(--color-border);
  --input-text: var(--color-text);
  --input-radius: var(--radius-8);
  --input-padding: var(--space-sm) var(--space-md);

  background: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--input-text);
  border-radius: var(--input-radius);
  padding: var(--input-padding);
}

.input:focus {
  --input-border: var(--color-primary);
}

.input--error {
  --input-border: var(--color-danger);
}

.input--filled {
  --input-bg: var(--surface-bg-active);
}
```

### Maximum Nesting Depth: Two

The token chain should never exceed: primitive -> semantic -> component.

```css
/* Correct: two levels */
--blue-500: oklch(0.55 0.2 250);           /* primitive */
--color-primary: var(--blue-500);           /* semantic */
--button-bg: var(--color-primary);          /* component */

/* Wrong: three levels of indirection */
--button-bg: var(--card-surface-bg);        /* component referencing component */
```

If you find yourself referencing one component's tokens from another component, the system is too nested. Reach back to the semantic layer instead.

## Anti-patterns

**Don't tokenize everything.** Only create tokens for values that are reused across components or that change between themes. A one-off `translateY(-2px)` hover effect does not need a token.

**Don't nest more than two levels deep** (practical guideline implied by three-layer architecture, not a formally codified rule). Every level of indirection makes debugging harder. When inspecting computed styles, you should reach a real value within two hops.

**Don't use value-based names for semantic roles.** `--blue` as your primary color breaks the moment the brand changes. `--color-primary` survives any palette swap.

**Don't skip the semantic layer.** Components referencing primitives directly (`background: var(--blue-500)`) bypass theming entirely. Always go through the semantic layer.

**Don't let one-off overrides accumulate.** If multiple components override the same semantic token, the token's default is probably wrong. Fix the token rather than scattering overrides.

**Don't create symmetric scales you won't use.** If your app only uses 3 spacing values, don't define 10. An incomplete scale that matches reality is better than a complete scale that creates decision fatigue.
