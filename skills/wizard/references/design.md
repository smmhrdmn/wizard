---
name: design
description: Design session orchestrator — routes through Explore, Build, Tune, Review, and Ship phases based on what you're working on
args:
  - name: focus
    description: What you're working on (e.g. "new dashboard", "polish landing page", "iterate on nav")
    required: false
---

Start a design session. Determine the current phase, suggest the right Wizard commands, and spot design issues contextually.

## Step 1 — Read project context

Read the project's the project config to learn:
- Design tokens, component patterns, brand guidelines
- What dev tools are available (DialKit, Agentation, Annotate, playground)
- Build/lint/test infrastructure
- Existing design decisions and constraints

If no the project config exists or it lacks design context, note that the **teach-wizard** workflow can establish a design foundation for the project.

## Step 2 — Determine the phase

Based on the user's `$ARGUMENTS` (or ask one question if unclear), route to the right phase. Don't force sequential order — jump to wherever the user is.

### Explore — "I'm starting something new"

The user is generating ideas, exploring directions, or defining requirements.

- If no design context exists in the project config: suggest the **teach-wizard** workflow first to establish tokens and conventions
- Otherwise: gather requirements briefly (2 questions max), then suggest building

### Build — "I'm implementing"

The user is writing code for a component, page, or feature.

Suggest Wizard commands based on what's needed:
- **Structure & tokens**: the **normalize** workflow (consistent spacing, sizing), the **extract** workflow (pull repeated values into tokens)
- **Clarity & simplicity**: the **simplify** workflow (reduce complexity), the **clarify** workflow (improve hierarchy and readability)
- **Polish**: the **animate** workflow (meaningful motion), the **harden** workflow (interaction states, edge cases, a11y)
- **Responsive**: the **adapt** workflow (responsive behavior, container queries, input adaptation)

While building, scan for issues and flag them:
- Hardcoded hex/rgb values that should be tokens → suggest the **normalize** workflow or the **extract** workflow
- Static transitions or no motion → suggest the **animate** workflow
- Missing hover/focus/disabled/empty states → suggest the **harden** workflow
- Inconsistent spacing or arbitrary values → suggest the **normalize** workflow
- No responsive handling → suggest the **adapt** workflow

### Tune — "I'm tweaking / iterating visually"

The user is iterating in the browser. Wizard steps back here — this is rapid visual feedback territory.

- Apply changes directly based on the user's visual feedback. Don't re-analyze the whole component.
- If DialKit is available: suggest wiring up tunable parameters (spacing, colors, animation curves, spring physics) for faster iteration
- If Agentation is available: mention the visual feedback toolbar
- Keep changes small and fast. One property at a time if the user is directing.

### Review — "I'm auditing / checking quality"

The user wants to verify design quality before shipping.

Suggest review commands:
- the **audit** workflow — design system drift, token misuse, consistency
- the **review** workflow — general design quality review
- the **critique** workflow — honest assessment of what's working and what's not

When review produces multiple findings, offer: "Want me to process these with the **batch** workflow?"

### Ship — "I'm ready to deploy"

The user is preparing to ship.

Suggest ship commands:
- the **polish** workflow — final visual refinements
- the **optimize** workflow — performance, bundle size, asset optimization
- the **deploy-check** workflow — pre-deploy gate (build, assets, meta tags, a11y, leaked dev artifacts)

## Step 3 — Contextual awareness

Regardless of phase, if you notice any of these while reading code, flag them briefly:

| Signal | Suggestion |
|--------|-----------|
| Hardcoded color values (`#`, `rgb`, `hsl`) | "These should be tokens — the **normalize** workflow or the **extract** workflow" |
| No transition/animation on state changes | "Consider the **animate** workflow for this interaction" |
| Missing `:hover`, `:focus-visible`, `:disabled`, empty states | "the **harden** workflow would catch these" |
| Inconsistent spacing (mix of arbitrary values) | "the **normalize** workflow to align with the spacing scale" |
| No responsive handling or only media queries | "the **adapt** workflow for container queries and fluid techniques" |
| Generic AI patterns (card grids, gradient text, glassmorphism everywhere) | "This might not pass the AI Slop Test" |

Don't dump all suggestions at once. Mention the most relevant 1-2 per interaction.

## Step 4 — Suggest next phase

After completing work, suggest the natural next step:
- Explore → Build
- Build → Tune (mention DialKit if applicable)
- Tune → Review
- Review → Fix via the **batch** workflow, then Review again or Ship
- Ship → Deploy

Follow the user's lead. They may skip phases or loop back.
