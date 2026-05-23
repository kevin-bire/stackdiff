# diffNavigationHistory

Tracks a back/forward navigation history for the diff viewer, similar to browser history.

## Shape

```ts
interface DiffNavigationHistory {
  entries: NavigationEntry[]; // ordered list of visited positions
  cursor: number;             // index of the current position (-1 = empty)
  maxSize: number;            // maximum entries to retain
}

interface NavigationEntry {
  serviceIndex: number;  // which service was active
  scrollOffset: number;  // scroll position within the view
  timestamp: number;     // when the entry was created
}
```

## API

| Function | Description |
|---|---|
| `createDiffNavigationHistory(maxSize?)` | Creates a new empty history |
| `pushEntry(history, serviceIndex, scrollOffset)` | Adds a new entry, discarding any forward entries |
| `goBack(history)` | Moves cursor back one step, returns the entry or null |
| `goForward(history)` | Moves cursor forward one step, returns the entry or null |
| `canGoBack(history)` | Returns true if a previous entry exists |
| `canGoForward(history)` | Returns true if a forward entry exists |
| `currentEntry(history)` | Returns the entry at the current cursor |
| `clearHistory(history)` | Resets the history to empty |

## Behaviour

- When `pushEntry` is called while the cursor is not at the end (i.e. after going back), all forward entries are discarded — matching standard browser history semantics.
- The history is capped at `maxSize` entries; oldest entries are removed when the cap is exceeded.
- All functions are pure and return new history objects.
