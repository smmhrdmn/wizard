# Motion Design

## When NOT to Animate

Before reaching for a transition, ask: does this motion help the user, or does it help the designer feel clever?

**Do not animate:**
- Data tables, lists, or grids the user sorts/filters/paginates repeatedly — these are high-frequency actions where 200ms adds up to frustration
- Anything the user does 50+ times a day (toggling filters, switching tabs in a dashboard, marking items)
- Dense professional UIs — trading platforms, admin panels, code editors. Speed is the feature.
- Repeated identical actions — if the user deletes 20 items in a row, the delete animation should not play 20 times

**Always animate:**
- State changes that would otherwise be disorienting (content appearing/disappearing, layout shifts)
- Direct-manipulation feedback (drag, resize, reorder)
- Progress and loading indicators

The line is simple: motion as feedback is essential. Motion as decoration is debt.

## Motion Tokens

Define duration and easing as CSS custom properties. Every animation in the system should reference these — no magic numbers in component files.

```css
:root {
  /* Duration tokens */
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;

  /* Easing tokens */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

  /* Named curves for specific behaviors */
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Components consume the tokens, never raw values:

```css
.panel {
  transition: transform var(--duration-normal) var(--ease-out);
}
```

## Duration: The 100/300/500 Rule

| Duration | Use Case | Examples |
|----------|----------|----------|
| **100-150ms** | Instant feedback | Button press, toggle, color change, checkbox |
| **200-300ms** | State transitions | Menu open, tooltip appear, panel slide |
| **300-500ms** | Layout changes | Accordion expand, modal entrance, drawer slide |
| **500-800ms** | Hero moments | Page transition, onboarding reveal (one per view) |

**Exit animations run at ~75% of entrance duration.** A modal that opens in 300ms should close in 225ms. Users are done with the element — get it out of the way.

## Easing: Pick the Right Curve

**Prefer custom cubic-bezier() curves over the CSS keyword `ease`.** The default `ease` is a generic symmetric curve — it works but lacks the deceleration emphasis that makes motion feel natural. Use explicit curves:

| Curve | Use For | CSS |
|-------|---------|-----|
| **ease-out** | Elements entering the viewport | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **ease-in** | Elements leaving the viewport | `cubic-bezier(0.7, 0, 0.84, 0)` |
| **ease-in-out** | Elements toggling between states | `cubic-bezier(0.65, 0, 0.35, 1)` |

For micro-interactions, exponential curves feel natural because they mimic friction:

```css
/* Quart out — smooth, refined. Recommended default. */
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);

/* Quint out — slightly more dramatic deceleration */
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);

/* Expo out — snappy and confident */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

## One Hero Animation Per View

Pick one orchestrated moment per page or view. Everything else should be instant or very fast (100-150ms).

A page load might have a hero entrance sequence — content fading in, a panel sliding up. That is the hero moment. The sidebar, the nav, the footer — those should already be there. If everything animates, nothing stands out and the page feels slow.

**Good**: Dashboard loads. The main chart area has a staggered entrance. Everything else is static.
**Bad**: Dashboard loads. Nav slides down, sidebar slides in, cards cascade, chart bounces, numbers count up. The user waits 2 seconds to see their data.

## Motion as Feedback vs. Motion as Decoration

**Feedback motion** communicates a state change. It answers: "what just happened?"
- Toggle switches sliding to their new position
- A deleted item collapsing out of a list
- A loading spinner
- A form field shaking on invalid input

**Decorative motion** exists to look nice. It answers nothing.
- Background particles
- Hover effects that scale cards up with a shadow
- Infinite gradient animations
- Floating elements that bob gently

Feedback motion is nearly always worth it. Decorative motion must earn its place — and in most product UIs, it cannot.

## Performance Budget: Compositor-Only Animations

Only animate **transform** and **opacity**. These two properties are composited on the GPU without triggering layout or paint.

Animating anything else — `width`, `height`, `padding`, `margin`, `top`, `left`, `border-radius`, `background-color` — causes layout recalculation or repaint, and will drop frames on lower-end devices.

