# Scroll State

The `scrollState` module manages keyboard-driven scroll and selection state for the diff view.

## State Shape

```ts
interface ScrollState {
  offset: number;        // first visible line index
  selectedIndex: number; // currently highlighted item index
  totalItems: number;    // total number of navigable items
  visibleLines: number;  // number of lines visible in the pane
}
```

## Functions

| Function | Description |
|---|---|
| `createScrollState(total, visible)` | Create a fresh state at position 0 |
| `scrollUp(state)` | Move selection up by one, adjusting offset if needed |
| `scrollDown(state)` | Move selection down by one, advancing offset if needed |
| `scrollToIndex(state, index)` | Jump to a specific item, centering the viewport |
| `getVisibleRange(state)` | Return `{ start, end }` slice of currently visible items |
| `updateTotalItems(state, total)` | Resize total items, clamping selection and offset |

## Usage

```ts
import { createScrollState, scrollDown, scrollToIndex } from './scrollState';

let scroll = createScrollState(serviceNames.length, boxHeight);

// on arrow-down key
scroll = scrollDown(scroll);

// jump to a specific service
const idx = serviceNames.indexOf(targetService);
scroll = scrollToIndex(scroll, idx);
```
