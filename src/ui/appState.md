# AppState

Central state container for the stackdiff TUI application.

## Overview

`AppState` holds all runtime state needed to render and interact with the diff view:

- **mode**: Current UI mode (`diff` | `help` | `quit`)
- **scrollState**: Tracks vertical scroll position and viewport
- **navigator**: Tracks current service selection and navigation
- **diff**: The computed diff result between two sources
- **sources**: Labels for the two sources being compared
- **totalLines**: Total rendered line count (updated after render)

## Usage

```ts
import { createAppState, setMode } from './appState';

const state = createAppState(diff, ['main', 'feature/x'], viewportH, lineCount);

// Transition to help overlay
const helpState = setMode(state, 'help');

// Check if we should exit
if (isQuit(state)) process.exit(0);
```

## Design Notes

- All state transitions return **new state objects** (immutable updates).
- `updateTotalLines` is called after each render cycle once the rendered
  line count is known, keeping `scrollState` in sync.
- `AppState` is intentionally decoupled from blessed widgets so it can be
  tested without a terminal.
