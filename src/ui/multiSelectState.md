# multiSelectState

Manages multi-selection of services for bulk operations such as exporting, bookmarking, or collapsing multiple services at once.

## State Shape

```ts
interface MultiSelectState {
  selected: Set<string>;   // currently selected service names
  anchorService: string | null; // anchor for range selections
  active: boolean;         // true when at least one service is selected
}
```

## API

| Function | Description |
|---|---|
| `createMultiSelectState()` | Returns a fresh, empty selection state |
| `toggleSelectService(state, name)` | Adds or removes a single service from selection |
| `selectRange(state, all, target)` | Selects all services between the anchor and target |
| `clearSelection(state)` | Removes all selections and resets anchor |
| `selectAll(state, all)` | Selects every service in the provided list |
| `getSelectedServices(state)` | Returns an array of selected service names |
| `isSelected(state, name)` | Returns true if the named service is selected |

## Usage

```ts
let sel = createMultiSelectState();
sel = toggleSelectService(sel, "web");   // select "web"
sel = selectRange(sel, services, "db");  // extend selection to "db"
sel = clearSelection(sel);              // reset
```

## Integration

- Works alongside `sidebarState` for keyboard-driven multi-select (shift+arrow).
- Selected services can be passed to `exportState.exportDiff` for filtered export.
- Pairs with `bookmarkState.toggleBookmark` to bulk-bookmark services.
