# sessionState

Manages a lightweight session object that persists UI state across stackdiff runs.

## Purpose

Allows the user to resume where they left off: same scroll position, active service, filter mode, theme, and search query are restored on next launch.

## Types

### `SessionData`
Plain data bag holding all serialisable UI fields:
- `scrollOffset` — current scroll line
- `activeService` — last focused service name
- `collapsedServices` — list of collapsed service names
- `filterMode` — active filter (`all`, `changed`, `added`, `removed`)
- `searchQuery` — last search string
- `viewMode` — `unified` or `split`
- `theme` — active theme name

### `SessionState`
Wrapper around `SessionData` with an `isDirty` flag used by `sessionPersistence` to avoid unnecessary disk writes.

## Functions

| Function | Description |
|---|---|
| `createSessionState(initial?)` | Creates a session with defaults, optionally overridden |
| `updateSession(state, patch)` | Returns new state with patched fields, sets `isDirty` |
| `markClean(state)` | Returns state with `isDirty = false` |
| `resetSession(state)` | Resets all fields to defaults, marks dirty |
| `serializeSession(state)` | Converts session data to JSON string |
| `deserializeSession(raw)` | Parses JSON string back to `SessionState` |

## Persistence

See `sessionPersistence.ts` for reading/writing to `~/.stackdiff/session.json`.
