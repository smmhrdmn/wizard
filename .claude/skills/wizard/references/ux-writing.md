# UX Writing

## Semantic Button Labels

Button labels should confirm what will happen. Generic verbs ("Submit", "OK", "Yes") force the user to re-read the context to understand the action.

**The pattern: verb + specific object.**

| Lazy | Semantic | Why It's Better |
|------|----------|-----------------|
| OK | Save changes | Names the outcome |
| Submit | Create account | Tells the user what they are creating |
| Yes | Delete project | Confirms the specific action |
| Cancel | Keep editing | Clarifies what "cancel" actually means |
| Delete | Delete 5 items | Shows the count, removes ambiguity |
| Save | Save draft | Specifies what form the save takes |
| Confirm | Place order | Names the real-world consequence |

**For destructive actions, name the destruction:**
- Prefer "Delete" for permanent actions and "Remove" for recoverable ones — this is a widely recommended convention, though not universally enforced
- "Delete 5 items" not "Delete selected" — show what the user is about to lose
- In a confirmation dialog, use two specific labels: "Delete project" / "Keep project" — not "Yes" / "No"

## Error Messages: The Formula

Every error message answers three questions:

1. **What happened?** — State the problem plainly
2. **Why?** — Brief cause if it's not obvious
3. **How to fix it?** — A concrete next step

"Email address isn't valid. Please include an @ symbol." not "Invalid input."

### Error Templates

| Situation | Template |
|-----------|----------|
| **Format error** | "[Field] needs to be [format]. Example: [example]" |
| **Missing required** | "Please enter [what's missing]" |
| **Permission denied** | "You don't have access to [thing]. [What to do instead]" |
| **Network error** | "We couldn't reach [service]. Check your connection and try again." |
| **Server error** | "Something went wrong on our end. We're looking into it. [Alternative action]" |
| **Conflict** | "[Thing] was updated by someone else. Review their changes or save as a copy." |
| **Rate limit** | "Too many requests. Try again in [time]." |

### Don't Blame the User

Reframe errors as system-perspective statements:

- "Please enter a date in MM/DD/YYYY format" not "You entered an invalid date"
- "This email is already registered. Sign in instead?" not "You already have an account"
- "Passwords must be at least 8 characters" not "Your password is too short"

## Empty States as Design Opportunities

An empty state is the first thing a new user sees. It is an onboarding moment, not a dead end.

**The empty state formula:**

1. **Acknowledge** — briefly state what this area is for
2. **Show the value** — what will be here once populated, and why it matters
3. **Provide the action** — a clear, specific way to get started

```
No projects yet

Projects keep your work organized and shareable.
Create your first project to get started.

[+ Create project]
```

Not: "No items found."

**Progressive empty states** — the UI should evolve:

| State | What to Show |
|-------|-------------|
| **Empty (zero items)** | Illustration or icon, value proposition, primary CTA |
| **Getting started (1-2 items)** | The items plus a subtle prompt: "Add more to see trends" |
| **Populated (3+ items)** | Full UI — charts, summaries, patterns become meaningful |

Each stage can reveal UI that only makes sense with enough data. A chart with one data point is misleading — show it only when there is enough to be useful.

**Empty states in context:**
- Empty search results: "No results for 'xyz'. Try a different search or [browse all]."
- Empty filtered list: "No items match these filters." with a "Clear filters" button
- Empty inbox: "You're all caught up." (celebratory, not apologetic)

## Loading Copy

What you say during waits affects perceived duration.

**State transitions for async actions:**

| State | Copy | Duration |
|-------|------|----------|
| **Initiated** | "Saving..." | Show immediately |
| **In progress** | "Saving your changes..." | After 2-3 seconds |
| **Complete** | "Saved" | Show briefly, then fade |
| **Failed** | "Couldn't save. Try again?" | Persist until resolved |

**For long operations, set expectations:**
- "This usually takes about 30 seconds"
- "Processing 1,247 records..." (show what is happening)
- "Almost done — finalizing your report" (progress messages reduce anxiety)

**Never show "Loading..." by itself.** Be specific about what is loading:
- "Loading your dashboard..." not "Loading..."
- "Checking availability..." not "Please wait..."
- "Connecting to server..." not "Loading..."

If you cannot be specific, show a skeleton screen instead of text.

## Voice vs. Tone

**Voice** is the product's personality. It is consistent everywhere — the same way a person's personality does not change room to room.

**Tone** adapts to the moment — the same way a person speaks differently at a funeral vs. a party.

### Tone Adaptation by Moment

