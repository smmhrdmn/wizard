# Typography

## Semantic Type Tokens

Type tokens describe purpose, not measurement. A system built on `--text-heading-1` survives redesigns; one built on `--font-24` does not.

### The Token Pattern

```css
:root {
  /* Scale — raw sizes, referenced only by other tokens */
  --type-scale-xs: 0.75rem;    /* 12px */
  --type-scale-sm: 0.875rem;   /* 14px */
  --type-scale-base: 1rem;     /* 16px */
  --type-scale-md: 1.25rem;    /* 20px */
  --type-scale-lg: 1.5rem;     /* 24px */
  --type-scale-xl: 2rem;       /* 32px */
  --type-scale-2xl: 2.5rem;    /* 40px */
  --type-scale-3xl: 3.5rem;    /* 56px */

  /* Semantic tokens — these are what components consume */
  --text-body: var(--type-scale-base);
  --text-body-sm: var(--type-scale-sm);
  --text-caption: var(--type-scale-xs);
  --text-label: var(--type-scale-sm);
  --text-heading-1: var(--type-scale-3xl);
  --text-heading-2: var(--type-scale-2xl);
  --text-heading-3: var(--type-scale-xl);
  --text-heading-4: var(--type-scale-lg);
  --text-subheading: var(--type-scale-md);
  --text-display: var(--type-scale-3xl);

  /* Line heights per role */
  --leading-body: 1.5;
  --leading-heading: 1.15;
  --leading-tight: 1.25;
  --leading-display: 1.05;

  /* Tracking per role */
  --tracking-body: 0;
  --tracking-heading: -0.02em;
  --tracking-display: -0.03em;
  --tracking-caps: 0.05em;

  /* Weights */
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
}
```

Components reference semantics: `font-size: var(--text-body)`. When the design changes, update the mapping — `--text-body` points to a different scale value — and every component follows.

**Anti-pattern**: `font-size: var(--type-scale-base)` directly in a component. That bypasses the semantic layer and makes redesigns a find-and-replace nightmare.

## Modular Scales

A modular scale generates font sizes from a ratio applied to a base. This gives mathematical consistency to hierarchy instead of eyeballing sizes.

| Ratio | Name | Feel |
|-------|------|------|
| 1.125 | Major second | Tight, compact UIs |
| 1.200 | Minor third | Versatile default |
| 1.250 | Major third | Clear hierarchy |
| 1.333 | Perfect fourth | Editorial, generous |
| 1.500 | Perfect fifth | Bold, dramatic |

Pick a ratio that matches the UI density. Data-heavy dashboards use tighter ratios (1.125–1.200). Marketing pages use wider ratios (1.333–1.500). Commit to one per project.

### Building a Scale

Start from 1rem and multiply up, divide down:

```
base × ratio⁻² → xs
base × ratio⁻¹ → sm
base × ratio⁰  → base (1rem)
base × ratio¹  → md
base × ratio²  → lg
base × ratio³  → xl
```

With a 1.25 ratio: 0.64rem, 0.8rem, 1rem, 1.25rem, 1.5625rem, 1.953rem. Round to clean values for the token scale.

## Fluid Type with clamp()

Fluid type scales between a minimum and maximum size based on viewport width, eliminating breakpoint jumps.

### The Formula

```css
/* clamp(min, preferred, max) */
/* preferred = base + viewport-proportional value */

--text-heading-1: clamp(2rem, 1rem + 3vw, 3.5rem);
--text-heading-2: clamp(1.5rem, 0.75rem + 2vw, 2.5rem);
--text-body: clamp(1rem, 0.9rem + 0.25vw, 1.125rem);
```

The preferred value structure: `{rem-offset} + {vw-rate}`. The rem offset prevents collapse to 0 on small screens. The vw rate controls how fast scaling happens — higher = more responsive to viewport changes.

### When NOT to Use Fluid Type

- **UI controls** — buttons, labels, form elements. These need consistent, predictable sizing.
- **Data tables** — column alignment depends on stable character widths.
- **Navigation** — shifting nav text causes layout instability.
- **Anything below 1rem** — captions and small text rarely benefit from fluid scaling.

Fluid type is for display and heading text. Body text can use it subtly (0.25vw or less).

## Vertical Rhythm

If body text has `line-height: 1.5` at `1rem` (= 24px), that 24px unit becomes the rhythmic baseline for all vertical spacing. Margins, padding, gaps — multiples of 24px.

```css
:root {
  --rhythm: calc(var(--text-body) * var(--leading-body));
  /* 1rem × 1.5 = 1.5rem (24px at default) */

  --space-block-sm: var(--rhythm);          /* 24px */
  --space-block-md: calc(var(--rhythm) * 2); /* 48px */
  --space-block-lg: calc(var(--rhythm) * 3); /* 72px */
}
```

Vertical rhythm creates subconscious order — text and space share a mathematical foundation. Headings, paragraphs, cards, sections all lock to the same grid.

**Practical truth**: Perfect vertical rhythm breaks when mixing type sizes with different line-heights. Don't obsess over pixel-perfect rhythm. Get close and let the eye resolve the rest. The baseline grid is a guide, not a cage.

## Readability and Measure

Optimal line length: **45–75 characters** for body text. Use `ch` units:

