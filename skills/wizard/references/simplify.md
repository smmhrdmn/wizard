---
name: simplify
description: Strip a design to its essence — remove unnecessary complexity, decoration, and abstraction
args:
  - name: target
    description: The feature or component to simplify (optional)
    required: false
---

Remove unnecessary complexity from a design, revealing the essential elements through ruthless editing.

## 1. Read Project Context

Read the project config and understand the project's purpose, audience, and design decisions.

## 2. Gather Context

You cannot simplify well without knowing what matters. You need:
- **Target audience**: Who uses this, and what is their skill level?
- **Primary use case**: What is the ONE thing this feature must accomplish?
- **Essential vs. nice-to-have**: What can be removed without breaking the core purpose?

Attempt to gather these from the current thread or codebase.

1. If you infer answers from existing design and functionality, you MUST STOP and STOP and call the AskUserQuestionTool to clarify. whether your inferences are correct.
2. If you cannot infer with confidence, you MUST STOP and call the AskUserQuestionTool to clarify. before proceeding.

Simplifying the wrong things destroys usability.

## 3. Assess Current Complexity

Analyze what makes the design feel heavy or cluttered:

### Structural complexity
- **Unnecessary nesting**: Wrappers around wrappers, divs for divs' sake
- **Over-abstraction**: Components that exist for "reusability" but are used once
- **Premature componentization**: Things split into separate files that belong together
- **Too many layers**: Layout → container → wrapper → card → content → inner

### Visual complexity
- **Decorative noise**: Borders, shadows, backgrounds, gradients that serve no hierarchy or function
- **Card overuse**: Everything wrapped in cards when whitespace grouping, alignment, or dividers would suffice
- **Too many colors**: More than 2-3 colors plus neutrals without clear purpose
- **Excessive variation**: Multiple button styles, inconsistent spacing, mixed patterns

→ *Reference: [spatial-design](references/spatial-design.md) — grouping through whitespace and alignment is often more effective than containers.*

### Information complexity
- **Everything visible at once**: No progressive disclosure, no hierarchy
- **Redundant information**: Headers restating intros, labels duplicating placeholders
- **Feature creep**: Too many actions, options, or paths forward
- **Unclear hierarchy**: Nothing stands out because everything is trying to stand out

### Run the AI Slop Test
> If you showed this to a designer and said "AI made this," would they believe you immediately?

Common tells to remove:
- Identical card grids (icon + heading + description, repeated)
- Decorative sparklines conveying no actual data
- Glassmorphism everywhere
- Gradient text for "impact"
- Rounded rectangles with generic drop shadows as the default container

→ *Reference: The AI Slop Test from the frontend-design skill.*

## 4. Find the Essence

Answer these questions:
- **What is the primary user goal?** There should be ONE.
- **What is the 20% that delivers 80% of value?**
- **What can be removed entirely?**
- **What can be hidden until needed?** (Progressive disclosure)
- **What can be combined?** (Related actions, duplicate information)

## 5. Propose Simplification

Present your plan before executing. Organize by:
- **Remove**: Elements, decorations, or code to delete entirely
- **Consolidate**: Things to merge or combine
- **Defer**: Things to hide behind progressive disclosure
- **Flatten**: Nesting or abstraction layers to collapse

## 6. Simplify

### Information Architecture
- ONE primary action per view, few secondary, everything else tertiary or hidden
- Remove redundancy — if it is said elsewhere, do not repeat it here
- Hide complexity behind clear entry points (expand, drill-down, tabs)
- Combine related actions: merge similar buttons, consolidate forms

### Visual Simplification
- **Cards are optional.** Try removing them and using whitespace grouping or alignment instead. Add them back only if the content genuinely needs a contained surface.
- Remove decorative elements that serve no hierarchical or functional purpose
- Reduce to 1-2 colors plus neutrals
- One font family, 3-4 sizes maximum, 2-3 weights
- Use one spacing scale consistently — remove arbitrary gaps

→ *Reference: [spatial-design](references/spatial-design.md) — create rhythm through varied spacing, not uniform gaps.*

### Layout Simplification
- Prefer simple vertical flow over complex grids where content allows it
- Use available space generously — let content breathe
- Flatten nested containers: if a wrapper only adds padding, apply the padding directly
- Consistent alignment — pick left or center, commit

### Interaction Simplification
- Fewer buttons, fewer options, clearer path forward
- Smart defaults: make common choices automatic
- Prefer undo over confirmation dialogs
- ONE obvious next step, not five competing actions

### Code Simplification
- Flatten component trees: reduce nesting depth
- Remove unused code: dead CSS, unused components, orphaned files
- Merge premature abstractions back into their parent
- Reduce variants: can 3 cover 90% of cases instead of 12?

**NEVER**:
- Remove necessary functionality (simplicity is not feature-less)
- Sacrifice accessibility for visual minimalism
- Make things so stripped that they are unclear
- Remove information users need to make decisions
- Eliminate hierarchy completely — some things should stand out

## 7. Verify

- **Faster path**: Can users accomplish their goal more directly?
- **Lower cognitive load**: Is it easier to understand what to do?
- **Still complete**: Are all necessary features accessible (even if behind progressive disclosure)?
- **Clearer hierarchy**: Is it obvious what matters most?
- **No orphaned code**: Did you clean up everything the simplification made obsolete?
