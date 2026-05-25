/**
 * diffStatsState.ts
 * Tracks aggregate statistics for the current diff view:
 * additions, deletions, unchanged lines, and per-service counts.
 */

import { ServiceDiff } from '../diff';

export type DiffStatsEntry = {
  service: string;
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
};

export type DiffStatsState = {
  entries: DiffStatsEntry[];
  totalAdded: number;
  totalRemoved: number;
  totalChanged: number;
  totalUnchanged: number;
};

export function createDiffStatsState(): DiffStatsState {
  return {
    entries: [],
    totalAdded: 0,
    totalRemoved: 0,
    totalChanged: 0,
    totalUnchanged: 0,
  };
}

export function computeStatsFromDiffs(
  diffs: Record<string, ServiceDiff>
): DiffStatsState {
  const entries: DiffStatsEntry[] = [];
  let totalAdded = 0;
  let totalRemoved = 0;
  let totalChanged = 0;
  let totalUnchanged = 0;

  for (const [service, diff] of Object.entries(diffs)) {
    let added = 0;
    let removed = 0;
    let changed = 0;
    let unchanged = 0;

    for (const field of Object.values(diff.fields ?? {})) {
      if (field.status === 'added') added++;
      else if (field.status === 'removed') removed++;
      else if (field.status === 'changed') changed++;
      else if (field.status === 'unchanged') unchanged++;
    }

    entries.push({ service, added, removed, changed, unchanged });
    totalAdded += added;
    totalRemoved += removed;
    totalChanged += changed;
    totalUnchanged += unchanged;
  }

  return { entries, totalAdded, totalRemoved, totalChanged, totalUnchanged };
}

export function getServiceStats(
  state: DiffStatsState,
  service: string
): DiffStatsEntry | undefined {
  return state.entries.find((e) => e.service === service);
}

export function formatStatsLine(state: DiffStatsState): string {
  const { totalAdded, totalRemoved, totalChanged } = state;
  const parts: string[] = [];
  if (totalAdded > 0) parts.push(`+${totalAdded} added`);
  if (totalRemoved > 0) parts.push(`-${totalRemoved} removed`);
  if (totalChanged > 0) parts.push(`~${totalChanged} changed`);
  return parts.length > 0 ? parts.join('  ') : 'No changes';
}
