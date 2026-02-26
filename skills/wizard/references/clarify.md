---
name: clarify
description: Improve UX copy — labels, errors, empty states, microcopy, and instructions
args:
  - name: target
    description: The feature or component with unclear copy (optional)
    required: false
---

Identify and improve unclear, confusing, or poorly written interface text to make the product easier to understand and use.

## 1. Read Project Context

Read the project config and understand the product's audience, tone, and terminology conventions.

## 2. Assess Current Copy

→ *Reference: [ux-writing](references/ux-writing.md) for semantic labels, error formulas, and empty state patterns.*

Scan all interface text and identify problems:

### Clarity problems
- **Jargon**: Technical terms users will not understand
- **Ambiguity**: Text that could mean multiple things
- **Passive voice**: "Your file has been uploaded" vs "File uploaded"
- **Wordiness**: More words than necessary without more clarity
- **Missing context**: Users do not know what to do or why
- **Tone mismatch**: Too formal, too casual, or wrong for the situation

### Understand the context for each piece of copy
- Who reads this? (Technical users? General audience? First-time visitors?)
- What is their mental state? (Stressed during an error? Confident during success?)
- What action do we want? (What should happen next?)
- What constraints exist? (Character limits, space limitations, localization?)

## 3. Propose Improvements

Present a table of current copy vs proposed copy with rationale before editing files. Group by area (errors, labels, empty states, buttons, etc.).

## 4. Improve Copy Systematically

### Error Messages

Every error message answers three questions:
1. **What happened?** — State the problem plainly
2. **Why?** — Brief cause if it is not obvious
3. **How to fix it?** — A concrete next step

**Bad**: `Error 403: Forbidden`
**Good**: `You don't have permission to view this page. Contact your admin for access.`

**Bad**: `Invalid input`
**Good**: `Email addresses need an @ symbol. Try: name@example.com`

- Explain what went wrong in plain language
- Suggest how to fix it
- Do not blame the user
- Include examples when helpful

### Form Labels & Instructions
- Use clear, specific labels — not generic placeholders
- Show format expectations with examples
- Explain why you are asking when it is not obvious
- Put instructions before the field, not after
- Never use placeholders as the only label — they disappear when users type

### Button Labels — Semantic, Not Generic
→ *Reference: [ux-writing](references/ux-writing.md) for the semantic button label pattern.*

**The pattern: verb + specific object.**

| Lazy | Semantic |
|------|----------|
| OK | Save changes |
| Submit | Create account |
| Yes | Delete project |
| Delete | Delete 5 items |
| Cancel | Keep editing |

For destructive actions, name the destruction:
- Prefer "Delete" for permanent actions, "Remove" for recoverable — widely recommended convention
- "Delete 5 items" not "Delete selected" — show what the user is about to lose
- In confirmation dialogs, use two specific labels: "Delete project" / "Keep project" — not "Yes" / "No"

### Empty States — Design Opportunities, Not Dead Ends

Empty states are onboarding moments. They teach the interface.

**Bad**: `No items found`
**Good**: `No projects yet. Create your first project to start organizing your work.`

- Show what will be here and how to get started
- Include a clear call-to-action
- Use the empty state to explain the feature's value
- Consider illustration or visual interest — this is a first impression
- For search results: suggest alternative queries or show popular items

**Empty state formula:**
1. What is missing (acknowledge the emptiness)
2. Why it matters (value proposition)
3. How to fix it (action)

### Success Messages
- Confirm what happened specifically
- Explain what happens next if relevant
- Match the emotional moment — celebrate big wins, be brief for routine saves
- "Settings saved! Changes take effect immediately." not "Success"

### Loading States
- Set expectations: how long will this take?
- Explain what is happening when it is not obvious
- Show progress when possible
- Offer an escape hatch for long operations

### Confirmation Dialogs
- State the specific action: "Delete 'Project Alpha'?" not "Are you sure?"
- Explain consequences, especially for destructive actions
- Use specific button labels (see semantic buttons above)
- Only use confirmations for genuinely risky actions — prefer undo for everything else

### Navigation & Wayfinding
- Use specific, descriptive labels ("Your projects" not "Items")
- Use language users understand, not internal jargon
- Make hierarchy clear through information scent

## 5. Apply Clarity Principles

Every piece of copy should follow these rules:

1. **Be specific**: "Enter email" not "Enter value"
2. **Be concise**: Cut unnecessary words — but do not sacrifice clarity for brevity
3. **Be active**: "Save changes" not "Changes will be saved"
4. **Be human**: Write like a helpful colleague, not a system message
5. **Be helpful**: Tell users what to do, not just what happened
6. **Be consistent**: Use the same terms throughout — do not vary for variety

**NEVER**:
- Use jargon without explanation
- Blame users ("You made an error" → "This field is required")
- Be vague ("Something went wrong" without next steps)
- Use humor for error states (prioritize clarity and empathy; humor risks feeling stale or patronizing)
- Repeat information (headers restating intros, redundant explanations)
- Use placeholders as the only label

## 6. Verify

- **Comprehension**: Can users understand each message without surrounding context?
- **Actionability**: Do users know what to do next at every point?
- **Brevity**: Is each message as short as possible while remaining clear?
- **Consistency**: Does terminology match across the entire feature?
- **Tone**: Is the tone appropriate for each situation (error vs success vs neutral)?
