# lineNumberState

Manages line number display mode and formatting for the diff view.

## Modes

- **none** — no line numbers shown; gutter is hidden
- **absolute** — each line shows its 1-based position in the full diff output
- **relative** — lines show the distance from the currently focused line (like Vim's `relativenumber`); the current line shows its absolute number

## API

| Function | Description |
|---|---|
| `createLineNumberState(totalLines?)` | Create initial state |
| `cycleLineNumberMode(state)` | Rotate through none → absolute → relative |
| `setLineNumberMode(state, mode)` | Set a specific mode |
| `updateTotalLines(state, n)` | Update total line count and recompute gutter width |
| `setCurrentLine(state, index)` | Set the focused line index (0-based) |
| `formatLineNumber(state, absoluteIndex)` | Format a single line number string |
| `applyLineNumbers(state, lines)` | Prepend line numbers to an array of strings |

## Gutter Width

The gutter is automatically sized to fit the largest line number, with a minimum width of 3 characters.

## Integration

Call `applyLineNumbers` after filtering/wrapping lines but before rendering to the blessed box. Toggle mode via `cycleLineNumberMode` bound to a key (e.g. `n`).