| Moment | Tone | Example |
|--------|------|---------|
| **Success** | Celebratory but brief | "Done! Your changes are live." |
| **Error** | Empathetic, helpful | "That didn't work. Here's what to try..." |
| **Warning** | Calm, specific | "This will affect all 12 team members." |
| **Onboarding** | Encouraging, clear | "Let's set up your workspace. This takes about 2 minutes." |
| **Destructive confirm** | Serious, direct | "Delete this project? This can't be undone." |
| **Settings** | Neutral, factual | "Notifications are sent to your email address." |
| **Empty state** | Helpful, inviting | "No reports yet. Create one to start tracking progress." |
| **Tutorial/help** | Patient, encouraging | "Great start. Next, try adding a team member." |

**Avoid humor in error messages.** The user is likely frustrated — prioritize clarity and helpfulness over personality. "Oops! Something went wrong" is patronizing when someone just lost their work. If humor is part of the brand voice, ensure it doesn't impede understanding or become stale with repeated encounters.

**Celebratory moments should be brief.** "Saved!" is fine. A paragraph congratulating the user for clicking a button is not.

## Microcopy in Context

Different UI positions serve different writing purposes. Use the right one:

### Helper Text (below the field)

Persistent guidance visible before the user interacts. Use for non-obvious format requirements or to explain why you are asking.

```html
<label for="slug">URL slug</label>
<input id="slug" aria-describedby="slug-help">
<p id="slug-help">Letters, numbers, and hyphens only. This appears in your public URL.</p>
```

### Placeholder Text (inside the field)

Shows an example of expected input. Disappears on focus. Never use as a label — it vanishes when the user needs it most.

```html
<input placeholder="e.g., my-project-name">
```

Placeholders are supplementary. If the user needs the information to complete the field, put it in helper text.

### Tooltips (on hover/focus)

Extra context for elements that are already understandable but benefit from elaboration. Not for essential information — touch users and keyboard-only users may miss them.

```html
<button aria-describedby="export-tip">Export</button>
<div id="export-tip" role="tooltip">Download as CSV with all columns</div>
```

### Validation Messages (on error)

Appear after interaction (on blur or submit). Must be specific and actionable.

- Inline, near the field they relate to
- Connected via `aria-describedby` and `aria-invalid`
- Red or error-colored, but not relying on color alone (add an icon)

### When to Use Each

| Need | Use |
|------|-----|
| "What format should I enter?" | Helper text |
| "What does this look like?" | Placeholder |
| "What does this button do?" | Tooltip |
| "What did I do wrong?" | Validation message |
| "Why are you asking this?" | Helper text |
| "What are the constraints?" | Helper text (if critical) or tooltip (if nice-to-know) |

## Terminology Consistency

Pick one term and enforce it everywhere — UI, docs, API, error messages:

| Inconsistent | Pick One |
|--------------|----------|
| Delete / Remove / Trash | Delete |
| Settings / Preferences / Options | Settings |
| Sign in / Log in / Enter | Sign in |
| Create / Add / New | Create |
| Dashboard / Home / Overview | Dashboard |
| Members / Users / People | Members |

Build a glossary. When a new term is introduced, check if an existing term covers it. Variation feels like speaking to different products.

## Writing for Accessibility

**Link text** must make sense out of context. Screen reader users navigate by links — "View pricing plans" not "Click here."

**Alt text** describes information, not appearance. "Revenue increased 40% in Q4" not "Line chart." Use `alt=""` for decorative images so screen readers skip them.

**Icon-only buttons** need `aria-label`:
```html
<button aria-label="Close dialog">
  <svg><!-- X icon --></svg>
</button>
```

**Status messages** use `aria-live` regions so screen readers announce changes without moving focus:
```html
<div aria-live="polite">3 items deleted. Undo?</div>
```

## Writing for Translation

Plan for text expansion — German is up to ~35% longer than English, Finnish up to 40%.

**Translation-friendly patterns:**
- Keep numbers separate: "New messages: 3" not "You have 3 new messages" (word order varies)
- Use full sentences as single translation strings (do not concatenate fragments)
- Avoid abbreviations: "5 minutes ago" not "5 mins ago"
- Do not embed UI element names in strings: "Click Save" breaks if the button is translated to "Speichern"

## Avoid Redundant Copy

If the heading says it, the intro paragraph should not restate it. If the button label is clear, do not add an explanatory sentence below it. If the field label is "Email," the placeholder should not also say "Email."

Say it once. Say it where it matters most. Redundancy is not reinforcement — it is clutter.

---

**Avoid**: Jargon without explanation. Blaming users ("You made an error" should be "This field needs a value"). Vague errors ("Something went wrong" with no next step). Varying terminology for the sake of variety. Humor in error states. "Click here" as link text. Placeholder text as the only label. "Loading..." without context. Empty states that are just "No data."
