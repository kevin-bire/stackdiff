# watchState

Manages file-watch status for auto-reload of Docker Compose sources.

## State shape

```ts
interface WatchState {
  status: 'idle' | 'watching' | 'changed' | 'error';
  watchedPaths: string[];
  lastChangedPath: string | null;
  lastChangedAt: number | null;
  errorMessage: string | null;
  pollIntervalMs: number;
}
```

## Transitions

```
idle ──startWatching──► watching
watching ──markChanged──► changed
watching ──markError──► error
changed ──resetChanged──► watching
watching/changed ──stopWatching──► idle
```

## Usage

```ts
import { createWatchState, startWatching, markChanged } from './watchState';
import { createWatchPoller } from './watchPoller';

let state = startWatching(createWatchState(2000), ['docker-compose.yml']);
const poller = createWatchPoller(
  () => state,
  (s) => { state = s; },
  (s, path) => console.log('changed:', path),
  (s, err) => console.error('error:', err)
);
poller.start();
```

## Notes

- `watchPoller` uses `fs.statSync` polling; no native watcher dependency.
- `resetChanged` is a no-op if status is not `changed`.
- `getWatchStatusText` produces a one-line summary suitable for the status bar.
