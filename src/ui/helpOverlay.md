# helpOverlay

Provides a modal help overlay that displays key bindings in a centered box over the terminal UI.

## API

### `createHelpOverlay(screen): HelpOverlay`

Creates a blessed box positioned at the center of the screen containing formatted help text from `keyBindings.formatHelpText()`.

Returns a `HelpOverlay` object with:

| Method | Description |
|---|---|
| `show()` | Makes the overlay visible and focuses it |
| `hide()` | Hides the overlay |
| `isVisible()` | Returns current visibility state |
| `box` | The underlying blessed box element |

### `toggleHelpOverlay(overlay): void`

Convenience function that calls `show()` or `hide()` based on current visibility.

## Usage

```ts
const help = createHelpOverlay(screen);

// In key binding registration:
screen.key(['?', 'h'], () => toggleHelpOverlay(help));
```

## Integration

The overlay is appended to the screen on creation but starts hidden. It pulls content from `keyBindings.formatHelpText()` so the displayed bindings stay in sync with registered handlers.
