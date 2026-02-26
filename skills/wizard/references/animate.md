---
name: animate
description: Add purposeful motion — feedback, transitions, and one hero moment per view
args:
  - name: target
    description: The feature or component to animate (optional)
    required: false
---

Analyze a feature and add motion that serves a purpose — feedback, orientation, or one intentional moment of craft.

## 1. Read Project Context

Read the project config and understand the project's architecture, existing motion patterns, and any motion tokens already defined.

## 2. Gather Context

You cannot animate well without knowing the constraints. You need:
- **Target audience**: Power users who value speed? General audience? Motion-sensitive users?
- **Brand personality**: Playful or serious? Energetic or calm?
- **Performance budget**: Mobile-first? Complex page with many elements?
- **Existing motion patterns**: Does the project already have transition timing, easing, or motion tokens?

Attempt to gather these from the current thread or codebase.

1. If you infer answers from existing design and functionality, you MUST STOP and STOP and call the AskUserQuestionTool to clarify. whether your inferences are correct.
2. If you cannot infer with confidence, you MUST STOP and call the AskUserQuestionTool to clarify. before proceeding.

Guessing leads to inappropriate or excessive animation.

## 3. Assess Animation Opportunities

→ *Reference: [motion-design](references/motion-design.md) for timing tables, easing curves, and when NOT to animate.*

### Identify where motion would help
- **Missing feedback**: Actions without visual acknowledgment (button clicks, form submissions, saves)
- **Jarring transitions**: Instant state changes that disorient (show/hide, route changes, layout shifts)
- **Unclear relationships**: Spatial connections that are not obvious (where did this come from? where did it go?)
- **One hero opportunity**: The single moment in this view worth investing real craft in

### Identify where motion would hurt
- **High-frequency actions**: Things users do 50+ times a day (filter, sort, switch tabs in a dashboard)
- **Dense professional UIs**: Admin panels, data tables, code editors — speed is the feature
- **Repeated identical actions**: If a user deletes 20 items, the animation should not play 20 times

**The line is simple: motion as feedback is essential. Motion as decoration is debt.**

## 4. Plan Animation Strategy

### The One Hero Moment Rule

Pick ONE signature moment per view. This is where you invest craft — a page transition, a meaningful state change, an entrance choreography. Everything else should be functional and restrained.

- **Hero moment**: The single animation users will remember. What is it?
- **Feedback layer**: Which interactions need acknowledgment? (buttons, form validation, saves)
- **Transition layer**: Which state changes need smoothing? (show/hide, expand/collapse, route changes)

Do NOT plan a "delight layer" as a separate category. Delight comes from the hero moment being excellent, not from adding confetti everywhere.

## 5. Propose Changes

Present the animation plan before implementing:
- The hero moment and why it matters
- Functional feedback animations (button press, validation, loading)
- Transition animations (state changes, content reveals)
- Which elements will NOT be animated and why

## 6. Implement

### Timing
→ *Reference: [motion-design](references/motion-design.md) timing table.*

| Duration | Purpose | Examples |
|----------|---------|----------|
| 100ms | Instant feedback | Button press, toggle, hover |
| 200-300ms | State changes | Menu open, panel slide, content swap |
| 300-500ms | Layout changes | Accordion, modal entrance, card expansion |
| 500ms max | Complex choreography | Page transition, hero entrance |

**Exit animations are faster than entrances.** Use ~75% of enter duration.

### Easing
→ *Reference: [motion-design](references/motion-design.md) easing curves.*

Use exponential easing for natural deceleration:
```css
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

If the project defines motion tokens, use those instead — do not introduce parallel easing values.

### Entrance Animations
- Stagger related elements (~30-50ms offset as a starting point) so the eye can follow the sequence
- Use transform, opacity, and filter — these are GPU-accelerated
- Hero entrances can be more expressive; supporting elements should be subtle

### Micro-interactions (Feedback)
- **Button press**: Quick scale (0.97 → 1), 100ms
- **Form validation**: Color transition for success/error, shake for invalid input
- **Toggle/checkbox**: Smooth state transition, 200ms
- **Save/submit**: Brief confirmation (checkmark, color flash), then return to rest

### State Transitions
- **Show/hide**: Fade + transform (not instant), 200-300ms
- **Expand/collapse**: Height via transform (not height property), icon rotation
- **Loading → loaded**: Skeleton fade-out, content fade-in
- **Route changes**: Crossfade or shared-element transition for the hero moment

### Performance
- **Only animate `transform` and `opacity`** — never animate `width`, `height`, `padding`, `margin`, `top`, `left`
- Use `will-change` sparingly and only on known-expensive animations
- Monitor for 60fps on target devices

### Accessibility — Non-Negotiable

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Always check `prefers-reduced-motion`. This is not optional. Provide reduced or instant alternatives for every animation.

**NEVER**:
- Use bounce or elastic easing — they feel dated and draw attention to the animation itself
- Animate everything — animation fatigue makes interfaces feel exhausting
- Use durations over 500ms for standard UI — slow transitions feel sluggish
- Animate layout properties — use transform instead
- Skip `prefers-reduced-motion` — this is an accessibility violation
- Add motion without a reason — "it looks cool" is not a reason
- Block interaction during animations unless intentionally sequencing a flow

## 7. Verify

- **60fps**: No jank on target devices
- **Purpose**: Can you explain why each animation exists?
- **Timing**: Not too fast (jarring) or too slow (sluggish)
- **Reduced motion**: Animations disabled or instant with `prefers-reduced-motion: reduce`
- **Non-blocking**: Users can interact during and after animations
- **One hero**: There is exactly one signature moment, not five competing ones
