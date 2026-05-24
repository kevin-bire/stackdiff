# splitViewState

Manages the toggle between **unified** and **split** (side-by-side) diff view modes.

## State Shape

```ts
interface SplitViewState {
  mode: "unified" | "split";
  leftLabel: string;   // label for left pane (e.g. branch name or file path)
  rightLabel: string;  // label for right pane
  focusedPane: "left" | "right";
}
```

## API

| Function | Description |
|---|---|
| `createSplitViewState(leftLabel?, rightLabel?)` | Create initial state in unified mode |
| `toggleViewMode(state)` | Switch between unified and split |
| `setViewMode(state, mode)` | Explicitly set the view mode |
| `focusPane(state, pane)` | Set the active/focused pane |
| `toggleFocusedPane(state)` | Flip focus between left and right |
| `isSplitMode(state)` | Returns `true` when in split mode |
| `getPaneLabels(state)` | Returns `{ left, right }` label object |

## Usage

```ts
let view = createSplitViewState("main", "feature/new-service");
view = toggleViewMode(view); // → split
view = toggleFocusedPane(view); // → focus right pane
```

## Integration

`splitViewRenderer` consumes `SplitViewState` to decide whether to render
lines in a single column or partition them into left/right columns separated
by a `│` divider. The header row shows the pane labels in split mode.
