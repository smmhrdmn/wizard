---
name: batch
description: Process multiple feedback items, bugs, or changes in parallel batches using sub-agents
args:
  - name: items
    description: List of findings or feedback to process (from audit, review, critique, or pasted text)
    required: false
---

The user has multiple items to fix. Process them efficiently using parallel sub-agents with design-aware fixes.

## Step 1 — Parse and categorize

Read the user's `$ARGUMENTS` or the list they provided. For each item, determine:
- Which file(s) it affects
- Whether it's independent (can be done in isolation) or dependent (requires another item first)
- Size estimate: one-line fix, multi-line edit, or multi-file change
- Design category: tokens, spacing, color, motion, interaction states, a11y, responsiveness, content

## Step 2 — Group into batches

Group related items:
- **Same-file items** go together in one sequential batch — avoids edit conflicts
- **Independent items** touching different files go to separate parallel sub-agents
- **Dependent items** are ordered so prerequisites complete first
- Max 2-3 parallel sub-agents per batch to keep things manageable

## Step 3 — Present the plan

Show the batching plan before executing:

```
Batch 1 (parallel):
  Agent A: [item description] → [file(s)]
  Agent B: [item description] → [file(s)]

Batch 2 (sequential, same file):
  1. [item] → [file]
  2. [item] → [file] (depends on #1)

Batch 3 (parallel):
  Agent C: [item] → [file(s)]
  Agent D: [item] → [file(s)]
```

Wait for user approval before executing. If they say "go" or "do it", proceed.

## Step 4 — Execute batches

For each batch, launch sub-agents using the Task tool. Each sub-agent must:

1. Read the target file(s)
2. Check the project config for design tokens and conventions
3. Make the fix using the project's design system — never introduce hardcoded values, generic colors, or patterns that bypass existing tokens
4. Keep changes minimal — fix what's listed, don't refactor surrounding code
5. Report: what changed, which file, line numbers

**Design quality rules for sub-agents:**
- Use existing design tokens. If a fix requires a color, spacing, or typography value, find the right token first.
- If the fix involves motion, use appropriate easing and duration (100ms feedback, 300ms transitions, 500ms choreography). Respect `prefers-reduced-motion`.
- If the fix involves interaction states, cover: default, hover, focus-visible, active, disabled. Don't forget touch targets (44x44px minimum).
- If adding or modifying a component, check if it should use semantic HTML elements.

After each batch completes, summarize results and confirm before starting the next batch.

## Step 5 — Verify

After all batches are done:

1. Run the project's build/lint/check command to verify nothing broke
2. Summarize all changes grouped by file:
   ```
   [file]: [what changed]
   [file]: [what changed]
   ```
3. Flag any items that couldn't be completed and explain why
4. If there were design-related fixes, suggest a quick the **audit** workflow to verify no new issues were introduced
