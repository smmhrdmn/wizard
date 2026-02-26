---
name: adapt
description: Make designs work across screen sizes, input methods, and contexts — adapt, never amputate
args:
  - name: target
    description: The feature or component to adapt (optional)
    required: false
  - name: context
    description: What to adapt for (mobile, tablet, desktop, print, etc.)
    required: false
---

Adapt existing designs to work effectively across different contexts — screen sizes, input methods, and usage environments. The principle: adapt the presentation, never remove functionality.

## 1. Read Project Context

Read the project config and understand the project's responsive strategy, breakpoints, and any existing container query usage.

## 2. Assess Adaptation Needs

→ *Reference: [responsive-design](references/responsive-design.md) for container queries, fluid techniques, and input adaptation.*

### Understand the source context
- What was it designed for? (Desktop web? Mobile-first?)
- What assumptions were made? (Large screen? Mouse input? Fast connection?)
- What works well in the current context?

### Understand target contexts
- **Input method** (primary differentiator): Touch, mouse, keyboard, voice?
- **Screen size**: Mobile, tablet, desktop, large display?
- **Orientation**: Portrait, landscape, or both?
- **Connection**: Fast wifi, slow cellular, offline-capable?
- **Usage context**: On-the-go glance vs focused desk session?

### Identify what breaks
- What does not fit? (Navigation, data tables, multi-column layouts)
- What does not work? (Hover states on touch, tiny touch targets, horizontal scrolling)
- What is hidden when it should not be? (Features removed instead of adapted)

**CRITICAL**: Adaptation is not scaling. It is rethinking the presentation for each context while preserving all functionality.

## 3. Plan Adaptation Strategy

### Input Method First, Screen Size Second

The most important adaptation axis is not screen width — it is input method. A 1024px-wide iPad has touch input. A 1024px-wide laptop has a mouse. They need different interaction patterns at the same viewport width.

```css
/* Detect input method, not just screen size */
@media (pointer: coarse) {
  /* Touch device: larger targets, no hover-dependent UI */
}

@media (pointer: fine) and (hover: hover) {
  /* Mouse device: smaller targets OK, hover states available */
}
```

### Container Queries as the Default

→ *Reference: [responsive-design](references/responsive-design.md) for container query patterns.*

Components should adapt to their container, not the viewport. A card in a sidebar and a card in the main content area should behave differently based on available space — without knowing about each other.

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { grid-template-columns: 200px 1fr; }
}

@container (max-width: 399px) {
  .card { grid-template-columns: 1fr; }
}
```

Use media queries for page-level layout (navigation, sidebar visibility). Use container queries for component-level layout.

### Adapt, Do Not Amputate

**The rule: if desktop users need it, mobile users probably do too.** Find a different presentation instead of hiding it.

| Desktop pattern | Mobile adaptation (not removal) |
|----------------|-------------------------------|
| Side navigation | Bottom tab bar or drawer |
| Multi-column data table | Card list or horizontally scrollable table |
| Hover tooltips | Tap-to-reveal or inline text |
| Right-click context menu | Long-press menu or action buttons |
| Sidebar filters | Collapsible filter sheet |
| Multi-pane layout | Stacked views with navigation |

## 4. Propose Changes

Present the adaptation plan:
- Which layouts change and how
- Which interactions need input-method variants
- Which components need container queries
- What stays the same across all contexts
- Confirm nothing is being hidden or removed

## 5. Implement Adaptations

### Layout Adaptation

**Fluid techniques over hard breakpoints:**
```css
/* Fluid grid: adapts smoothly instead of jumping */
.grid {
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
}

/* Fluid spacing */
.section {
  padding: clamp(1rem, 3vw, 3rem);
}

/* Fluid typography */
.heading {
  font-size: clamp(1.5rem, 3vw + 0.5rem, 3rem);
}
```

**Breakpoints when needed** — use content-driven breakpoints (where the design breaks), not device-based ones:
```css
/* Content-driven: use when the layout genuinely breaks */
@media (min-width: 40em) { /* ~640px — single column becomes too wide */ }
@media (min-width: 64em) { /* ~1024px — enough room for sidebar */ }
```

### Touch Adaptation

- Minimum 44x44px touch targets with adequate spacing between them
- No hover-dependent interactions — everything accessible via tap
- Bottom sheets instead of dropdowns on mobile (thumb-friendly)
- Swipe gestures where they add value (dismiss, navigate) with button fallbacks
- Thumbs-first: place primary actions within thumb reach on mobile

### Navigation Adaptation

- Transform complex navigation to drawer or bottom tabs on constrained screens
- Persistent navigation on wide screens where space allows
- Breadcrumbs or back buttons for wayfinding in stacked views
- Sticky headers for context — but compact them on scroll to preserve space

### Content Adaptation

- Progressive disclosure: show primary content first, reveal secondary on demand
- Responsive images: `srcset` and `<picture>` for appropriate image sizes
- Lazy loading for off-screen content
- Shorter text variants for constrained spaces (not removed text — shorter text)

### Print Adaptation (if applicable)

- Remove navigation, footers, interactive elements
- Expand hidden content (accordions, tabs — show everything)
- Page breaks at logical points
- Display URLs for links
- Monochrome-safe styling

**NEVER**:
- Hide core functionality on mobile — find a different presentation
- Assume desktop = powerful device and mobile = limited device
- Use different information architecture across contexts (navigation structure should be consistent)
- Break platform expectations (mobile users expect mobile patterns)
- Forget landscape orientation
- Rely solely on viewport width — detect input method too
- Use `display: none` to "adapt" — if content downloads but is hidden, the user pays the performance cost without the benefit

## 6. Verify

Test across real contexts:

- **Real devices**: Actual phones, tablets, desktops — not just browser DevTools
- **Both orientations**: Portrait and landscape on mobile and tablet
- **Touch and mouse**: Same viewport, different input methods
- **Keyboard only**: Full feature accessible without a pointer
- **Small screens**: 320px width — nothing overflows, nothing is unusable
- **Large screens**: 2560px width — nothing stretches absurdly, content is readable
- **Slow connection**: Throttle to 3G, verify loading states and image handling
- **All functionality preserved**: Compare mobile and desktop — is anything missing on mobile that desktop has?
