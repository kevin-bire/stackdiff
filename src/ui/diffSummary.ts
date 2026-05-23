import { ServiceDiff } from '../diff';

export interface DiffSummary {
  totalServices: number;
  addedServices: number;
  removedServices: number;
  changedServices: number;
  unchangedServices: number;
  totalChanges: number;
}

export function computeDiffSummary(diffs: Record<string, ServiceDiff>): DiffSummary {
  let added = 0;
  let removed = 0;
  let changed = 0;
  let unchanged = 0;
  let totalChanges = 0;

  for (const svcName of Object.keys(diffs)) {
    const diff = diffs[svcName];
    if (diff.status === 'added') {
      added++;
      totalChanges++;
    } else if (diff.status === 'removed') {
      removed++;
      totalChanges++;
    } else if (diff.status === 'changed') {
      changed++;
      totalChanges += Object.keys(diff.fields ?? {}).length;
    } else {
      unchanged++;
    }
  }

  return {
    totalServices: Object.keys(diffs).length,
    addedServices: added,
    removedServices: removed,
    changedServices: changed,
    unchangedServices: unchanged,
    totalChanges,
  };
}

export function formatDiffSummary(summary: DiffSummary): string {
  const parts: string[] = [];
  if (summary.addedServices > 0) parts.push(`{green-fg}+${summary.addedServices} added{/}`);
  if (summary.removedServices > 0) parts.push(`{red-fg}-${summary.removedServices} removed{/}`);
  if (summary.changedServices > 0) parts.push(`{yellow-fg}~${summary.changedServices} changed{/}`);
  if (summary.unchangedServices > 0) parts.push(`{grey-fg}${summary.unchangedServices} unchanged{/}`);
  if (parts.length === 0) return '{grey-fg}No services{/}';
  return parts.join('  ');
}

export function formatChangeSummary(summary: DiffSummary): string {
  if (summary.totalChanges === 0) return 'No differences found';
  const svcWord = summary.totalServices === 1 ? 'service' : 'services';
  return `${summary.totalServices} ${svcWord} · ${summary.totalChanges} change${summary.totalChanges !== 1 ? 's' : ''}`;
}
