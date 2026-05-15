# searchHighlight

Utilities for applying search query highlighting to diff output lines in the terminal UI.

## Overview

This module provides functions to match and visually highlight substrings within
blessed-rendered lines using color tags (e.g., `{yellow-fg}...{/}`).

## API

### `escapeRegex(query: string): string`
Escapes special regex metacharacters in a user-provided search string so it can
be safely used in a `RegExp` constructor.

### `highlightMatches(line, query, colorTag?): HighlightResult`
Searches a single line for the query (case-insensitive) and wraps all matches
in the given blessed color tag. Returns `{ line, hasMatch }`.

- Default `colorTag` is `{yellow-fg}`.
- Returns the original line unchanged if there is no match or the query is empty.

### `highlightLines(lines, query, filterNonMatching?): string[]`
Applies `highlightMatches` across an array of lines.

- When `filterNonMatching` is `true`, only lines containing a match are returned
  (useful for search-filter mode).
- When `false` (default), all lines are returned with matches highlighted in place.

### `countMatches(lines, query): number`
Returns the number of lines that contain at least one match for the query.
Useful for displaying a match count in the status bar.

## Integration

This module is consumed by `filterBar.ts` and `diffView.ts` to apply live
highlighting as the user types a search query in the filter bar.
