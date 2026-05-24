# diffJumpState

Tracks and navigates between individual diff change positions within the rendered output.

## Purpose

When viewing a large diff, users need to jump quickly between changed lines without
manually scrolling. `diffJumpState` builds an index of all change positions and
provides cursor-style navigation through them.

## API

### `createDiffJumpState(): DiffJumpState`
Returns an empty state with no entries and `currentIndex: -1`.

### `buildJumpEntries(lines, serviceKeys): JumpEntry[]`
Scans rendered diff lines and extracts positions for `+` (added), `-` (removed),
and `~` (changed) lines. Associates each entry with the most recently seen service key.

### `jumpToNext(state) / jumpToPrev(state)`
Advances or retreats the `currentIndex`, clamped to valid bounds.

### `jumpToFirst(state) / jumpToLast(state)`
Jumps directly to the first or last change entry.

### `getCurrentJumpEntry(state): JumpEntry | null`
Returns the entry at `currentIndex`, or `null` if no position is set.

### `canJumpNext(state) / canJumpPrev(state): boolean`
Predicates used to enable/disable navigation controls.

### `formatJumpStatus(state): string`
Produces a status string like `Change 2/5 [added]` for display in the status bar.

## Integration

- Call `buildJumpEntries` whenever the diff lines are recomputed (e.g. after filter or search changes).
- Use `getCurrentJumpEntry().lineIndex` to drive `scrollState` so the viewport follows the jump cursor.
- Expose `n` / `N` key bindings in `keyBindings.ts` to call `jumpToNext` / `jumpToPrev`.
