# Spatial Design

## Surface Layering

Space in a UI is not just padding and margins. It starts with surfaces — the layers that establish depth, containment, and hierarchy before any content is placed.

### The Three Surface Levels

**Background (bg)** — page-level regions. The canvas everything sits on. Defines major zones: sidebar, main content, header. Background surfaces set the context.

**Panel** — floating or elevated containers. Cards, modals, popovers, drawers. Panels break out of the background plane to signal "this is a distinct object." They carry shadows or borders for separation.

**Surface** — inline interactive areas within panels or backgrounds. Form fields, list items, table rows, toggles. Surfaces are where interaction happens.

```css
:root {
  /* Background layer */
  --bg-page: oklch(97% 0.01 250);
  --bg-sidebar: oklch(95% 0.015 250);
  --bg-header: oklch(99% 0.005 250);

  /* Panel layer */
  --panel-default: white;
  --panel-raised: white;
  --panel-overlay: white;

  /* Surface layer — interactive inline areas */
  --surface-interactive: oklch(96% 0.01 250);
  --surface-hover: oklch(94% 0.015 250);
  --surface-active: oklch(91% 0.02 250);
  --surface-selected: oklch(93% 0.04 250);
}
```

Every UI element lives on one of these levels. When something feels "off" spatially, check whether it's on the correct surface level before adjusting padding.

### Depth Without Cards

Not everything needs a card. Surfaces can be implied through:
- Background color difference between the region and its parent
- Grouping through shared alignment and proximity
- Subtle borders or dividers instead of fully enclosed containers

Cards add visual weight. Each one demands attention. Use them when content is truly discrete and comparable (a grid of products, a list of projects). For flowing content within a section, whitespace and typography create grouping more cleanly.

## Spacing as Relationship

The most important spatial principle: **proximity indicates relationship**. Elements that are close together are perceived as related. Elements that are far apart are perceived as separate.

### Applying This

```css
/* Related items — tight spacing */
.form-field label {
  margin-bottom: var(--space-1);  /* 4px — label belongs to its input */
}

/* Sibling fields — moderate spacing */
.form-field + .form-field {
  margin-top: var(--space-4);  /* 16px — related but distinct */
}

/* Section boundaries — generous spacing */
.form-section + .form-section {
  margin-top: var(--space-8);  /* 32px — different topic */
}
```

The ratio matters more than the absolute values. If within-group spacing is 8px, between-group spacing should be at least 24px (3x) for the grouping to be visually clear.

**Anti-pattern**: Equal spacing everywhere. When every gap is 16px, nothing is grouped — the layout reads as a flat list. Vary spacing to express structure.

### The Proximity Ladder

Think in three levels of proximity (practical heuristic based on Gestalt proximity — the specific ratios are guidelines, not research-backed values):

| Level | Ratio | Relationship | Example |
|-------|-------|-------------|---------|
| Tight | 1x | Belongs together | Label + input, icon + text |
| Related | 2–3x | Same group | Fields in a form section |
| Separate | 4–6x | Different groups | Sections on a page |

## Spacing Scale as Tokens

Use a geometric or semi-geometric scale with a 4px base. Name by index, not pixel value.

```css
:root {
  --space-0: 0;
  --space-px: 1px;
  --space-0.5: 0.125rem;  /* 2px */
  --space-1: 0.25rem;     /* 4px */
  --space-2: 0.5rem;      /* 8px */
  --space-3: 0.75rem;     /* 12px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-8: 2rem;        /* 32px */
  --space-10: 2.5rem;     /* 40px */
  --space-12: 3rem;       /* 48px */
  --space-16: 4rem;       /* 64px */
  --space-24: 6rem;       /* 96px */
}
```

The scale is denser at the small end (4, 8, 12, 16) because tight spacing differences matter more to the eye. At larger sizes, jumps from 48 to 64 to 96 are fine — the eye doesn't distinguish 52 from 56 at that range.

### Token Promotion

When does a spacing value become a named token beyond the numeric scale?

**The 2+ uses rule**: If you use the same spacing value for the same semantic purpose twice, promote it to a named token.

```css
:root {
  /* Promoted from repeated use */
  --space-card-padding: var(--space-6);     /* 24px */
  --space-section-gap: var(--space-12);     /* 48px */
  --space-page-gutter: var(--space-4);      /* 16px */
  --space-stack-gap: var(--space-4);        /* 16px */
  --space-inline-gap: var(--space-2);       /* 8px */
}
```

Named semantic tokens communicate intent. `padding: var(--space-card-padding)` tells you why the value exists. `padding: var(--space-6)` only tells you how much.

Don't over-promote. Most spacing tokens should stay numeric. Promote only when the semantic meaning is reused across multiple components.

## Cards Are Optional

Cards are the most overused UI pattern. Before adding a border-radius box with shadow, ask:

**When cards help**:
- Content items are discrete and comparable (product grid, user list)
- Items are individually actionable (click to open, drag to reorder)
- Content needs clear separation from mixed surroundings
- Mobile layouts where full-width cards create clear tap targets

**When cards are noise**:
- Content flows naturally (article text, settings panels)
- Everything on the page is already in a panel — cards inside cards is redundant
- Single-column lists where dividers or spacing work better
- Dashboard widgets that are already inside a defined region

### Grouping Without Cards

