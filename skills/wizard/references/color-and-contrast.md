# Color & Contrast

## Token Architecture

Color tokens work in three layers. Each layer has a different audience and a different rate of change.

### Layer 1: Primitives

Raw color values. Named by what they are, not what they do. These are the palette.

```css
:root {
  --color-blue-100: oklch(95% 0.03 250);
  --color-blue-200: oklch(88% 0.06 250);
  --color-blue-300: oklch(78% 0.09 250);
  --color-blue-400: oklch(68% 0.12 250);
  --color-blue-500: oklch(58% 0.15 250);
  --color-blue-600: oklch(48% 0.14 250);
  --color-blue-700: oklch(38% 0.12 250);
  --color-blue-800: oklch(28% 0.09 250);
  --color-blue-900: oklch(18% 0.06 250);

  --color-neutral-50:  oklch(97% 0.01 250);
  --color-neutral-100: oklch(93% 0.01 250);
  --color-neutral-200: oklch(86% 0.01 250);
  --color-neutral-300: oklch(73% 0.01 250);
  --color-neutral-400: oklch(60% 0.01 250);
  --color-neutral-500: oklch(47% 0.01 250);
  --color-neutral-600: oklch(37% 0.01 250);
  --color-neutral-700: oklch(27% 0.01 250);
  --color-neutral-800: oklch(20% 0.01 250);
  --color-neutral-900: oklch(13% 0.01 250);
}
```

Primitives rarely change. They define the design vocabulary.

### Layer 2: Semantic

Role-based tokens. Named by what they do, not what they look like. This is the layer that themes swap.

```css
:root {
  /* Surfaces */
  --color-bg: var(--color-neutral-50);
  --color-surface: var(--color-neutral-100);
  --color-surface-raised: white;
  --color-surface-overlay: var(--color-neutral-50);

  /* Text */
  --color-text: var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-500);
  --color-text-tertiary: var(--color-neutral-400);
  --color-text-inverse: white;

  /* Interactive */
  --color-primary: var(--color-blue-500);
  --color-primary-hover: var(--color-blue-600);
  --color-primary-subtle: var(--color-blue-100);

  /* Borders */
  --color-border: var(--color-neutral-200);
  --color-border-strong: var(--color-neutral-300);

  /* Status */
  --color-success: oklch(55% 0.15 145);
  --color-warning: oklch(70% 0.15 75);
  --color-error: oklch(55% 0.18 25);
  --color-info: var(--color-blue-500);
}
```

### Layer 3: Component

Scoped tokens for specific components. These reference semantic tokens and allow per-component overrides without breaking the system.

```css
.button {
  --button-bg: var(--color-primary);
  --button-text: var(--color-text-inverse);
  --button-hover-bg: var(--color-primary-hover);

  background: var(--button-bg);
  color: var(--button-text);
}

.button:hover {
  background: var(--button-hover-bg);
}

.button--ghost {
  --button-bg: transparent;
  --button-text: var(--color-primary);
  --button-hover-bg: var(--color-primary-subtle);
}
```

Component tokens are optional — not every component needs its own layer. Use them when a component has multiple variants or needs to be themed independently.

**The rule**: Components consume semantic tokens. Semantic tokens reference primitives. Primitives hold raw values. Never skip layers — a component should not reference `--color-blue-500` directly.

## OKLCH as the Foundation

**Stop using HSL.** OKLCH is perceptually uniform — equal steps in lightness *look* equal. In HSL, 50% lightness in yellow looks bright while 50% in blue looks dark. OKLCH fixes this.

```css
/* OKLCH: lightness (0-100%), chroma (0-0.4+), hue (0-360) */
oklch(60% 0.15 250)
/*     ↑      ↑     ↑
  lightness  chroma  hue
  (perceived (color    (color
   brightness) intensity) angle)  */
```

### Building a Scale in OKLCH

The key insight: **chroma must decrease at extreme lightness values**. High chroma at very light or very dark levels looks garish and unnatural. The specific chroma values below are practical guidelines — no external source prescribes these exact ranges, but the principle of chroma reduction at extremes is well-established in color science.

```
Lightness   Chroma    Purpose
95%         0.02–0.04  Tinted backgrounds
88%         0.05–0.07  Light fills, subtle highlights
78%         0.08–0.10  Medium-light accents
68%         0.11–0.13  Light interactive states
58%         0.14–0.16  Base accent — your "500"
48%         0.13–0.15  Hover states
38%         0.11–0.13  Active/pressed states
28%         0.08–0.10  Dark accents
18%         0.05–0.07  Near-black tints
```

Keep hue constant across the scale. Adjust only lightness and chroma. This produces a scale that feels like one color at different intensities, not multiple colors.

### Tinted Neutrals

Pure gray (`oklch(50% 0 0)`) is lifeless. Add a whisper of your brand hue to every neutral:

```css
/* Dead grays — clinical, disconnected */
--neutral-100: oklch(95% 0 0);
--neutral-900: oklch(15% 0 0);

/* Brand-tinted neutrals — cohesive, warm */
--neutral-100: oklch(95% 0.01 250);
--neutral-900: oklch(15% 0.01 250);
```

Chroma of 0.005–0.02 is a practical sweet spot for neutral tints (our guideline, not from an external source). Below 0.005 is imperceptible. Above 0.02 becomes visibly colored rather than subtly warm/cool.

## Surface and Elevation

Surfaces are the layers of a UI. They communicate depth — what's in front, what's behind, what contains what.

### The Surface Scale

Build surfaces from back to front:

