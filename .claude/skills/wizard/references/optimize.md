---
name: optimize
description: Performance pass across loading, rendering, images, animation, and bundle size. Measure first, optimize what matters, verify improvements.
args:
  - name: target
    description: The feature or area to optimize (optional)
    required: false
---

**First**: Use the frontend-design skill for performance-related design guidance.

Systematic performance optimization. Measure before changing anything — premature optimization wastes time. Fix the biggest bottleneck first.

## Step 1: Assess Current State

Before optimizing, understand what's slow:

1. **Scan the codebase** for performance signals:
   - Image files: formats, sizes, loading strategy
   - CSS: total size, unused rules, render-blocking stylesheets
   - JavaScript: bundle size, third-party scripts, dynamic imports
   - Fonts: number loaded, loading strategy, subsetting
   - Animations: what properties are animated, easing complexity

2. **Identify bottlenecks** by category:
   - **Loading**: Large unoptimized assets? Render-blocking resources? Too many requests?
   - **Rendering**: Layout thrashing? Expensive repaints? Deep DOM trees?
   - **Animation**: Animating layout properties? Missing will-change discipline? No reduced motion?
   - **Images**: Oversized? Wrong format? No lazy loading? No responsive srcset?
   - **Bundle**: Unused dependencies? No code splitting? No tree shaking?

3. **Prioritize**: Fix the biggest impact issues first. Don't micro-optimize while ignoring major problems.

## Step 2: Loading Performance

### Critical CSS
- Inline critical above-fold CSS to eliminate render-blocking
- Load remaining CSS asynchronously
- Remove unused CSS rules (scan for dead selectors)
- Use CSS containment (`contain: layout style paint`) for independent page regions

### Font Loading
- Use `font-display: swap` or `font-display: optional` — no invisible text during load
- Preload critical fonts: `<link rel="preload" href="font.woff2" as="font" crossorigin>`
- Subset fonts to only the character ranges needed (`unicode-range`)
- Limit font weights — each weight is a separate file download
- Consider system font stacks for body text where brand fonts aren't essential

### Resource Loading Strategy
- `<link rel="preload">` for critical above-fold assets (hero image, primary font)
- `<link rel="prefetch">` for likely next-page resources
- `defer` or `async` on non-critical scripts
- Avoid loading third-party scripts synchronously in the document head

## Step 3: Rendering Performance

### Minimize Layout Thrashing
- Never interleave DOM reads and writes — batch all reads, then all writes
- Use `requestAnimationFrame` for DOM mutations that need to sync with paint
- Avoid reading layout-triggering properties (`offsetHeight`, `getBoundingClientRect`) inside loops that also write

### Reduce Paint & Composite Cost
- Use `transform`, `opacity`, and `filter` for all animations — these are compositor-only, no layout or paint
- Apply `will-change` only to elements about to animate, and remove it after the animation completes — persistent `will-change` wastes GPU memory
- Use `content-visibility: auto` for long lists or off-screen content regions
- Minimize DOM depth — flatter trees render faster
- Use CSS `contain` property to isolate layout/paint boundaries

### Avoid Forced Reflows
Layout-triggering properties to watch for in hot paths:
- `offsetWidth`, `offsetHeight`, `offsetTop`, `offsetLeft`
- `scrollWidth`, `scrollHeight`, `scrollTop`, `scrollLeft`
- `clientWidth`, `clientHeight`, `clientTop`, `clientLeft`
- `getComputedStyle()`, `getBoundingClientRect()`

Reading any of these forces the browser to calculate layout. In a loop, this creates layout thrashing.

## Step 4: Image Optimization
→ *Reference: [responsive-design](references/responsive-design.md) for responsive image patterns.*

### Modern Formats
- Use WebP as baseline (broad support, 25-35% smaller than JPEG)
- Use AVIF where supported (25-35% smaller than standard JPEG) with WebP fallback via `<picture>`
- Use SVG for icons, logos, and simple illustrations — infinitely scalable, tiny file size
- PNG only for images requiring transparency where SVG is not viable

### Responsive Images
```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img
    src="hero.jpg"
    srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 1200px"
    alt="Descriptive alt text"
    loading="lazy"
    decoding="async"
    width="1200"
    height="675"
  >
</picture>
```