```css
/* Grouping through spacing and typography */
.settings-group {
  & + & {
    margin-top: var(--space-8);
    padding-top: var(--space-8);
    border-top: 1px solid var(--color-border);
  }
}

.settings-group h3 {
  font-size: var(--text-subheading);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
}

/* Items within a group — tight spacing, no wrappers */
.settings-item + .settings-item {
  margin-top: var(--space-2);
}
```

The border-top + padding creates a lighter boundary than a card. Content breathes. The page feels unified instead of fractured into boxes.

## Touch Targets vs Visual Size

Interactive elements need a minimum 24x24px touch target for AA (WCAG 2.5.8) and 44x44px for AAA (WCAG 2.5.5). Use 44px for touch-primary interfaces. But visually, a 44px button looks chunky. The solution: decouple visual size from interactive area.

### Pseudo-Element Expansion

```css
.icon-button {
  width: 24px;
  height: 24px;
  position: relative;
  /* Visual size is 24px */
}

.icon-button::before {
  content: '';
  position: absolute;
  inset: -10px; /* Expands target to 44px */
}
```

### Padding Expansion

```css
/* Visually compact text link with adequate touch target */
.inline-link {
  padding: 10px 4px;    /* Expands hit area vertically */
  margin: -10px -4px;   /* Pulls padding back so layout isn't affected */
}
```

This matters most for:
- Icon-only buttons (close, menu, arrow)
- Text links in dense content
- Checkboxes and radio buttons
- Small controls in toolbars and data tables

**Anti-pattern**: Making the visual element 44px to meet the target. This bloats the UI. Separate visual from interactive.

## Optical Adjustments

Mathematical centering and alignment often look wrong to the eye. Trust the eye.

### Text Alignment at Edges

Text at `margin-left: 0` looks indented because of the whitespace within letterforms. Apply a small negative margin to optically align:

```css
.heading-flush {
  margin-left: -0.05em; /* Optically aligns the text edge */
}
```

This matters most with large text (headings, display type) where the optical gap is amplified.

### Icon Centering

Geometrically centered icons often look off-center:
- **Play icons** — shift right ~2px (the triangle's visual center is right of its geometric center)
- **Arrow icons** — shift toward their direction
- **Icons next to text** — align to the text's x-height center, not the line-height center

```css
.play-icon {
  transform: translateX(1px); /* Optical center correction */
}
```

### Padding Asymmetry

Buttons with text often need slightly more padding on the sides than top/bottom, because horizontal text creates a wider visual weight. A ratio of roughly 1:2 (vertical:horizontal) feels balanced:

```css
.button {
  padding: var(--space-2) var(--space-4); /* 8px 16px */
}
```

## Container Queries

Viewport queries are for page layouts. **Container queries are for components.**

```css
.card-wrapper {
  container-type: inline-size;
}

.card {
  display: grid;
  gap: var(--space-3);
}

@container (min-width: 400px) {
  .card {
    grid-template-columns: 120px 1fr;
    gap: var(--space-4);
  }
}

@container (min-width: 600px) {
  .card {
    grid-template-columns: 200px 1fr;
    gap: var(--space-6);
  }
}
```

The same card in a narrow sidebar stays compact. In a wide main area, it expands. No viewport hacks, no prop-drilling widths. The component adapts to its container.

### Self-Adjusting Grids

Use `auto-fit` and `minmax()` for grids that respond to available space with significantly fewer breakpoints:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
}
```

Columns are at least 280px. As many fit per row as the container allows. Remaining space distributes evenly. No media queries.

## Visual Hierarchy Through Space

Space is one of the strongest hierarchy tools — often stronger than size or color.

### Multiple Dimensions

Don't rely on size alone. The strongest hierarchy combines 2–3 dimensions:

| Dimension | Strong | Weak |
|-----------|--------|------|
| Size | 3:1+ ratio | <2:1 ratio |
| Weight | Bold vs Regular | Medium vs Regular |
| Color | High contrast | Similar tones |
| Space | Surrounded by whitespace | Crowded |
| Position | Top/left | Bottom/right |

A heading that is larger, bolder, **and** has more space above it reads as clearly primary. A heading that is just larger might not.

### The Squint Test

Blur your eyes (or apply a Gaussian blur to a screenshot). Can you identify:
- The primary element?
- The secondary element?
- Clear groupings?

If everything blurs to the same weight, the hierarchy is flat. If groupings disappear, the spacing relationships are too uniform.

## Z-Index and Depth

Use a semantic z-index scale instead of arbitrary numbers:

```css
:root {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
  --z-tooltip: 600;
}
```

Gaps of 100 leave room for intermediate layers without renumbering. Components reference tokens: `z-index: var(--z-modal)` is self-documenting.

**Anti-pattern**: `z-index: 9999`. If you need five digits, you've lost control of your stacking contexts. Audit and consolidate.

### Shadow as Elevation

Shadows communicate how far an element floats above the surface. Build a consistent scale:

```css
:root {
  --shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.05);
  --shadow-md: 0 2px 8px oklch(0% 0 0 / 0.08);
  --shadow-lg: 0 8px 24px oklch(0% 0 0 / 0.12);
  --shadow-xl: 0 16px 48px oklch(0% 0 0 / 0.16);
}
```

If you can clearly see the shadow, it's probably too strong. Shadows should be felt, not seen. Reduce opacity before reducing blur.
