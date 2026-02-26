---
name: review
description: Combined accessibility and visual design review. Checks WCAG 2.2 compliance, screen reader considerations, keyboard navigation, typography, color, spacing, hierarchy, and visual rhythm. Provides severity-ranked findings with fix suggestions.
args:
  - name: focus
    description: Specific component, page, or area to review (optional — reviews entire project if omitted)
    required: false
---

Conduct a two-part review combining accessibility compliance and visual design quality. This is a detailed, technical review that produces specific findings with file:line references and fix suggestions.

**First**: Read the project config for design tokens, component patterns, and accessibility requirements. Then use the frontend-design skill and consult these references:
- **interaction-design** reference for focus management, progressive disclosure, and input handling
- **color-and-contrast** reference for OKLCH, contrast ratios, and perceptual uniformity
- **typography** reference for type scales, hierarchy, and fluid sizing
- **spatial-design** reference for spacing scales, surface layers, and visual rhythm

---

## Part 1: Accessibility Review

Evaluate against WCAG 2.2 criteria, organized by principle:

### Perceivable

- **Text alternatives** (1.1.1): Every non-text element has a text equivalent. Decorative images use `alt=""`. Complex images have extended descriptions.
- **Color contrast** (1.4.3, 1.4.6): Body text meets 4.5:1 minimum. Large text (18px+ bold, 24px+ regular) meets 3:1. UI components and graphical objects meet 3:1. Check both light and dark themes.
- **Color-only information** (1.4.1): Color is never the sole means of conveying information, indicating action, prompting response, or distinguishing elements.
- **Resize** (1.4.4): Content remains functional at 200% zoom. No horizontal scrolling at 320px equivalent.
- **Text spacing** (1.4.12): Content remains readable when line height is 1.5x font size, paragraph spacing 2x, letter spacing 0.12em, word spacing 0.16em.

### Operable

- **Keyboard access** (2.1.1, 2.1.2): All functionality is available via keyboard. No keyboard traps. Custom widgets implement expected keyboard patterns (arrow keys for tabs, Enter/Space for buttons).
- **Focus visible** (2.4.7): Focus indicator is always visible for keyboard users. Uses `:focus-visible` not `:focus`. Focus indicator has at least 3:1 contrast against adjacent colors (SC 1.4.11, AA). 2-3px thickness is recommended for AAA (SC 2.4.13 Focus Appearance).
- **Focus not obscured** (2.4.11): Focused elements are not entirely hidden by sticky headers, footers, or other author-created content (new AA criterion in WCAG 2.2).
- **Focus order** (2.4.3): Tab order follows logical reading flow. Modals trap focus correctly and return focus on close.
- **Target size** (2.5.8, 2.5.5): Interactive targets are at least 24x24px (AA). 44x44px for touch-primary interfaces (AAA).
- **Skip links**: Present and functional for bypassing navigation.

### Understandable

- **Labels** (3.3.2): Every form input has a visible, associated label. Placeholder text does not replace labels.
- **Error identification** (3.3.1, 3.3.3): Errors are identified in text (not color alone), describe what went wrong, and suggest how to fix it.
- **Consistent navigation** (3.2.3): Navigation appears in the same relative order across pages.
- **Language** (3.1.1): Page language is declared. Language changes within content are marked.

### Robust

- **Valid HTML** (4.1.1): Markup parses correctly. IDs are unique. ARIA roles and properties are valid.
- **Name, Role, Value** (4.1.2): Custom interactive elements expose correct name, role, and state to assistive technology.
- **Status messages** (4.1.3): Dynamic content changes (toasts, alerts, live regions) are announced to screen readers via `aria-live` or appropriate roles.

### Screen Reader Considerations

- Heading hierarchy is logical (h1 > h2 > h3, no skipped levels)
- Landmark regions are defined (nav, main, aside, footer)
- Link text is descriptive (no "click here" or "read more" without context)
- ARIA is used to supplement semantic HTML, not replace it
- Dynamic content updates are announced appropriately

---

## Part 2: Visual Design Review

Evaluate the interface's visual quality against the skill's design principles:

### Hierarchy

- Is there a clear visual hierarchy? Can you identify the primary element, secondary elements, and supporting content at a glance?
- Does size, weight, color, and position work together to communicate importance?
- Is there one primary action per context, with secondary/tertiary actions visually subordinate?
- Are headings creating scannable structure, or is everything the same visual weight?

### Typography

Reference the **typography** guidelines from the skill:
- Is there a defined type scale, or are sizes arbitrary?
- Does the scale use semantic tokens (`--text-heading`, `--text-body`) or size-based names?
- Is `clamp()` used for fluid sizing across viewports?
- Are weight and size varied together for unambiguous hierarchy?
- Is body text comfortable to read? (line length 45-75 characters, line height 1.4-1.6, adequate size)
- Are fonts tested at every size they appear, not just headings?

### Color Usage

Reference the **color-and-contrast** guidelines from the skill:
- Is color used to communicate meaning, not just decoration?
- Are neutrals tinted toward the brand hue for cohesion?
- Is the semantic token layer working (primary, danger, surface change between themes, primitives do not)?
- Are accent colors drawing attention to the right elements?
- Does meaning come through without color? (important for accessibility and design quality)

### Spacing & Rhythm

Reference the **spatial-design** guidelines from the skill:
- Is spacing based on a consistent scale or arbitrary values?
- Is there visual rhythm — tight groupings for related items, generous gaps for separation?
- Is whitespace intentional (creating breathing room) or accidental (leftover)?
- Does content density match the use case (dense for data, generous for marketing)?
- Are surface layers clear (background > panel > surface)?

### Alignment & Consistency

- Are elements aligned to a clear grid or baseline?
- Are similar elements styled consistently across the interface?
- Do patterns repeat predictably, or does every section feel like a different design?
- Are visual details (border-radius, shadow, spacing) applied consistently?

---

## Generate Report

### Score

- **Critical issues**: [count] (must fix before shipping — WCAG A violations, broken keyboard access, missing labels)
- **Serious issues**: [count] (should fix — WCAG AA violations, significant hierarchy problems)
- **Moderate issues**: [count] (improve — WCAG AAA, visual polish, rhythm)
- **Minor issues**: [count] (nice to have)
- **Overall assessment**: One sentence on the current state and the most important next step.

### Accessibility Findings

For each finding:
- **Location**: `file:line` reference
- **WCAG criterion**: Number and name (e.g., 1.4.3 Contrast Minimum)
- **Level**: A / AA / AAA
- **Issue**: What is wrong
- **Fix**: Specific code change or approach to resolve it

### Visual Design Findings

For each finding:
- **Location**: `file:line` reference or component name
- **Principle**: Which design guideline from the skill (typography, color, spacing, hierarchy)
- **Issue**: What is wrong and why it matters
- **Fix**: Specific suggestion — not "consider improving" but "change line-height from 1.2 to 1.5 on `.body-text`"

### Systemic Patterns

If the same issue appears in 3+ places, call it out as a systemic pattern with a single fix recommendation rather than listing each instance individually.

**NEVER**:
- List problems without fix suggestions — every finding needs a path forward
- Report WCAG violations without citing the specific criterion
- Give vague visual feedback like "hierarchy could be improved" — say what specifically and how
- Combine accessibility and visual findings in a single list — keep the two parts distinct
- Skip screen reader considerations — sighted keyboard users and screen reader users have different needs
- Assume dark mode works if light mode passes — check both explicitly
