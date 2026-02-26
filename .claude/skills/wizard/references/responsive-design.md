# Responsive Design

## Container Queries as the Default

Media queries ask "how wide is the viewport?" Container queries ask "how wide is my container?" Components live in containers, not viewports. Container queries are the correct default for component-level responsiveness.

```css
/* Define a containment context */
.card-grid {
  container-type: inline-size;
  container-name: card-area;
}

/* Component adapts to its container, not the viewport */
@container card-area (min-width: 600px) {
  .card {
    grid-template-columns: 200px 1fr;
  }
}

@container card-area (max-width: 599px) {
  .card {
    grid-template-columns: 1fr;
  }
}
```

**When to use container queries:**
- Components that appear in different contexts (sidebar vs. main content vs. modal)
- Card layouts, list items, form fields, media objects
- Anything that should adapt to available space, not screen size

**When to use media queries:**
- Page-level layout decisions (sidebar visible vs. hidden)
- Global typography adjustments
- Navigation pattern switches (hamburger vs. horizontal)

The mental model: `@container` for components, `@media` for pages.

## Input Method Detection Over Screen Size

The same 1024px viewport can be a laptop touchscreen or a desktop monitor. Screen width alone tells you nothing about how the user interacts. Detect the input method:

```css
/* Fine pointer: mouse, trackpad */
@media (pointer: fine) {
  .button { padding: 8px 16px; }
  .list-item { padding: 6px 12px; }
}

/* Coarse pointer: finger, stylus. Use any-pointer for multi-input devices */
@media (any-pointer: coarse) {
  .button { padding: 12px 20px; min-height: 44px; }
  .list-item { padding: 12px 16px; min-height: 44px; }
}

/* Device supports hover */
@media (hover: hover) {
  .card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

/* No hover capability */
@media (hover: none) {
  /* Skip hover states entirely — use active/pressed instead */
  .card:active {
    transform: scale(0.98);
  }
}
```

**Layer these with size queries** when needed:

```css
/* Small touch device — likely phone */
@media (pointer: coarse) and (max-width: 640px) {
  .nav { position: fixed; bottom: 0; }
}

/* Large touch device — likely tablet */
@media (pointer: coarse) and (min-width: 768px) {
  .nav { position: sticky; top: 0; }
}
```

## Mobile-First: Start Constrained

Base styles serve mobile. Layer complexity with `min-width`:

```css
/* Base: single column, stacked */
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

/* Tablet and up: add sidebar */
@media (min-width: 768px) {
  .layout {
    grid-template-columns: 260px 1fr;
  }
}

/* Desktop: wider sidebar, more breathing room */
@media (min-width: 1200px) {
  .layout {
    grid-template-columns: 320px 1fr;
    gap: var(--space-lg);
  }
}
```

Desktop-first (`max-width`) means mobile downloads and parses styles it immediately overrides. Mobile-first means each breakpoint only adds what is needed.

## Adapt, Don't Amputate

Never hide functionality on smaller screens. If desktop users need it, mobile users need it too. Find a different presentation:

| Desktop Pattern | Mobile Adaptation |
|----------------|-------------------|
| Sidebar with filters | Bottom sheet or collapsible filter bar |
| Multi-column table | Stacked cards with key data visible |
| Hover tooltips | Tap-to-reveal or inline helper text |
| Right-click context menu | Long-press menu or explicit overflow button |
| Drag-and-drop reordering | Move up/down buttons or handle with native drag |
| Side-by-side comparison | Tabbed or swipeable comparison |

**Bad**: Hiding the search bar on mobile behind a toggle.
**Good**: Making the search bar full-width and sticky at the top on mobile.

**Bad**: Removing table columns on small screens.
**Good**: Transforming the table into cards that show the same data in a stacked layout.

## Fluid Everything

Stop designing in fixed steps. Use `clamp()`, `min()`, and `max()` so values flow smoothly between extremes.

### The Fluid Formula

```
clamp(minimum, preferred, maximum)
```

The preferred value is typically viewport-relative, creating smooth scaling:

