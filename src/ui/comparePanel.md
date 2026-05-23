# comparePanel

Encapsulates the state and rendering logic for a side-by-side comparison panel in the diff view.

## Responsibilities

- Holds formatted diff lines with left/right source labels
- Applies filter and search highlight transformations
- Provides visible line slices based on current scroll position
- Generates header and summary text for the UI

## API

### `createComparePanel(diff, leftLabel, rightLabel, formattedLines)`
Creates a new panel with the given labels and pre-formatted diff lines.

### `applyPanelFilter(panel, filter)`
Returns a new panel with `filteredLines` and `totalFiltered` updated according to the current `FilterState`. Applies search highlighting if a query is present.

### `getPanelHeader(panel)`
Returns a blessed-compatible string with bold left/right labels separated by a divider.

### `getVisibleLines(panel, scroll)`
Slices `filteredLines` using the visible range from the given `ScrollState`.

### `getPanelSummary(panel)`
Returns a human-readable summary such as `"42 lines"` or `"10/42 lines (filtered)"`.

## Notes

- All functions are pure and return new objects — the panel is immutable.
- Designed to compose with `filterState`, `scrollState`, and `searchHighlight`.