### Loading Strategy
- **Above-fold images**: No `loading="lazy"` — these should load immediately. Preload the LCP image.
- **Below-fold images**: `loading="lazy"` and `decoding="async"`
- **All images**: Set explicit `width` and `height` (or `aspect-ratio` in CSS) to prevent layout shift
- **Background images**: Consider replacing CSS background images with `<img>` for lazy loading support

### Compression
- JPEG/WebP quality 80-85% is usually imperceptible from 100%
- Run images through compression (squoosh, sharp, imageoptim)
- Don't serve 3000px images for 300px display areas — resize to match rendered size at 2x for retina

## Step 5: Animation Performance
→ *Reference: [motion-design](references/motion-design.md) for easing, orchestration, and performance constraints.*

### Compositor-Only Animations
Only these properties can animate at 60fps without triggering layout or paint:
- `transform` (translate, scale, rotate, skew)
- `opacity`
- `filter` (with GPU acceleration)

Everything else (`width`, `height`, `padding`, `margin`, `top`, `left`, `border-radius`, `background-color`) triggers layout or paint. Replace with transform equivalents:
- Width/height changes → `transform: scale()`
- Position changes → `transform: translate()`
- Show/hide → `opacity` with `pointer-events: none`

### will-change Discipline
```css
/* Apply before animation starts */
.about-to-animate {
  will-change: transform, opacity;
}

/* Remove after animation completes (via JS or animation events) */
```

- Never apply `will-change` globally or permanently — each instance creates a new compositor layer, consuming GPU memory
- Only promote elements that actually need it and are about to animate
- Prefer `transform: translateZ(0)` as a one-off promotion hack only as a last resort

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
- Always provide a reduced-motion alternative
- Reduced motion means less motion, not no feedback — instant state changes are fine
- Test with reduced motion enabled in OS settings

## Step 6: Bundle Optimization

### Unused CSS
- Scan for selectors that match no elements in the rendered pages
- Remove dead CSS from stylesheets
- If using Tailwind: purge is automatic in production builds — verify it's configured

### Tree Shaking
- Use named imports (`import { thing }`) not namespace imports (`import * as lib`)
- Check that dependencies support tree shaking (ESM format)
- Audit `node_modules` for unexpectedly large packages — `bundle-phobia` or `bundlejs` for size checks

### Code Splitting
- Split by route — each page loads only its own code
- Split large components behind dynamic `import()` — modals, charts, rich text editors, settings panels
- Split vendor code from application code for better cache behavior
- Analyze bundle with your framework's built-in analyzer or `webpack-bundle-analyzer`

### Dependency Audit
- Remove unused dependencies from `package.json`
- Replace heavy libraries with lighter alternatives where the full feature set isn't needed
- Check for duplicate dependencies (different versions of the same package)

## Optimization Report

After completing the pass, summarize:

```
Performance Report: [target]

Loading:
  - Critical CSS: [status]
  - Font loading: [status]
  - Image optimization: [status]
  - Resource hints: [status]

Rendering:
  - Layout thrashing: [status]
  - DOM complexity: [status]
  - CSS containment: [status]

Images:
  - Modern formats: [status]
  - Responsive srcset: [status]
  - Lazy loading: [status]
  - Layout shift prevention: [status]

Animation:
  - Compositor-only: [status]
  - will-change discipline: [status]
  - Reduced motion: [status]

Bundle:
  - Unused CSS: [status]
  - Code splitting: [status]
  - Tree shaking: [status]
  - Dependency audit: [status]

Issues found: [count]
Issues fixed: [count]
Issues requiring user decision: [count]
```

## Principles

- **Measure first.** Don't guess what's slow. Scan the code, identify actual bottlenecks, fix those.
- **Biggest impact first.** A 2MB uncompressed hero image matters more than shaving 3KB off a utility function.
- **Don't sacrifice accessibility.** Performance gains that break keyboard navigation, screen reader support, or reduced motion preferences are not acceptable.
- **Don't break functionality.** Verify the feature still works correctly after every optimization.
- **User perception matters most.** An interface that *feels* fast (instant feedback, progressive loading, smooth transitions) beats one that loads 100ms faster but feels janky.
