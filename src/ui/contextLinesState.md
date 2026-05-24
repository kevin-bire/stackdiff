# contextLinesState

Manages the number of context lines shown around diff hunks in the unified diff view.

## Purpose

When viewing diffs, it's useful to show a configurable number of unchanged lines
around each changed section (hunk). This module tracks that count and provides
utilities to filter lines accordingly.

## State Shape

```ts
interface ContextLinesState {
  count: number; // current number of context lines
  min: number;   // minimum allowed (default 0)
  max: number;   // maximum allowed (default 10)
}
```

## Functions

| Function | Description |
|---|---|
| `createContextLinesState(initial?, min?, max?)` | Creates state, clamped to range |
| `increaseContext(state)` | Adds one context line (up to max) |
| `decreaseContext(state)` | Removes one context line (down to min) |
| `setContextLines(state, count)` | Sets count directly, clamped |
| `resetContextLines(state)` | Resets count to default (3) |
| `computeVisibleIndices(changed, total, count)` | Returns a Set of visible line indices |
| `applyContextToLines(lines, changed, state)` | Filters lines, inserting `...` separators |

## Key Bindings (suggested)

- `+` / `=` — increase context lines
- `-` — decrease context lines
- `0` — reset to default (3 lines)

## Notes

- The separator `"..."` is inserted between non-contiguous visible hunks.
- Context is computed symmetrically around each changed line index.
- Works with any string array (pre-formatted diff output).
