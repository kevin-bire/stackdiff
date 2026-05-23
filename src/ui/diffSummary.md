# diffSummary

Provides utilities for computing and formatting a high-level summary of differences between Docker Compose files.

## Types

### `DiffSummary`

A plain object capturing counts of service states:

```ts
interface DiffSummary {
  totalServices: number;
  addedServices: number;
  removedServices: number;
  changedServices: number;
  unchangedServices: number;
  totalChanges: number;
}
```

## Functions

### `computeDiffSummary(diffs)`

Accepts a `Record<string, ServiceDiff>` and returns a `DiffSummary` by iterating over all service diffs and tallying statuses. Changed services contribute their field-level change count to `totalChanges`.

### `formatDiffSummary(summary)`

Returns a blessed-tagged string suitable for display in a terminal UI box. Includes colour-coded counts for added (green), removed (red), changed (yellow), and unchanged (grey) services.

### `formatChangeSummary(summary)`

Returns a plain human-readable string such as `"4 services · 7 changes"` for use in status bars or export headers. Returns `"No differences found"` when `totalChanges` is zero.

## Usage

```ts
import { computeDiffSummary, formatDiffSummary } from './diffSummary';

const summary = computeDiffSummary(diffs);
console.log(formatDiffSummary(summary));
```
