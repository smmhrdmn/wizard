# Wizard

Design intelligence framework for AI coding tools.

## Structure
- `source/` — single source of truth for skills and commands
- `scripts/` — Bun build system
- `dist/` — generated output for Claude Code

## Build
```bash
bun run build
```

## Adding content
1. Edit files in `source/commands/` or `source/skills/`
2. Run `bun run build`
3. Output appears in `dist/claude-code/.claude/`
