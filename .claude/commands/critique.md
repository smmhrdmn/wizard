---
name: critique
description: UX design review evaluating visual hierarchy, information architecture, emotional resonance, clarity, and efficiency. Provides senior-designer-level feedback with actionable suggestions, not a lint report.
args:
  - name: focus
    description: Specific page, flow, or area to critique (optional — critiques the primary interface if omitted)
    required: false
---

Conduct a holistic design critique. This is not a checklist or a code scan — it is a design review. Think like a senior designer sitting next to a colleague, looking at their work, and giving honest, specific, constructive feedback.

**First**: Read the project config to understand the product, its audience, and its design direction. Then consult this skill's design principles and the AI Slop Test.

Stop and ask the user what the intended audience and purpose of the interface is, if it is not clear from the config file or the interface itself.

---

## Design Critique

Look at the interface holistically. Read the code, but evaluate the *experience* — what a user sees, feels, and does.

### Visual Hierarchy

- Is the most important thing on the page immediately obvious? If you glance for 3 seconds and look away, can you recall what the page is about and what it wants you to do?
- Does the eye follow a natural path from primary element to secondary to supporting content? (Note: NNGroup research shows the F-pattern is a *failure state* — it emerges when pages lack visual differentiation. The layer-cake pattern, where users scan headings and subheadings, is far more effective. Good hierarchy prevents F-pattern scanning.)
- Are there elements competing for attention that shouldn't be? Two things screaming for priority means neither wins.
- Does the hierarchy hold at different viewport sizes, or does it collapse into sameness on mobile?

### Information Architecture

- Is content organized the way users think about it, or the way the system stores it?
- Are related things grouped together? Are unrelated things separated?
- Is there too much at once? Could progressive disclosure reveal complexity gradually instead of presenting everything upfront?
- Does the structure scale — will it still make sense with 2x or 10x the content?
- Does the navigation tell users where they are, where they can go, and how to get back?

### Emotional Resonance

- What does this interface *feel* like? Clinical? Warm? Premium? Playful? Generic?
- Is that feeling intentional and appropriate for the audience?
- Would the target user look at this and think "this is for me"?
- Is the tone consistent across the whole experience, or does it shift between sections?
- Does it feel like a product with a point of view, or a template with the blanks filled in?

### Clarity

- Could a first-time user understand what to do without instructions or onboarding?
- Are there ambiguous elements — buttons that could mean two things, sections whose purpose isn't clear, icons without labels?
- Is the interface honest about its state? Does it clearly communicate loading, errors, empty states, and success?
- Are labels, headings, and calls to action written in plain, specific language?

### Efficiency

- For a user who comes back daily, is the interface fast to use? Are common paths short?
- Are there unnecessary steps, confirmations, or intermediary pages?
- Does the interface remember context (previous selections, recent items, user preferences)?
- Could power users move faster with keyboard shortcuts, bulk actions, or other accelerators?

---

## Generate Critique

Write this as feedback from a senior designer — direct, specific, and focused on what matters most. Not a lint report. Not a checklist. A *perspective*.

### What's Working

Start positive. Identify 2-3 specific strengths and explain *why* they work. Not generic praise ("nice clean layout") but specific observations ("the type hierarchy immediately draws the eye to the search bar, which makes sense because search is the primary action for this interface").

### Concerns

The substantive issues, ordered by impact. For each:

- **The observation**: What you see, stated plainly. "The sidebar has 14 items at the top level."
- **Why it matters**: What effect this has on users. "Users can't scan 14 items — they'll either give up or rely on search, which makes the sidebar redundant."
- **A suggestion**: A specific, concrete direction — not "consider simplifying" but "group the 14 items into 3-4 categories with expandable sections, prioritizing the 4 most-used items at the top level."

Be direct. Do not hedge with "you might want to consider" or "it could perhaps be beneficial to explore." Say what the problem is and what to do about it.

### 3 Highest-Impact Improvements

If the team could only do three things before the next release, what should they be? These should be the changes that would make the biggest difference to real users.

For each:
1. **What to change**: One sentence.
2. **Why it matters most**: What user outcome it improves.
3. **Suggested approach**: How to get there — specific enough to act on.

### Questions Worth Asking

End with 2-3 provocative questions that might reframe the design:
- Questions that challenge assumptions ("Does the user actually need to see all of this at once?")
- Questions that push toward clarity ("What is the one thing this page should do better than anything else?")
- Questions that connect design to goals ("If a user only sees this page once, what should they remember?")

---

**Evaluation foundations**: This critique framework draws on Nielsen's 10 Usability Heuristics, Morville's UX Honeycomb, and ISO 9241-11 (effectiveness, efficiency, satisfaction). The five dimensions above are a focused synthesis — they do not replace comprehensive heuristic evaluation. If the interface has significant usability issues beyond hierarchy, architecture, resonance, clarity, and efficiency, flag them — especially around consistency, error prevention, user control, and accessibility.

**Voice guidelines for this critique**:
- Be a colleague, not a critic. The goal is to make the work better, not to demonstrate expertise.
- Be specific. "The spacing between the form fields and the submit button creates a visual disconnect" not "spacing needs work."
- Explain the *why* in terms of user experience, not design theory. "Users will miss this" not "it violates Gestalt proximity principles."
- Prioritize ruthlessly. If everything is important, nothing is. Lead with what matters most.
- Do not soften honest feedback. Designers need directness to ship great work. Hedging wastes everyone's time.
- This should read like sitting down with a smart, experienced designer who genuinely wants the product to succeed.
