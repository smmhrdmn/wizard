---
name: deploy-check
description: Pre-deploy verification gate — checks build, assets, meta tags, a11y, design tokens, and leaked dev artifacts
args:
  - name: focus
    description: Specific area to check (e.g. "assets", "a11y", "tokens"). Runs all checks if omitted.
    required: false
---

Run a non-destructive pre-deploy check on the current project. This is read-only — no files are modified.

Read the project's the project config first to understand the build setup, design tokens, and any project-specific conventions.

## Checks

Run all checks below (or just the focused area from `$ARGUMENTS`). Track pass/fail for each.

### 1. Build

Find and run the project's build command (check `package.json` for `build`, `build:prod`, or equivalent).

- **PASS**: Build completes without errors
- **FAIL**: Report build errors. Stop here — other checks may be unreliable on a broken build.

### 2. Assets

Scan all HTML files in the build output for broken references:

- `<img>` tags: verify every `src` resolves to an actual file
- `<link>` stylesheet `href` values resolve
- `<script>` `src` values resolve
- Font references in CSS (`url()` in `@font-face`) resolve
- Favicon and apple-touch-icon references resolve

Report broken references with file path and line number.

### 3. Meta tags

Check every HTML entry point for:

- `<title>` tag present and non-empty (not "React App" or placeholder text)
- `<meta name="description">` present and non-empty
- `<meta property="og:title">` and `<meta property="og:description">` present
- `<meta property="og:image">` present and the image URL resolves
- `<link rel="icon">` or `<link rel="shortcut icon">` present and resolves
- `<html lang="...">` attribute present

### 4. Leaked dev artifacts

Scan the build output for things that shouldn't ship:

- `console.log`, `console.warn`, `console.error` statements (unless in error handling)
- `TODO`, `FIXME`, `HACK`, `XXX` comments
- `localhost`, `127.0.0.1`, or other dev URLs
- `.env` files or references to `process.env` values that look like secrets
- Test data, mock data, or placeholder content ("Lorem ipsum", "test@example.com", "John Doe")
- Source maps in production (`.map` files) — flag but don't fail, as this is sometimes intentional

### 5. Accessibility (critical issues only)

Check for the most impactful a11y problems:

- Images missing `alt` attributes (decorative images should use `alt=""`)
- `<html>` missing `lang` attribute
- Form inputs missing associated `<label>` elements or `aria-label`
- Buttons or links with no accessible text (empty or icon-only without `aria-label`)
- Heading hierarchy: no skipped levels (h1 → h3 without h2)
- Color contrast: scan for text colors against their background that fail WCAG AA (4.5:1 body, 3:1 large text)
- Missing skip-to-content link
- `tabindex` values greater than 0 (disrupts natural focus order)

### 6. Design token usage

Reference the project's design system (from the project config or CSS custom properties) and scan for:

- Hardcoded hex, rgb, hsl, or oklch color values in component files that should use tokens
- Hardcoded pixel values for spacing that don't match the project's spacing scale
- Hardcoded font-size values that bypass the type scale
- Hardcoded border-radius, shadow, or z-index values that the design system provides as tokens
- Inline styles that duplicate what tokens or utility classes provide

### 7. AI slop patterns

Scan for common AI-generated anti-patterns:

- **Color**: Pure black `#000` or pure white `#fff` on large surfaces without intentional reason (prefer slightly tinted). Cyan-on-dark, purple-to-blue gradients, neon accents. Gradient text on headings or metrics.
- **Typography**: Overused fonts set explicitly (Inter, Roboto, Open Sans, Lato) without intentional styling. No semantic type tokens.
- **Layout**: Identical card grids (3-column, same-size, icon + heading + description repeated). Cards nested inside cards. Uniform spacing with no rhythm.
- **Decoration**: Glassmorphism (backdrop-blur) used as general style rather than for specific depth purposes. Decorative sparklines conveying no data. Rounded rectangles with generic drop shadows as the only container style.
- **Motion**: Bounce/elastic easing as default. Animations on layout properties (width, height, margin, padding) instead of transform/opacity. Duration over 500ms for standard UI.

This check is advisory — flag issues but weight them as warnings, not hard failures.

## Output

Present results as a clear pass/fail report:

```
Pre-deploy check: [project name]
================================

1. Build ............... PASS / FAIL
2. Assets .............. PASS / FAIL (X broken references)
3. Meta tags ........... PASS / FAIL (X missing)
4. Dev artifacts ....... PASS / FAIL (X found)
5. Accessibility ....... PASS / FAIL (X critical issues)
6. Design tokens ....... PASS / FAIL (X hardcoded values)
7. AI slop patterns .... PASS / WARN (X patterns detected)

Verdict: Ready to deploy / Has issues (X failures, X warnings)
```

For any FAIL or WARN, list the specific issues with file paths and line numbers.

If there are multiple failures, suggest: "Want me to fix these with the **batch** workflow?"
