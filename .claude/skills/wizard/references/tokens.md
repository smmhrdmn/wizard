---
name: tokens
description: Design token scanner and diagnostic. Inventories existing tokens, finds hardcoded values that should be tokens, and reports drift — similar values, unused tokens, naming inconsistencies.
args:
  - name: focus
    description: "Specific token domain to scan: color, spacing, typography, border, shadow, motion (optional — scans all if omitted)"
    required: false
---

**First**: Use the frontend-design skill, specifically the [design-systems reference](references/design-systems.md) for token architecture and naming conventions.

Scan the project's design tokens. Inventory what exists, find what's missing, and report drift.

## Step 1: Scan Token Sources

Find all design token definitions in the project:

### CSS Custom Properties
- Scan all `.css` files for `--*` declarations
- Group by domain: color (`--color-*`), spacing (`--space-*`, `--gap-*`), typography (`--font-*`, `--text-*`, `--leading-*`), border (`--radius-*`, `--border-*`), shadow (`--shadow-*`, `--elevation-*`), motion (`--duration-*`, `--ease-*`)
- Note the declaration file and line number for each

### Tailwind Config
- Scan `tailwind.config.*` for theme extensions
- Map custom theme values to token domains (colors, spacing, fontSize, fontFamily, borderRadius, boxShadow, transitionDuration, transitionTimingFunction)

### Other Token Sources
- SCSS variables (`$variable-name`)
- JSON/JS token files (common in design system packages)
- Styled-components / CSS-in-JS theme objects
- Framework-specific theme files

If `$ARGUMENTS` specifies a focus domain (e.g., `color`, `spacing`), limit the scan to that domain only.

## Step 2: Token Inventory

Report what exists, organized by domain:

### Color Tokens
- **Primitives**: Raw color values (`--blue-500`, `--gray-100`)
- **Semantic**: Meaning-based tokens (`--color-primary`, `--color-danger`, `--color-surface`)
- **Component**: Application-specific (`--button-bg`, `--card-border`)
- Note: Are there proper layers (primitive -> semantic -> component) or is it flat?

### Spacing Tokens
- Scale values and their progression (e.g., 4/8/12/16/24/32/48/64)
- Is the scale consistent (geometric, arithmetic) or arbitrary?
- Named tokens vs raw values

### Typography Tokens
- Font families defined
- Size scale (fixed or fluid with `clamp()`?)
- Weight tokens
- Line-height tokens
- Are typography tokens semantic (`--text-heading`) or size-based (`--text-16`)?

### Border & Radius Tokens
- Border-radius scale
- Border-width tokens
- Border-color tokens (or do they reference color tokens?)

### Shadow & Elevation Tokens
- Shadow scale (subtle, medium, large, etc.)
- Elevation system (layered surfaces?)
- Consistent or one-off values?

### Motion Tokens
- Duration values (fast, normal, slow)
- Easing curves defined
- Any spring physics or animation presets?

For each domain, report: **count**, **naming pattern**, **organization quality** (layered/flat, consistent/inconsistent).

## Step 3: Hardcoded Value Scan

Scan component CSS, JSX/TSX style attributes, and inline styles for raw values that should be tokens:

### Colors
- Raw hex values (`#3b82f6`, `#fff`)
- Raw rgb/rgba values (`rgb(59, 130, 246)`)
- Raw hsl/hsla/oklch values
- Report each unique value with file:line references and frequency

### Spacing
- Arbitrary pixel values in padding, margin, gap (`padding: 13px`, `gap: 7px`)
- Values that don't match the spacing scale
- Report with file:line references

### Typography
- Hardcoded font-family declarations
- Hardcoded font-size values
- Hardcoded line-height values
- Hardcoded font-weight numbers

### Other
- Hardcoded border-radius values
- Hardcoded box-shadow values
- Hardcoded transition-duration or easing values

For each hardcoded value, note:
- The value
- Where it appears (file:line)
- How many times it appears
- Which existing token it should use (if one exists) or suggest creating one

## Step 4: Drift Report

Identify inconsistencies and waste in the token system:

### Similar But Different
Values that are close enough to likely be unintentional:
- Two blues that differ by < 5% in any OKLCH channel
- Spacing values within 2px of each other (13px and 14px, 23px and 24px)
- Font sizes within 1px of each other
- Nearly identical shadows

For each pair, report the values, where they're defined, and suggest consolidation.

### Unused Tokens
Tokens that are defined but never referenced in any component:
- Scan all component files for references to each defined token
- Report tokens with zero references
- Distinguish between "definitely unused" and "possibly used dynamically" (e.g., constructed variable names)

### Naming Inconsistencies
- Mixed naming conventions (`--color-primary` alongside `--primaryColor`)
- Inconsistent domain prefixes (`--color-*` mixed with `--bg-*` for the same concept)
- Tokens that skip the semantic layer (component styles referencing primitives directly like `var(--blue-500)`)
- Scale numbering inconsistencies (100-900 in some scales, sm/md/lg in others)

### Missing Domains
Token domains that have no tokens at all:
- No motion tokens (durations, easings) — common gap
- No shadow/elevation tokens
- No border-radius tokens
- No semantic color layer

## Step 5: Recommendations

Based on findings, provide actionable suggestions:

### Tokenize These Values
Hardcoded values that appear 3+ times or are theme-dependent should become tokens. List specific suggestions with proposed token names following the project's existing naming convention.

### Consolidate These Tokens
Similar-but-different values that should be merged. Specify which value to keep and which references to update.

### Fill These Gaps
Missing token domains or layers that would improve the system. Prioritize by impact:
1. Semantic color layer (if missing) — highest impact for theming
2. Spacing scale — highest impact for consistency
3. Motion tokens — often completely absent
4. Typography semantic tokens — important for maintainability

### Clean Up
- Unused tokens to remove
- Naming inconsistencies to resolve
- Primitive references in components to replace with semantic tokens

## Output Format

```
Token Diagnostic: [project name]
Focus: [domain or "all"]

INVENTORY
─────────
Colors:     [count] tokens ([primitive]/[semantic]/[component])
Spacing:    [count] tokens
Typography: [count] tokens
Borders:    [count] tokens
Shadows:    [count] tokens
Motion:     [count] tokens
Total:      [count] tokens

HARDCODED VALUES
────────────────
[count] unique hardcoded values found across [count] files
[Top offenders by frequency, with file:line references]

DRIFT
─────
Similar values:       [count] pairs
Unused tokens:        [count]
Naming issues:        [count]
Missing domains:      [list]

RECOMMENDATIONS
───────────────
Priority 1: [highest impact action]
Priority 2: [next action]
Priority 3: [next action]
...
```

Provide specific file:line references throughout so issues can be located and fixed directly.
