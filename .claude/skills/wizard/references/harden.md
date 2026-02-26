---
name: harden
description: Make interfaces production-ready — error handling, text overflow, i18n, keyboard navigation, and edge cases
args:
  - name: target
    description: The feature or area to harden (optional)
    required: false
---

Strengthen interfaces against the reality of production use — extreme inputs, network failures, internationalization, keyboard-only users, and edge cases that break idealized designs.

## 1. Read Project Context

Read the project config and understand the project's architecture, target audience, and supported locales.

## 2. Assess Hardening Needs

Test the feature mentally (or in the browser) against these scenarios:

### Extreme inputs
- Very long text: names with 100+ characters, descriptions that are paragraphs
- Very short text: empty strings, single characters
- Special characters: emoji, RTL text, accents, mathematical symbols
- Large numbers: millions, billions, negative numbers, zero
- Many items: 1000+ list items, 50+ dropdown options
- No data: every list empty, every field blank

### Error scenarios
- Network failures: offline, slow connection, timeout mid-operation
- API errors: 400, 401, 403, 404, 429, 500
- Validation errors: every field wrong, partial completion
- Permission errors: logged out mid-session, role changes
- Concurrent operations: double-click submit, race conditions

### Internationalization
- Text expansion: German is often up to ~35% longer than English
- RTL languages: Arabic, Hebrew — does layout mirror correctly?
- CJK characters: Chinese, Japanese, Korean — do they display and wrap correctly?
- Date formats: 1/15/2024 vs 15.1.2024 vs 2024-01-15
- Number formats: 1,000 vs 1.000 vs 1 000
- Currency: symbols before or after, varying decimal conventions

### Keyboard navigation
- Can every interactive element be reached via Tab?
- Can every action be triggered via Enter or Space?
- Do modals trap focus correctly?
- Is there a logical tab order?
- Do skip links exist for long content?
- Are custom components (dropdowns, date pickers, carousels) keyboard-operable?

**CRITICAL**: Designs that only work with perfect data, fast networks, English text, and mouse users are not production-ready.

## 3. Propose Hardening Plan

Present findings organized by severity:
- **Breaking**: Things that will fail or be unusable (no error handling, overflow breaking layout)
- **Degraded**: Things that work but poorly (truncated without indication, missing keyboard access)
- **Missing**: Things not yet built (empty states, loading states, error recovery)

## 4. Harden Systematically

### Text Overflow

→ *Reference: [interaction-design](references/interaction-design.md) for input handling patterns.*

Every text container needs a strategy: truncate, wrap, or scroll. There is no fourth option.

```css
/* Single line: truncate with ellipsis */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Multi-line: clamp to N lines */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Long words: break and hyphenate */
.wrap-break {
  overflow-wrap: break-word;
  hyphens: auto;
}
```

**Flex and grid overflow prevention:**
```css
/* Flex items must allow shrinking below content size */
.flex-item { min-width: 0; }

/* Grid items too */
.grid-item { min-width: 0; min-height: 0; }
```

- Set `min-width` on flex/grid children to prevent overflow
- Test every text element with a 100-character string
- Test every text element with a single character
- Use `clamp()` for fluid typography with minimum readable sizes

### Internationalization (i18n)

**Text expansion room:**
- Add ~35% space budget for translations (more for short strings)
- Use flexbox/grid that adapts to content length
- Never use fixed widths on text containers
- Test layouts with text 1.5x and 2x current length

```jsx
// Bad: assumes short English text
<button className="w-24">Submit</button>

// Good: adapts to content
<button className="px-4 py-2 whitespace-nowrap">Submit</button>
```

**RTL support — use logical properties:**
```css
margin-inline-start: 1rem;   /* not margin-left */
padding-inline: 1rem;        /* not padding-left/right */
border-inline-end: 1px solid; /* not border-right */
```

**Number and date formatting:**
```javascript
// Use Intl API — never format manually
new Intl.DateTimeFormat(locale).format(date);
new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
```

**Pluralization:**
```javascript
// Bad: English-only pluralization
`${count} item${count !== 1 ? 's' : ''}`

// Good: locale-aware
new Intl.PluralRules(locale).select(count) // → 'one', 'few', 'many', 'other'
```

### Error Handling

**Network errors:**
- Show clear error message explaining what happened
- Provide a retry action
- Preserve user input — never lose form data on error
- Handle timeout scenarios with appropriate messaging

**API errors — handle each status code:**
- 400: Show specific validation errors inline
- 401: Redirect to login, preserve intended destination
- 403: Show permission error with who to contact
- 404: Show a helpful not-found state with navigation options
- 429: Show rate limit message with when to retry
- 500: Show generic error, offer support contact

**Form validation:**
- Inline errors near the relevant field
- Specific messages: "Email needs an @ symbol" not "Invalid input"
- Preserve all user input on error — never clear the form
- Validate on blur for instant feedback, on submit for completeness

### Empty States

Every list, table, feed, and dashboard panel needs an empty state.

- Explain why it is empty (if not obvious)
- Show a clear next action
- Make it welcoming, not a dead end
- Consider using the empty state to teach the feature

### Loading States

- Initial load: skeleton screens, not spinners
- Subsequent loads: preserve existing content, show loading indicator inline
- Long operations: show progress and time estimate
- Always offer a cancel/escape option for operations over 5 seconds

### Concurrent Operations

- Disable submit buttons during pending requests (prevent double-submission)
- Handle race conditions: last-write-wins or optimistic update with rollback
- Abort pending requests when the component unmounts
- Debounce search inputs (300ms), throttle scroll handlers (100ms)

### Keyboard Navigation

→ *Reference: [interaction-design](references/interaction-design.md) for focus management and keyboard patterns.*

- All interactive elements reachable via Tab in logical order
- All actions triggerable via Enter or Space
- Modal focus trapping: Tab cycles within the modal, Escape closes it
- Skip links for pages with long navigation or repeated content
- `:focus-visible` for keyboard focus rings (not `:focus`)
- Custom components (dropdowns, date pickers, sliders) must be keyboard-operable
- Arrow keys for navigation within composite widgets (tabs, menus, radio groups)

### Accessibility Resilience

- Proper ARIA labels on custom interactive elements
- Live regions (`aria-live`) for dynamic content changes
- Semantic HTML: `<button>` for actions, `<a>` for navigation
- Test with screen reader to verify announcements
- `prefers-reduced-motion` respected for all animations
- `prefers-color-scheme` respected if theming is supported

**NEVER**:
- Assume perfect input — validate everything
- Leave error messages generic ("Error occurred")
- Use fixed widths for text containers
- Assume English-length text
- Trust client-side validation alone
- Block the entire interface when one component errors
- Forget keyboard users exist
- Clear user input on error

## 5. Verify

Test with real edge cases:

- **Long text**: 100+ character names in every text field
- **Emoji**: Use emoji in all text inputs
- **Empty**: Remove all data, verify every empty state
- **Offline**: Disable network, attempt key actions
- **Keyboard only**: Unplug the mouse, navigate the entire feature
- **Rapid clicks**: Click submit 10 times quickly
- **RTL**: Test with Arabic text if i18n is supported
- **Zoom**: Browser zoom to 200%, verify nothing breaks
- **Large datasets**: Test with 1000+ items in lists