```css
:root {
  /* Fluid font sizes */
  --text-body: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-heading: clamp(1.5rem, 1rem + 2.5vw, 3rem);

  /* Fluid spacing */
  --space-section: clamp(2rem, 1rem + 5vw, 6rem);
  --space-container: clamp(1rem, 0.5rem + 2.5vw, 3rem);

  /* Fluid container width */
  --container-width: min(90vw, 1200px);
}

/* Fluid padding that grows with viewport */
.container {
  width: var(--container-width);
  margin-inline: auto;
  padding-inline: var(--space-container);
}

/* Fluid gap in grids */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: clamp(1rem, 0.5rem + 1.5vw, 2rem);
}
```

**`min()` for maximum constraints:**
```css
.image { width: min(100%, 600px); }  /* Never wider than 600px or container */
```

**`max()` for minimum constraints:**
```css
.footer { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
```

Fluid values significantly reduce the number of breakpoints needed. Many simple layouts can work with very few explicit breakpoints when built with `clamp()` and `auto-fill`/`auto-fit` grids. Breakpoints remain necessary for structural changes like navigation patterns and complex layout shifts.

## Content-Driven Breakpoints

Do not use device-width breakpoints (375px, 768px, 1024px) by default. Instead:

1. Start at the narrowest reasonable width
2. Stretch the viewport until the design breaks
3. Add a breakpoint at that width
4. Repeat

Three breakpoints usually suffice. If you need more than four, the design may lack fluid foundations.

When you do need standard reference points:

```css
/* Small: phone landscape, small tablet */
@media (min-width: 640px) { }

/* Medium: tablet, small laptop */
@media (min-width: 768px) { }

/* Large: laptop, desktop */
@media (min-width: 1024px) { }

/* Extra large: wide desktop */
@media (min-width: 1280px) { }
```

## Safe Areas: Handle the Notch

Modern phones have notches, dynamic islands, rounded corners, and home indicators. Account for them:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

```css
.app-shell {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Combine with your own spacing */
.bottom-bar {
  padding-bottom: max(var(--space-md), env(safe-area-inset-bottom));
}
```

Without `viewport-fit=cover`, the browser adds its own padding and you lose control.

## Responsive Images

### `srcset` with Width Descriptors

```html
<img
  src="hero-800.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Dashboard overview"
>
```

The browser picks the best file based on viewport width AND device pixel ratio. You do not need to calculate — just provide the options.

### `<picture>` for Art Direction

When different viewport sizes need different crops or compositions:

```html
<picture>
  <source media="(min-width: 768px)" srcset="hero-wide.jpg">
  <source media="(max-width: 767px)" srcset="hero-tall.jpg">
  <img src="hero-wide.jpg" alt="Product showcase">
</picture>
```

## Layout Adaptation Patterns

**Navigation**: Hamburger + drawer on mobile. Horizontal compact on tablet. Full with labels on desktop. Use `<nav>` with appropriate ARIA at each stage.

**Data tables**: On mobile, transform to cards using `display: block` on table elements with `data-label` attributes for column headers. Or use a horizontally scrollable container for simple tables.

**Forms**: Single column on mobile, two-column for related field pairs on desktop. Never put unrelated fields side-by-side just to save space.

## Testing Checklist

DevTools responsive mode is a starting point, not a finish line. It misses real touch behavior, performance constraints, font rendering, and browser chrome.

**Test on real devices:**
- One iPhone (Safari rendering, safe areas, dynamic island)
- One Android — preferably a mid-range device, not a flagship (reveals performance issues)
- A tablet if your app targets tablet users

**Check every viewport:**
- [ ] Touch targets are minimum 44x44px with 8px spacing
- [ ] Text is readable without zooming (16px minimum body)
- [ ] No horizontal scroll on any content
- [ ] Thumb zone: primary actions reachable with one hand on phone
- [ ] Keyboard does not obscure active input on mobile
- [ ] Landscape orientation does not break layout
- [ ] Content loads and is usable on slow 3G

**Input method checks:**
- [ ] All hover interactions have touch equivalents
- [ ] Drag-and-drop has an alternative input method
- [ ] Focus states are visible and logical in tab order
- [ ] Pinch-to-zoom works where appropriate (do not disable it with `user-scalable=no`)

---

**Avoid**: Desktop-first CSS. Device detection (user agent sniffing) instead of feature detection. Hiding features on mobile. Fixed pixel breakpoints from device specs. `user-scalable=no` in viewport meta. Assuming all mobile devices are low-end (or high-end). Separate mobile and desktop codebases.
