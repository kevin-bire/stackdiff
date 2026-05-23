# bookmarkState

Manages a set of bookmarked service keys for quick navigation within the diff view.

## Shape

```ts
interface BookmarkState {
  bookmarks: Set<string>;  // fast membership checks
  orderedKeys: string[];   // insertion-ordered list for cycling
}
```

## API

| Function | Description |
|---|---|
| `createBookmarkState()` | Returns a fresh empty state |
| `addBookmark(state, key)` | Adds a service key; no-op if already present |
| `removeBookmark(state, key)` | Removes a service key; no-op if absent |
| `toggleBookmark(state, key)` | Adds or removes depending on current state |
| `hasBookmark(state, key)` | Returns `true` if the key is bookmarked |
| `nextBookmark(state, current)` | Returns the next bookmarked key in insertion order |
| `prevBookmark(state, current)` | Returns the previous bookmarked key in insertion order |
| `clearBookmarks(state)` | Returns state with all bookmarks removed |
| `getBookmarkCount(state)` | Returns the number of active bookmarks |

## Immutability

All functions return **new state objects**. The original state is never mutated,
making it safe to use with React-style render loops or simple equality checks.

## Key Bindings (suggested)

- `m` — toggle bookmark on current service
- `]` — jump to next bookmark
- `[` — jump to previous bookmark
- `M` — clear all bookmarks
