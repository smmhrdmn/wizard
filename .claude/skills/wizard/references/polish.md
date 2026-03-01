---
name: polish
description: Final quality pass before shipping. Systematic review of alignment, typography, color, spacing, states, motion, copy, and edge cases — thorough but not restructuring.
args:
  - name: target
    description: The feature or area to polish (optional)
    required: false
---

**First**: Consult this skill's design principles, anti-patterns, and domain references.

Perform the final quality pass before shipping. This is thorough inspection and targeted fixes — not restructuring, not redesign.

## Pre-Polish Gate

Before starting, assess readiness:

1. **Is it functionally complete?** If core features are still being built, stop. Polish is the last step, not the first.
2. **Are there known incomplete areas?** Mark them with TODOs and skip them during polish. Don't polish placeholders.
3. **What's the quality bar?** MVP ships with fewer polish passes. A flagship feature gets the full treatment.

If the feature is not ready, say so and suggest what needs to happen first.

## Systematic Passes

Work through each pass methodically. For each one, scan the target area, note issues, fix what you can, and flag what needs the user's input.

### Pass 1: Alignment & Spacing
→ *Reference: [spatial-design](references/spatial-design.md) for spacing scales and surface layers.*

- All elements align to the spacing scale — no arbitrary pixel values
- Consistent gaps between related items (tight) and between groups (generous)
- Optical alignment checked — icons and asymmetric shapes may need visual offset to appear centered
- Spacing tokens used throughout, no hardcoded `px` values in component styles
- Grid adherence at all breakpoints

### Pass 2: Typography
→ *Reference: [typography](references/typography.md) for type scales and fluid sizing.*

- Hierarchy is clear and consistent — same element types use same sizes/weights everywhere
- Line length stays within 45-75 characters for body text
- Line heights appropriate for font size and context (tighter for headings, looser for body)
- No widows or orphans in prominent text blocks
- Font loading handled — no FOUT/FOIT flashes
- Semantic typography tokens used (`--text-heading`, not `--text-24`)

### Pass 3: Color & Contrast
→ *Reference: [color-and-contrast](references/color-and-contrast.md) for OKLCH, token architecture, and contrast requirements.*

- All text meets WCAG AA contrast (4.5:1 body, 3:1 large text and UI elements)
- No hardcoded hex/rgb/hsl values — all use design tokens
- Tinted neutrals — avoid pure gray or pure black on large surfaces; subtle color tint toward brand hue (pure black acceptable for OLED dark modes)
- No gray text on colored backgrounds — use a tinted shade or transparency instead
- Color meaning is consistent (same color = same meaning throughout)
- Focus indicators visible with sufficient contrast

### Pass 4: Interaction States

Every interactive element must have:

- **Default** — clear resting state
- **Hover** — subtle feedback (color shift, slight scale, shadow change)
- **Focus-visible** — keyboard focus ring (never removed without replacement)
- **Active** — press/click feedback
- **Disabled** — visually non-interactive with explanation of why
- **Loading** — async action feedback where applicable
- **Error** — validation feedback with recovery guidance
- **Empty** — helpful empty states that teach the interface

Missing states create confusion. Flag every gap.

### Pass 5: Motion & Transitions
→ *Reference: [motion-design](references/motion-design.md) for easing curves, orchestration, and performance.*

- All state changes have appropriate transitions (100ms feedback, 300ms transitions, 500ms choreography)
- Easing uses exponential deceleration (ease-out-quart/quint) — no bounce or elastic unless intentionally playful
- Animations use only `transform`, `opacity`, and `filter` for 60fps performance
- Staggered entrances for grouped elements (~30-50ms offset as a starting point)
- `prefers-reduced-motion` respected with reduced or no-motion alternative
- No decorative motion that serves no communicative purpose

### Pass 6: Copy & Content
→ *Reference: [ux-writing](references/ux-writing.md) for voice, microcopy, and content patterns.*

- Consistent terminology — same things called the same names throughout
- Consistent capitalization pattern (Title Case or Sentence case, not both)
- No typos or grammar errors
- Labels are concise — not too wordy, not too cryptic
- Punctuation is consistent (periods on sentences, not on short labels)
- Error messages are helpful and suggest recovery, not just state the problem
- No redundant text (headings that restate subheadings, labels that duplicate placeholders)

### Pass 7: Icons & Images

- Icons are from a consistent family or style
- Icon sizing is consistent within context
- Icons optically aligned with adjacent text (may need slight vertical offset)
- All images have descriptive alt text
- Images don't cause layout shift — dimensions or `aspect-ratio` set
- Responsive images used where appropriate (`srcset`, `picture`)

### Pass 8: Forms & Inputs
→ *Reference: [interaction-design](references/interaction-design.md) for input handling and feedback patterns.*

- All inputs have visible, associated labels
- Required field indicators are clear and consistent
- Error messages are inline, specific, and helpful
- Tab order follows logical reading order
- Validation timing is consistent (on blur, on change, or on submit — not mixed)
- Autofocus used appropriately (first field on dedicated forms, not on every page)

### Pass 9: Edge Cases

- Loading states for all async operations
- Empty states that teach ("No projects yet — create your first one")
- Error states with recovery paths, not dead ends
- Long content handled (truncation, overflow, wrapping)
- Missing data handled gracefully (no "undefined" or blank spots)
- Boundary cases (0 items, 1 item, 1000 items)

### Pass 10: Responsiveness
→ *Reference: [responsive-design](references/responsive-design.md) for container queries, fluid techniques, and input adaptation.*

- Works at mobile, tablet, and desktop breakpoints
- Touch targets are 44x44px minimum on touch devices with adequate spacing
- No text smaller than 14px on mobile
- No horizontal scrolling — content fits viewport
- Content reflows logically, nothing hidden that desktop users need
- Input method detection considered (`pointer: coarse/fine`)

### Pass 11: Performance

- No layout shift on load (CLS)
- Images optimized (modern formats, lazy loading for below-fold)
- No console errors or warnings
- Smooth interactions — no lag or jank during normal use

### Pass 12: Code Quality

- No `console.log` or debug logging
- No commented-out code blocks
- No unused imports
- Consistent naming conventions
- Proper semantic HTML (`<button>` for actions, `<a>` for navigation, landmarks for structure)
- ARIA attributes where semantic HTML is insufficient
- No TypeScript `any` or suppressed errors

## Polish Summary

After completing all passes, provide a checklist:

```
Polish Report: [target]

PASS:
- [ ] Alignment & Spacing
- [ ] Typography
- [ ] Color & Contrast
- [ ] Interaction States
- [ ] Motion & Transitions
- [ ] Copy & Content
- [ ] Icons & Images
- [ ] Forms & Inputs
- [ ] Edge Cases
- [ ] Responsiveness
- [ ] Performance
- [ ] Code Quality

Issues found: [count]
Issues fixed: [count]
Issues flagged for user: [count]
```

Mark each area as PASS or NEEDS ATTENTION with specific details for anything that needs attention.

## Principles

- **Fix details, don't restructure.** Polish is refinement, not redesign. If something needs restructuring, that's a separate task.
- **Consistent quality level.** Don't perfect one area while leaving others rough. Bring everything to the same standard.
- **Test it yourself.** After fixing, interact with the feature. Click things. Tab through it. Resize the browser. Use it like a real person would.
- **Don't introduce bugs.** Every fix should be verified. Polish that breaks functionality is not polish.