```css
:root {
  --surface-bg: oklch(97% 0.01 250);     /* Page background */
  --surface-default: oklch(99% 0.005 250); /* Cards, panels */
  --surface-raised: white;                 /* Popovers, dropdowns */
  --surface-overlay: oklch(99% 0.005 250); /* Modals, dialogs */
}
```

Each step forward is slightly lighter (in light mode) or slightly lighter (in dark mode — not darker). Forward = lighter in both modes.

### Depth Cues by Mode

| Technique | Light Mode | Dark Mode |
|-----------|-----------|-----------|
| Surface color | Darker bg, lighter foreground | Darker bg, lighter foreground |
| Shadows | Yes, subtle | Minimal — shadows invisible on dark |
| Borders | Optional, for definition | More important, replaces shadows |
| Background contrast | Subtle | More pronounced between layers |

```css
/* Light mode elevation */
.card {
  background: var(--surface-default);
  box-shadow: 0 1px 3px oklch(0% 0 0 / 0.08);
}

/* Dark mode elevation — rely on surface color, not shadows */
:root[data-theme="dark"] .card {
  background: var(--surface-default);
  box-shadow: none;
  border: 1px solid oklch(100% 0 0 / 0.06);
}
```

## Theme Architecture

Structure tokens so that switching themes means redefining only the semantic layer. Primitives and component tokens stay untouched.

```css
/* Primitives — never change */
:root {
  --color-blue-500: oklch(58% 0.15 250);
  --color-neutral-50: oklch(97% 0.01 250);
  --color-neutral-900: oklch(13% 0.01 250);
}

/* Semantic — light theme (default) */
:root {
  --color-bg: var(--color-neutral-50);
  --color-text: var(--color-neutral-900);
  --color-primary: var(--color-blue-500);
}

/* Semantic — dark theme override */
:root[data-theme="dark"] {
  --color-bg: var(--color-neutral-900);
  --color-text: var(--color-neutral-50);
  --color-primary: oklch(70% 0.12 250); /* Lighter, slightly desaturated */
}
```

**Dark mode is not inverted light mode.** It requires deliberate decisions:

| Property | Light Mode | Dark Mode |
|----------|-----------|-----------|
| Surface depth | Shadows | Lighter surface colors |
| Accent colors | Full saturation | Desaturate slightly (reduce chroma by ~0.02–0.04 — our guideline; the principle of desaturation for dark mode is well-supported by Apple and Material Design) |
| Text weight | 400 (regular) | 350–380 (slightly lighter — dark bg makes text look heavier) |
| Background | Avoid pure white | Avoid pure black — prefer oklch(13-18%). Pure black is acceptable for OLED optimization |
| Borders | Subtle, optional | More visible, often necessary |

## Contrast and Accessibility

### WCAG Requirements

| Content | AA Minimum | AAA Target |
|---------|-----------|------------|
| Body text | 4.5:1 | 7:1 |
| Large text (18px+ or 14px bold) | 3:1 | 4.5:1 |
| UI components, icons | 3:1 | 4.5:1 |
| Decorative elements | None | None |

**The gotcha**: Placeholder text still needs 4.5:1 contrast. The pale gray placeholders seen everywhere usually fail.

### Dangerous Combinations

These commonly fail contrast or cause readability issues:

- **Light gray text on white** — the most common accessibility failure on the web.
- **Gray text on colored backgrounds** — gray looks washed out and dead on color. Use a darker shade of the background color instead, or use transparency of the text color.
- **Red on green / green on red** — 8% of men have red-green color deficiency.
- **Blue on red** — causes visual vibration, physically uncomfortable.
- **Yellow on white** — almost always fails contrast.
- **Thin light text on images** — contrast is unpredictable across the image.

### Avoid Pure Gray and Pure Black for Large Surfaces

Pure gray (`oklch(50% 0 0)`) and pure black (`#000`) don't exist in nature. Real shadows and surfaces always carry a color cast. Even chroma of 0.005–0.01 makes grays feel natural without looking obviously tinted.

Avoid pure black (`#000`) for large dark-mode surfaces — it creates excessive contrast with white text. Prefer `oklch(13-18% 0.01 {hue})`. Exception: pure black is appropriate for OLED dark modes (pixels turn off entirely, saving battery) and for maximum-contrast text that benefits low-vision users.

## When to Use Color

Color should carry information, not decoration.

**Use color for**:
- **Status** — success/error/warning states. Pair with icon or text; never color alone.
- **Interaction** — focus, hover, active, selected states.
- **Grouping** — categorization in data visualization, labels, tags.
- **Brand** — sparingly, for recognition and trust.

**Don't use color for**:
- **Filling empty space** — if a section feels blank, the problem is layout, not color.
- **Creating "energy"** — multicolor gradients and rainbow accents create noise, not energy.
- **Differentiating similar elements** — if two buttons look the same, the problem is hierarchy, not hue.

The 60-30-10 rule (a useful heuristic from interior design, not UX research): 60% neutral (backgrounds, space), 30% secondary (text, borders, inactive states), 10% accent (CTAs, highlights, focus). The exact ratios are a guideline — the core principle is sound: accent colors work because they're rare. Overuse kills their power.

## Alpha and Transparency

Heavy use of `rgba()` or opacity usually signals an incomplete palette. Alpha creates:
- Unpredictable contrast depending on what's behind it
- Performance overhead (compositing layers)
- Inconsistency when background colors change

Define explicit colors for each context. Reserve transparency for:
- Focus rings
- Hover/active state overlays on varied backgrounds
- Scrim/backdrop behind modals
- Elements that genuinely need to show content behind them

**Anti-pattern**: `background: rgba(0, 0, 0, 0.05)` for surface tinting. Define a real surface color token instead.
