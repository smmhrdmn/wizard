---
name: audit
description: Diagnostic scan across accessibility, performance, design tokens, anti-patterns, responsive, and interaction states. Generates severity-ranked findings with command recommendations.
args:
  - name: focus
    description: Specific area or component to audit (optional — audits entire project if omitted)
    required: false
---

Run a systematic diagnostic scan and generate a severity-ranked report. This is a read-only audit — document issues for other commands to fix.

**First**: Read the project config for design tokens, component patterns, and architectural decisions. Then use the frontend-design skill for design principles, anti-patterns, and domain references.

## Diagnostic Scan

Scan the relevant files (HTML, CSS, JS/TS, components) across six dimensions:

### 1. Accessibility

- **Contrast**: Text contrast ratios below 4.5:1 for body text, 3:1 for large text and UI elements
- **Missing alt text**: Images without descriptions, decorative images missing `alt=""`
- **Color-only meaning**: Information conveyed through color alone without secondary indicators
- **Focus order**: Illogical tab order, missing or invisible focus indicators, keyboard traps
- **Form labels**: Inputs without associated labels, missing required indicators, poor error messaging
- **ARIA**: Interactive elements without proper roles, labels, or states; incorrect ARIA usage that harms rather than helps
- **Semantic HTML**: Divs used where buttons, links, nav, main, article should be; heading hierarchy violations

### 2. Performance

- **Large images**: Unoptimized assets, missing lazy loading, no responsive `srcset`
- **Render-blocking resources**: CSS/JS blocking first paint without async/defer
- **Unnecessary JS**: Heavy libraries for simple tasks, unused imports, oversized bundles
- **Layout thrashing**: Reading and writing layout properties in loops
- **Expensive animations**: Animating `width`, `height`, `padding`, `margin` instead of `transform`/`opacity`

### 3. Design Tokens

- **Hardcoded values**: Raw hex/rgb colors, pixel spacing, font sizes that should be tokens
- **Drift from system**: Components using values that diverge from established token scales
- **Unused tokens**: Defined tokens that are never referenced
- **Naming inconsistency**: Tokens that break the project's naming convention (e.g., mixing `--color-primary` with `--blue-500` at the component level)
- **Missing semantic layer**: Primitives used directly in components, bypassing semantic tokens

### 4. Anti-Patterns

Run the **AI Slop Test** from the frontend-design skill. Check for every DON'T in the skill:

- **Layout**: Identical card grids (icon + heading + description, 3-column repeat), cards nested inside cards
- **Color**: Dark mode with cyan/purple accents, gradient text on headings, neon glows, pure black/white, gray text on colored backgrounds
- **Typography**: Inter/Roboto/system defaults without intentional styling, no real hierarchy beyond size, large rounded-corner icons above headings
- **Decoration**: Glassmorphism everywhere, rounded rectangles with generic shadows, decorative sparklines, gradients/glows filling empty space
- **Motion**: Bounce/elastic easing as default, hover effects on everything, purposeless animations, durations over 500ms
- **Content**: Generic "Welcome to [Product]" heroes, feature grids, testimonial carousels
- **Interaction**: Every button primary, disabled buttons without explanation, redundant copy, modals overuse

### 5. Responsive

- **Broken at common widths**: Test 320px, 375px, 768px, 1024px, 1280px, 1440px
- **Missing input-method adaptation**: No `pointer: coarse/fine` detection, same hit targets for touch and mouse
- **Touch targets**: Interactive elements below 44x44px on touch contexts
- **Fixed widths**: Hardcoded pixel widths causing horizontal overflow
- **Desktop-first only**: Layouts that hide or amputate features on mobile instead of adapting
- **Missing fluid techniques**: Breakpoint jumps where `clamp()`, `min()`, `max()` would smooth transitions

### 6. Interaction States

Check every interactive element for missing states:

- **Hover**: Does the element signal interactivity on pointer hover?
- **Focus**: Is there a visible `:focus-visible` indicator for keyboard navigation?
- **Active/Pressed**: Does the element respond to click/tap?
- **Disabled**: If applicable, is the disabled state visually distinct with an explanation of why?
- **Loading**: Do async actions show loading feedback?
- **Error**: Are error states helpful, non-blaming, and actionable?
- **Success**: Do success states confirm the action and guide next steps?
- **Empty**: Do empty states teach the interface and guide toward action?

---

## Generate Report

### Anti-Patterns Verdict

**Start here.** Pass/fail: Does this look AI-generated? List specific tells from the skill's AI Slop Test. Be direct.

### Summary

- Total findings by severity: Critical / Serious / Moderate / Minor
- Top 3 most impactful issues
- Systemic patterns (issues that repeat across multiple files/components)

### Findings by Severity

#### Critical
Issues that block core functionality, violate WCAG A, or cause data loss.

#### Serious
Significant usability/accessibility impact, WCAG AA violations, major anti-patterns.

#### Moderate
Quality issues, WCAG AAA violations, performance concerns, design system drift.

#### Minor
Inconsistencies, optimization opportunities, polish items.

For each finding, document:
- **Location**: File path and line number (or component name)
- **Category**: Which of the 6 dimensions
- **Issue**: What is wrong
- **Impact**: How it affects users
- **Standard**: Which WCAG criterion, design principle, or skill guideline it violates
- **Fix command**: Which Wizard command addresses it

### Command Mapping

Map findings to the commands that fix them:
- Accessibility issues → the **review** workflow
- Token drift, hardcoded values → the **normalize** workflow
- Missing interaction states → the **harden** workflow
- Anti-patterns, visual quality → the **critique** workflow then targeted fixes
- Performance issues → the **optimize** workflow
- Multiple related issues → suggest the **batch** workflow for parallel processing

### What's Working

Note 2-3 things done well. Specific practices to maintain or replicate elsewhere.

### Recommended Action Plan

1. **Immediate**: Critical findings — fix before shipping
2. **Short-term**: Serious findings — this sprint
3. **Medium-term**: Moderate findings — next sprint
4. **Long-term**: Minor findings — when time allows

If there are more than 6 findings, recommend using the **batch** workflow to process related groups in parallel.

**NEVER**:
- Report issues without explaining user impact
- Mix severity levels inconsistently
- Skip the anti-patterns check — it is the most important dimension
- Provide vague recommendations — every finding needs a specific fix path
- Report false positives — verify before documenting
- Skip positive findings — acknowledge what works
