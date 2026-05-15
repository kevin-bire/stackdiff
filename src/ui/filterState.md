# filterState

Manages the filter/search state for the diff view.

## Overview

`filterState` is a pure, immutable state module that controls how diff lines
are filtered before being displayed in the terminal UI.

## FilterMode

| Mode      | Description                          |
|-----------|--------------------------------------|
| `all`     | Show all lines (default)             |
| `changed` | Show only lines with `~` (modified)  |
| `added`   | Show only lines starting with `+`    |
| `removed` | Show only lines starting with `-`    |

## API

### `createFilterState(): FilterState`
Returns the default filter state with mode `all`, empty search, no service filter.

### `setFilterMode(state, mode): FilterState`
Returns a new state with the given `FilterMode`.

### `setSearchQuery(state, query): FilterState`
Returns a new state with the search query updated.

### `setServiceFilter(state, service | null): FilterState`
Returns a new state scoped to a specific service name, or clears the filter.

### `cycleFilterMode(state): FilterState`
Advances to the next filter mode in the cycle: all → changed → added → removed → all.

### `matchesFilter(state, line): boolean`
Returns `true` if the given line passes the current filter and search query.
