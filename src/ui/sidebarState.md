# sidebarState

Manages the sidebar panel that displays a navigable list of service names for quick jumping within the diff view.

## State Shape

```ts
type SidebarState = {
  visible: boolean;       // whether the sidebar is shown
  services: string[];     // ordered list of service names
  selectedIndex: number;  // currently highlighted service
  width: number;          // character width of the sidebar column
};
```

## API

| Function | Description |
|---|---|
| `createSidebarState(services?, width?)` | Create initial state |
| `toggleSidebar(state)` | Toggle visibility |
| `showSidebar(state)` | Force visible |
| `hideSidebar(state)` | Force hidden |
| `selectNextService(state)` | Move selection down (wraps) |
| `selectPrevService(state)` | Move selection up (wraps) |
| `selectServiceByName(state, name)` | Jump to a named service |
| `getSelectedService(state)` | Get the currently selected service name |
| `setSidebarServices(state, services)` | Replace service list, reset index |
| `renderSidebarLines(state)` | Produce display lines with `>` marker |

## Usage

The sidebar is toggled via a key binding (e.g. `s`) registered in `keyBindings.ts`. When visible, arrow keys navigate the list and `Enter` triggers `scrollToService` in `diffView.ts`.

All functions are pure and return new state objects.