```css
.prose {
  max-width: 65ch;
}
```

Line-height scales inversely with line length:
- Narrow columns (30–40ch): `line-height: 1.4`
- Standard body (50–65ch): `line-height: 1.5`
- Wide columns (75ch+): `line-height: 1.6–1.7`

**Non-obvious**: Light text on dark backgrounds looks lighter than it is. Increase line-height by 0.05–0.1 and consider reducing font weight slightly (350 instead of 400) in dark mode.

## Font Selection Principles

Don't pick fonts by name. Pick them by structural properties that serve your design goals.

### What Makes a Display Font Work

Display fonts (for headlines, hero text) need:
- **Strong personality at large sizes** — distinctive letterforms that are visible at 32px+.
- **Tight default tracking** — display text should feel dense and confident. Letter-spacing: -0.02em to -0.04em.
- **Weight range** — at minimum, a bold/black weight. Variable fonts with wide weight axes give more control.

### What Makes a Body Font Work

Body fonts need the opposite qualities:
- **Open counters** — the enclosed spaces in `a`, `e`, `o` should be generous for readability at small sizes.
- **Generous x-height** — taller lowercase letters are more legible.
- **Even color** — the "texture" of a paragraph should look uniform, not spotty.
- **Complete character set** — check for numerals, currency symbols, diacritics.

### Evaluating Pairings

Good pairings contrast in **structure**, not just weight:
- Serif + sans-serif (structural contrast)
- Geometric + humanist (personality contrast)
- Condensed display + proportional body (proportion contrast)

**Never pair fonts that are similar but not identical** — two geometric sans-serifs will create tension without clear purpose. If fonts look alike, use one.

**The one-family approach**: A single well-chosen variable font in multiple weights often creates cleaner hierarchy than two competing typefaces. Use a second font only when you need genuine structural contrast.

### When Serif vs Sans vs Mono

- **Sans-serif**: Apps, dashboards, UI-heavy products. Clean, functional.
- **Serif**: Editorial, long-form, luxury, authority. Better sustained reading in print; on screen the gap has narrowed with high-DPI displays.
- **Monospace**: Code, data, technical content, design elements that need mechanical precision.
- **Display/decorative**: Headlines only. Never for body text. Never for UI.

## When to Break the Scale

A modular scale is a starting point, not law. These situations call for stepping outside it:

- **Data-heavy UIs** — dashboards and tables need a compressed range of sizes. The difference between header and data might be 14px vs 12px, not a full scale step.
- **Compact modes** — dense UIs (spreadsheets, admin panels, IDEs) need an independent, tighter scale. Don't try to make one scale serve both comfortable and compact layouts.
- **Optical sizing** — a font at 12px may need +1px to match the visual weight of the scale. Trust the eye over the number.
- **Custom components** — a badge, a tag, a pill. These have their own proportional logic. Size text to the component, not to the global scale.

When you break the scale, document why. A comment like `/* 13px: optical correction for tag readability */` prevents the next developer from "fixing" it back.

## Web Font Loading

Layout shift from font loading is a design bug. Prevent it:

```css
/* 1. Control visibility during load */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* or 'optional' for performance-first sites — avoids CLS entirely but may not show the web font on slow connections */
}

/* 2. Match fallback metrics to minimize reflow */
@font-face {
  font-family: 'CustomFont-Fallback';
  src: local('Arial');
  size-adjust: 105%;
  ascent-override: 90%;
  descent-override: 20%;
  line-gap-override: 10%;
}

body {
  font-family: 'CustomFont', 'CustomFont-Fallback', sans-serif;
}
```

Tools like [Fontaine](https://github.com/unjs/fontaine) calculate metric overrides automatically. The goal: when the web font loads, nothing moves.

**Preload critical fonts** in the document head:

```html
<link rel="preload" href="/fonts/body.woff2" as="font" type="font/woff2" crossorigin>
```

Limit preloads to 1–2 fonts. Each preloaded font competes with other critical resources.

## OpenType Features

Polish lives in the details. Most fonts ship features that developers never activate:

```css
/* Tabular numbers — essential for data alignment */
.data-table { font-variant-numeric: tabular-nums; }

/* Proper fractions */
.recipe-amount { font-variant-numeric: diagonal-fractions; }

/* Small caps for abbreviations */
abbr { font-variant-caps: all-small-caps; }

/* Disable ligatures in code (fi, fl merging breaks readability) */
code { font-variant-ligatures: none; }

/* Oldstyle figures for running text */
.prose { font-variant-numeric: oldstyle-nums; }

/* Kerning — usually on by default, be explicit */
body { font-kerning: normal; }
```

`tabular-nums` is the most impactful. Any column of numbers — prices, dates, statistics — should use it. Without it, numbers have proportional widths and columns won't align.

## Accessibility

- **Never `user-scalable=no`**. If your layout breaks at 200% zoom, fix the layout.
- **Use rem/em for font sizes**. Pixel values ignore user browser settings.
- **16px minimum for body text**. Smaller than this fails readability on mobile.
- **Touch targets**: Text links need padding or line-height that creates 44px+ tap areas. The visual text can be small; the interactive area must not be.
- **Don't use font weight alone for emphasis**. Pair with color or size — some font weights are too subtle to distinguish, especially on low-contrast displays.
