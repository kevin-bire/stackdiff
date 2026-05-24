# undoState

Provides a lightweight undo/redo history stack for reversible user actions in stackdiff.

## Supported Action Types

| Type       | Fields                                  | Description                        |
|------------|-----------------------------------------|------------------------------------|
| `filter`   | `prev: string`, `next: string`          | Search/filter query change         |
| `collapse` | `serviceId: string`, `prev/next: bool`  | Service collapse toggle            |
| `bookmark` | `serviceId: string`, `prev/next: bool`  | Bookmark toggle for a service      |

## API

### `createUndoState(maxHistory?: number): UndoState`
Creates a new empty undo state. Defaults to 50 history entries.

### `pushAction(state, action): UndoState`
Records a new action, clearing any redo future. Trims history to `maxHistory`.

### `undo(state): { state, action }`
Pops the most recent past action and places it in the future stack.
Returns `action: null` if there is nothing to undo.

### `redo(state): { state, action }`
Replays the next future action, pushing it back to the past stack.
Returns `action: null` if there is nothing to redo.

### `canUndo(state): boolean`
Returns `true` if there are past actions available.

### `canRedo(state): boolean`
Returns `true` if there are future actions available.

### `clearHistory(state): UndoState`
Resets both past and future stacks.

### `getUndoStatusText(state): string`
Builds a concise status string such as `u:undo(3)  r:redo(1)` for display in the status bar.

## Integration Notes

- Call `pushAction` before applying a reversible change so the *previous* value is captured.
- The caller is responsible for applying the inverse of an `UndoAction` when `undo` returns it.
- `maxHistory` prevents unbounded memory growth during long sessions.
