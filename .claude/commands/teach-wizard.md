---
name: teach-wizard
description: One-time project discovery. Scans the codebase to learn your design tokens, framework, and patterns, then asks focused questions about what it can't infer. Writes design context to your config file.
---

Discover this project's design foundations. Scan first, ask about what can't be inferred.

## Step 1: Auto-Scan the Codebase

Thoroughly scan the project without asking any questions yet:

### Project Context
- **README**: Project purpose, target audience, stated goals
- **package.json / config files**: Framework, dependencies, build tools, design libraries (Tailwind, styled-components, CSS Modules, etc.)

### Design Tokens
- **CSS custom properties** (`--*`): Scan all CSS files for `--color-*`, `--space-*`, `--text-*`, `--font-*`, `--radius-*`, `--shadow-*`, `--duration-*`, `--ease-*` and any other token patterns
- **Tailwind config**: Theme extensions, custom colors, spacing, fonts
- **Other token sources**: SCSS variables, JSON token files, JS theme objects

### Component Patterns
- **File structure**: How components are organized (flat, by feature, atomic, etc.)
- **Naming conventions**: PascalCase, kebab-case, BEM, etc.
- **Component library**: Any UI library in use (Radix, shadcn, Headless UI, MUI, etc.)

### CSS Approach
- **Methodology**: Tailwind utility, CSS Modules, styled-components, vanilla CSS, SCSS, CSS-in-JS
- **Token usage**: Are tokens used consistently or are hardcoded values scattered throughout?
- **Theme support**: Light/dark mode, multiple themes, CSS custom property–based theming

### Existing Design Documentation
- **Style guides**: Any documented design decisions, brand guidelines, or component documentation
- **Figma/design links**: Referenced in docs or comments
- **Design system**: Formal system or informal patterns

## Step 2: Report Findings

Present a structured summary of what you discovered:

```
Project Discovery

Framework:     [e.g. Next.js 14 with App Router]
CSS approach:  [e.g. Tailwind CSS with custom theme config]
Component lib: [e.g. Radix UI primitives + custom components]
Token system:  [e.g. 42 CSS custom properties across color, spacing, typography]

Tokens found:
  Colors:     [count] ([semantic/primitive/both])
  Spacing:    [count]
  Typography: [count]
  Borders:    [count]
  Shadows:    [count]
  Motion:     [count]

Component patterns:
  [Notable patterns, naming conventions, file structure]

Observations:
  [Anything notable — inconsistencies, strengths, gaps]
```

## Step 3: Ask Focused Questions

STOP and call the AskUserQuestionTool to clarify. Ask only about what you could not infer from the codebase. Ask one question at a time.

### Question 1: Users & Purpose
*Skip if clearly documented in README or project docs.*

"Who are the primary users of this project, and what are they trying to accomplish?"

### Question 2: Brand Personality
*Skip if brand guidelines are documented.*

"What's the brand personality? Pick the closest match (or describe your own):
- **Corporate / Professional** — trust, clarity, authority
- **Playful / Casual** — energy, friendliness, approachability
- **Luxury / Refined** — elegance, restraint, quality
- **Technical / Precise** — efficiency, density, competence
- **Warm / Friendly** — comfort, inclusivity, care"

### Question 3: Accessibility Target
*Default to WCAG AA if not specified.*

"What's your accessibility target? WCAG AA is the standard — should I target AAA for any specific areas?"

### Question 4: Design References
*Skip if references exist in project docs.*

"Any design reference or inspiration sites? What specifically about them captures the right feel?"

Skip any question where the answer is already clear from the scan. Don't ask about what you already know.

## Step 4: Write Design Context

Synthesize the scan results and the user's answers into a `## Design Context` section. This is not a dump of raw findings — it's a coherent brief that will guide all future design work.

```markdown
## Design Context

### Project
[One-line description of what this is and who it's for]

### Design System
- **Framework**: [framework and version]
- **CSS approach**: [methodology]
- **Token system**: [summary of what exists — counts, organization, gaps]
- **Component patterns**: [naming, structure, any UI library]

### Brand & Audience
- **Users**: [who they are, what they're doing, their context]
- **Personality**: [brand personality in 3-5 words]
- **Tone**: [what the interface should feel like to use]

### Design Principles
[3-5 principles derived from the conversation — these guide all design decisions]

### Accessibility
- **Target**: [WCAG AA / AAA]
- **Specific considerations**: [any noted needs]

### Constraints & Preferences
[Any noted constraints — browser support, performance targets, design references, anti-references]
```

Write this section to the project config in the project root. If the file already exists, append or update the `## Design Context` section without disturbing other content.

## Step 5: Confirm

Summarize what was established:
- Key design principles that will guide future work
- Token system status (healthy, needs work, nonexistent)
- Any immediate recommendations (e.g., "Your color tokens are solid but you have no spacing tokens — the **tokens** workflow can help")

The project is now ready for design work with Wizard.
