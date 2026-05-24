# progressState

Tracks loading and processing progress for async operations in stackdiff, such as reading files, resolving git branches, parsing YAML, and computing diffs.

## Shape

```ts
interface ProgressState {
  phase: ProgressPhase;   // Current operation phase
  message: string;        // Human-readable status message
  percent: number;        // 0-100 completion percentage
  error: string | null;   // Set when phase === 'error'
}
```

## Phases

| Phase       | Meaning                              |
|-------------|--------------------------------------|
| `idle`      | No operation in progress             |
| `loading`   | Reading files or fetching git refs   |
| `parsing`   | Parsing YAML content                 |
| `diffing`   | Computing service diffs              |
| `rendering` | Building display lines               |
| `done`      | Operation complete                   |
| `error`     | Operation failed                     |

## API

- `createProgressState()` — returns initial idle state
- `setPhase(state, phase, message?, percent?)` — transition to a new phase
- `setProgress(state, percent, message?)` — update percent (clamped 0-100)
- `setError(state, error)` — record an error, sets phase to `'error'`
- `markDone(state)` — mark operation complete at 100%
- `isActive(state)` — true when an operation is in progress
- `formatProgressText(state)` — blessed-compatible string for status bar display
- `buildProgressBar(percent, width)` — ASCII progress bar string

## Usage

```ts
let progress = createProgressState();
progress = setPhase(progress, 'loading', 'Reading compose files', 0);
progress = setProgress(progress, 50, 'Parsing YAML');
progress = markDone(progress);
```
