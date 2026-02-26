# Wizard

Design intelligence framework for AI coding tools. Steers AI toward distinctive, production-grade interfaces instead of generic template slop.

Wizard provides a skill, reference library, and workflow vocabulary that guides token-first design, visual iteration, and design system governance across any frontend project.

## Install

### Claude Code (skill + 17 slash commands)

```
/plugin marketplace add smmhrdmn/wizard
/plugin install wizard@wizard
```

This installs the Wizard skill and all 17 `/commands`.

### All agents (skill only)

```bash
npx skills add smmhrdmn/wizard
```

Works with Claude Code, Cursor, Codex, Gemini CLI, Goose, Junie, VS Code, and any agent that supports the [Agent Skills](https://agentskills.io) spec. Installs the skill and references — workflows are available by name (e.g., "run the audit workflow") rather than as `/slash-commands`.

## Usage

Ask your agent to use the wizard skill, or invoke it directly in Claude Code with `/wizard`. It will orient you based on what phase you're in:

- **Starting:** teach-wizard
- **Building:** design, normalize, animate, harden, adapt, clarify
- **Reviewing:** audit, review, critique, tokens
- **Refactoring:** simplify, extract, optimize
- **Shipping:** polish, deploy-check
- **Multiple items:** batch

Run **teach-wizard** first on any new project — it scans your codebase to learn your tokens, framework, and patterns.

## Structure

```
wizard/
├── skills/wizard/              # Agent Skills spec (npx skills add)
│   ├── SKILL.md                # Core philosophy + domain guidance
│   └── references/             # 25 reference files (8 domain + 17 workflows)
├── .claude/                    # Claude Code plugin
│   ├── commands/               # 17 slash commands
│   └── skills/wizard/          # Skill + references
└── .claude-plugin/             # Plugin marketplace metadata
```

## What it does

**The skill** loads as persistent context during design work. It establishes token-first philosophy, surface layering, the AI Slop Test, and implementation principles. Eight reference files provide deep guidance on typography, color, spatial design, motion, interaction, responsive, UX writing, and design systems.

**The workflows** are actions you invoke at specific points — auditing, reviewing, normalizing, polishing, etc. They ship as reference files so every compatible agent gets them. They're organized in three tiers: orchestration (design, batch, deploy-check), actions (12 focused workflows), and setup (teach-wizard, tokens).

## Philosophy

- **Token-first.** Build design systems in layers (primitives → semantic → component), not one-off values.
- **Principles over prescriptions.** Teaches font selection strategy, not specific font names.
- **Design-in-browser.** Assumes you're looking at the thing and iterating visually.
- **Governance.** When to add vs reuse. When a pattern earns promotion. How to detect drift.

