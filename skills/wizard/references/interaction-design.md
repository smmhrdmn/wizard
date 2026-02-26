# Interaction Design

## The Eight Interactive States

Every interactive element needs all eight states designed. Missing states are not edge cases — they are the states users encounter when things go wrong, which is when good design matters most.

| State | When | Visual Treatment |
|-------|------|------------------|
| **Rest** | Default, no interaction | Base styling |
| **Hover** | Pointer over (mouse/trackpad only) | Subtle lift, color shift, cursor change |
| **Active** | Being pressed/clicked | Pressed in, darker, scaled down slightly |
| **Focus** | Keyboard or programmatic focus | Visible ring (see focus section) |
| **Disabled** | Not available | Reduced opacity (0.4-0.5), `cursor: not-allowed` |
| **Loading** | Processing an action | Spinner replacing label, skeleton, progress |
| **Error** | Something went wrong | Red border, error icon, message below |
| **Success** | Action completed | Green check, brief confirmation |

**Hover and focus are different states.** Keyboard users never see hover. Touch users never see either. Design all three interaction modes independently.

## Focus Rings: Do Them Right

Never `outline: none` without a replacement. Use `:focus-visible` to show rings only for keyboard navigation:

```css
button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

**Focus ring requirements:**
- 3:1 contrast ratio against adjacent colors (SC 1.4.11, AA)
- 2-3px thick (SC 2.4.13 Focus Appearance — AAA, but strongly recommended)
- Offset from the element edge (not inside it) — CSS best practice, not a WCAG requirement
- Consistent across every interactive element in the system
- Focused elements must not be entirely obscured by sticky headers or other content (SC 2.4.11 Focus Not Obscured, AA — new in WCAG 2.2)

Do not style `:focus` directly — it fires on mouse clicks too, producing unwanted rings. `:focus-visible` is the correct selector for keyboard-only focus indication.

## Undo Over Confirm

Prefer undo over confirmation for reversible actions. Users click through "Are you sure?" dialogs reflexively — the pattern protects nothing because the answer is always "Yes, that is why I clicked the button." Reserve confirmation dialogs for truly irreversible, high-stakes operations (deleting an account, publishing to production).

**The undo pattern (for reversible actions):**

1. Perform the action immediately — remove the item from the UI
2. Show an undo toast with a timer (5-10 seconds)
3. If the user clicks Undo, restore the item
4. If the timer expires, execute the permanent action (API call, database delete)

```html
<!-- Undo toast -->
<div role="status" aria-live="polite" class="toast">
  <span>Message deleted.</span>
  <button>Undo</button>
  <div class="toast-timer" style="animation: shrink 8s linear"></div>
</div>
```

**When to use confirm instead of undo:**
- Truly irreversible actions (account deletion, publishing to production)
- High-consequence actions where the API cannot roll back
- Batch operations where undo would be complex ("Delete 847 records")

**When to use neither:**
- Low-consequence, easily repeatable actions (removing a tag, unfollowing)

## Destructive Actions: Severity Tiers

A red button is not enough. Match the confirmation pattern to the severity:

| Severity | Pattern | Example |
|----------|---------|---------|
| **Low** | No extra confirmation | Remove a label, unpin an item |
| **Medium** | Undo toast (5-10s) | Delete a message, remove a team member |
| **High** | Confirm dialog with action name | Delete a project, revoke API keys |
| **Critical** | Type-to-confirm | Delete account, destroy production data |

For type-to-confirm, require the user to type the exact name of the thing being destroyed:

```html
<dialog>
  <p>This will permanently delete <strong>production-db</strong>.</p>
  <label>Type "production-db" to confirm:</label>
  <input type="text" pattern="production-db" required>
  <button disabled>Delete permanently</button>
</dialog>
```

Enable the button only when the input matches. This is not security theater — it forces the user to read and engage with what they are about to destroy.

## Progressive Disclosure

Show the simple version first. Reveal complexity through interaction. This is not hiding features — it is respecting attention.

**Patterns:**

**Expandable sections** — content that is useful but not primary:
```html
<details>
  <summary>Advanced settings</summary>
  <div class="settings-advanced">
    <!-- Secondary controls -->
  </div>