**For height animations** (accordions, expandable sections), use the grid technique:

```css
.expandable {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--duration-normal) var(--ease-out);
}

.expandable[open] {
  grid-template-rows: 1fr;
}

.expandable-inner {
  overflow: hidden;
}
```

**`will-change` is not a performance hack.** Only add it when animation is imminent (on hover or when a class is added), and remove it when the animation completes. Permanent `will-change` wastes GPU memory.

## Staggered Animations

Use CSS custom properties for clean stagger:

```css
.stagger-item {
  animation: fade-up var(--duration-normal) var(--ease-out) both;
  animation-delay: calc(var(--i, 0) * 40ms);
}
```

```html
<div class="stagger-item" style="--i: 0">First</div>
<div class="stagger-item" style="--i: 1">Second</div>
<div class="stagger-item" style="--i: 2">Third</div>
```

**Cap staggered items at 5-7.** Beyond that, reduce per-item delay or only stagger the first few. 20 items at 50ms = 1 second of cascading, which is painful. If a list has many items, stagger the first 5 and fade the rest in together.

## Spring Physics: When and When Not

Spring-based animations (via JS libraries like Framer Motion or React Spring) produce natural-feeling movement with overshoot and settling. They are appropriate for:

- **Direct manipulation** — dragging, throwing, swiping, where the UI tracks the user's finger
- **Playful, consumer-facing UIs** — social apps, creative tools, onboarding
- **Reorder animations** — items settling into new positions after a drag

They are not appropriate for:

- **Professional/data UIs** — dashboards, admin panels, enterprise tools. Overshoot feels imprecise.
- **Rapid repeated actions** — if the user triggers it often, spring settle time adds up
- **Anything that needs to feel instant** — spring physics have a tail that makes things feel slightly slower

When using springs, tune the damping. Underdamped springs (lots of bounce) look playful but feel uncontrolled. Most UI springs should be critically damped or slightly underdamped — fast settle, minimal overshoot.

## Reduced Motion

This is not optional. Vestibular disorders affect a significant portion of users. Respect the preference:

```css
.card {
  animation: slide-up 400ms var(--ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .card {
    animation: fade-in 200ms ease-out;
  }
}
```

**What to preserve under reduced motion:**
- Opacity transitions (crossfades are fine)
- Color changes
- Progress indicators (slowed if spinning)
- Focus indicators

**What to remove:**
- Spatial movement (slides, zooms, parallax)
- Staggered entrances
- Background animations
- Spring physics / overshoot

A blanket `animation-duration: 0.01ms !important` works as a last resort but is crude. Prefer per-animation alternatives that still communicate state changes through opacity and color.

## Perceived Performance

**The ~80ms sensory buffer** (practical heuristic, not a single research finding): The brain processes sensory input over roughly 20-150ms depending on modality. As a practical target, aim for under ~80ms for micro-interaction feedback — button presses, toggles, checkboxes — to feel instantaneous.

**Active vs. passive waiting**: Time spent watching a spinner feels longer than time spent watching meaningful content appear. Strategies:

- **Skeleton screens** — show the shape of incoming content immediately. The user's brain starts processing layout before data arrives.
- **Optimistic updates** — update the UI before the server confirms. Roll back on failure. Use for low-stakes actions (likes, saves, toggles).
- **Progressive reveal** — show what you have, stream the rest. Do not hold everything for a complete response.

**Easing affects perceived duration**: An animation that decelerates (ease-out) at the end feels like it arrived. An animation that accelerates toward completion (ease-in) makes the wait feel shorter because the peak-end effect weights the fast ending heavily.

**Do not hide slow loading with slow animations.** If data takes 2 seconds to load, a 2-second entrance animation does not mask it — it doubles it.

---

**Avoid**: Animating everything (motion fatigue). Durations over 500ms for standard UI interactions. Raw cubic-bezier values in component files instead of tokens. Ignoring `prefers-reduced-motion`. Using animation to disguise performance problems. Bounce and elastic easing as defaults.
