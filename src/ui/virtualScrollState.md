# virtualScrollState

Manages virtual scrolling for large diff outputs. Instead of rendering all lines at once, only the lines within the current viewport (plus an overscan buffer) are passed to the renderer.

## Purpose

When diffs are large (thousands of lines), rendering every line causes performance issues in blessed/terminal UI. Virtual scrolling solves this by tracking a `scrollOffset` and `viewportHeight`, and exposing only the visible slice via `getVisibleWindow`.

## API

### `createVirtualScrollState(totalLines, viewportHeight, overscan?)`
Creates initial state. `overscan` (default `3`) adds extra lines above/below the viewport to reduce flicker on fast scroll.

### `setTotalLines(state, total)`
Updates total line count. Clamps `scrollOffset` if needed.

### `setViewportHeight(state, height)`
Updates viewport height. Clamps `scrollOffset` if needed.

### `virtualScrollTo(state, index)`
Scrolls to an absolute line index. Clamped to `[0, totalLines - viewportHeight]`.

### `virtualScrollBy(state, delta)`
Scrolls by a relative amount.

### `getVisibleWindow(state, allLines)`
Returns a `VisibleWindow` with:
- `startIndex` / `endIndex`: slice boundaries (with overscan)
- `lines`: the visible slice of `allLines`
- `paddingTop` / `paddingBottom`: number of hidden lines above/below (for layout)

### `getScrollPercent(state)`
Returns scroll position as a 0–100 integer, useful for scroll indicators.