</details>
```

**Drill-down** — lists where each item has depth:
- Show the summary in the list
- Click to expand inline or navigate to detail view
- Never show all detail for all items at once

**Secondary actions on hover / overflow menu** — actions the user needs occasionally:
- Show primary action (Edit) always
- Show secondary actions (Duplicate, Archive, Delete) on hover or in a `...` menu
- Touch fallback: long-press or explicit overflow button

**"Show more" with count** — "Show 12 more comments" not just "Show more." The count sets expectations.

## Loading Patterns

### Skeleton Screens (default)

Use skeleton screens when you know the shape of incoming content. They reduce perceived wait time because the brain starts processing layout before data arrives.

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-2) 25%,
    var(--color-surface-3) 50%,
    var(--color-surface-2) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  to { background-position: -200% 0; }
}
```

### Spinners

Use spinners only when you cannot predict the shape of content — search results of unknown type, third-party data. Keep them small and inline when possible.

### Progress Bars

Use when the operation has measurable progress (file upload, multi-step process). Determinate progress bars reduce anxiety far more than indeterminate ones.

### Optimistic UI (preferred default)

Update the UI before the server responds. Roll back on failure.

**Use for:** Likes, saves, toggles, marking as read, reordering, text edits
**Do not use for:** Payments, publishing, destructive actions, anything with complex server-side validation

```js
// Optimistic: update UI first
setState(newValue);
try {
  await api.save(newValue);
} catch {
  setState(previousValue);  // Roll back
  showError("Couldn't save. Your change was reverted.");
}
```

## Keyboard Navigation

### Beyond Tab Order

Tab order is the minimum. Good keyboard navigation means:

**Arrow keys in lists and grids** — use roving tabindex so Tab enters the component, arrows move within it:

```html
<div role="listbox">
  <div role="option" tabindex="0" aria-selected="true">Item 1</div>
  <div role="option" tabindex="-1">Item 2</div>
  <div role="option" tabindex="-1">Item 3</div>
</div>
```

Arrow keys move `tabindex="0"` between options. Tab exits the component entirely.

**Escape to close** — every overlay (modal, popover, dropdown, drawer) must close on Escape. This is not optional.

**Keyboard shortcuts** for power users:
- Single-key shortcuts (`j`/`k` for navigation, `e` for edit) for apps where users spend hours
- Always show shortcuts in tooltips and menus
- Never override browser defaults (`Ctrl+T`, `Ctrl+W`)
- Provide a shortcut reference (`?` to show all shortcuts is the convention)

**Focus management after actions:**
- After closing a modal, return focus to the trigger element
- After deleting an item, move focus to the next item (not to the top of the page)
- After adding an item, focus the new item or its first input

## Modern APIs: Use Them

### Native `<dialog>`

```js
const dialog = document.querySelector('dialog');
dialog.showModal();  // Focus trap, Escape to close, backdrop
dialog.close();      // Returns focus to trigger
```

No JavaScript focus trapping needed. The browser handles it.

### Popover API

```html
<button popovertarget="menu">Options</button>
<div id="menu" popover>
  <button>Edit</button>
  <button>Delete</button>
</div>
```

Light-dismiss (click outside closes), proper stacking context, accessible by default. No z-index management.

### `inert` Attribute

When an overlay is open, mark background content as inert:

```html
<main inert><!-- Cannot be focused, clicked, or read by screen readers --></main>
<dialog open><!-- Active content --></dialog>
```

## Form Patterns

**Labels are not optional.** Every input needs a visible `<label>` element. Placeholders disappear on input and are not a substitute.

**Validate on blur**, not on every keystroke. Exception: password strength meters, character counts, and search-as-you-type.

**Place errors below the field** they relate to, connected via `aria-describedby`:

```html
<label for="email">Email</label>
<input id="email" aria-describedby="email-error" aria-invalid="true">
<p id="email-error" role="alert">Please enter a valid email address.</p>
```

**Group related fields** with `<fieldset>` and `<legend>` — name fields, address fields, payment details. This is especially important for screen readers.

## Touch Targets

Minimum 24x24px touch target for AA compliance (WCAG 2.5.8). 44x44px is AAA (WCAG 2.5.5) and recommended for touch-primary interfaces. Add padding if the visual element is smaller:

```css
.icon-button {
  /* Visual size: 24px icon */
  /* Touch target: 44px via padding (AAA) */
  padding: 10px;
  min-width: 44px;
  min-height: 44px;
}
```

Ensure at least 8px between adjacent touch targets so fat-finger taps do not hit the wrong one.

---

**Avoid**: Removing focus indicators. Using placeholder as label. Touch targets under 44px. Confirmation dialogs for reversible actions. Custom controls without keyboard support. Hover-only interactions with no touch fallback. Generic error messages that do not explain what to do.
