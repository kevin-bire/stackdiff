import { computeDiffSummary, formatDiffSummary, formatChangeSummary } from './diffSummary';
import { ServiceDiff } from '../diff';

function makeDiffs(specs: Array<{ name: string; status: ServiceDiff['status'] }>): Record<string, ServiceDiff> {
  const result: Record<string, ServiceDiff> = {};
  for (const { name, status } of specs) {
    result[name] = {
      status,
      fields: status === 'changed' ? { image: { left: 'a', right: 'b' }, ports: { left: '80', right: '8080' } } : {},
    } as ServiceDiff;
  }
  return result;
}

describe('computeDiffSummary', () => {
  it('returns zeroes for empty diffs', () => {
    const summary = computeDiffSummary({});
    expect(summary.totalServices).toBe(0);
    expect(summary.totalChanges).toBe(0);
  });

  it('counts added services', () => {
    const diffs = makeDiffs([{ name: 'web', status: 'added' }]);
    const summary = computeDiffSummary(diffs);
    expect(summary.addedServices).toBe(1);
    expect(summary.totalChanges).toBe(1);
  });

  it('counts removed services', () => {
    const diffs = makeDiffs([{ name: 'db', status: 'removed' }]);
    const summary = computeDiffSummary(diffs);
    expect(summary.removedServices).toBe(1);
  });

  it('counts changed fields for changed services', () => {
    const diffs = makeDiffs([{ name: 'api', status: 'changed' }]);
    const summary = computeDiffSummary(diffs);
    expect(summary.changedServices).toBe(1);
    expect(summary.totalChanges).toBe(2);
  });

  it('counts unchanged services', () => {
    const diffs = makeDiffs([{ name: 'cache', status: 'unchanged' }]);
    const summary = computeDiffSummary(diffs);
    expect(summary.unchangedServices).toBe(1);
    expect(summary.totalChanges).toBe(0);
  });

  it('handles mixed statuses', () => {
    const diffs = makeDiffs([
      { name: 'web', status: 'added' },
      { name: 'db', status: 'removed' },
      { name: 'api', status: 'changed' },
      { name: 'cache', status: 'unchanged' },
    ]);
    const summary = computeDiffSummary(diffs);
    expect(summary.totalServices).toBe(4);
    expect(summary.addedServices).toBe(1);
    expect(summary.removedServices).toBe(1);
    expect(summary.changedServices).toBe(1);
    expect(summary.unchangedServices).toBe(1);
  });
});

describe('formatDiffSummary', () => {
  it('returns no-services text for empty summary', () => {
    const summary = computeDiffSummary({});
    expect(formatDiffSummary(summary)).toContain('No services');
  });

  it('includes added/removed/changed counts', () => {
    const diffs = makeDiffs([
      { name: 'web', status: 'added' },
      { name: 'db', status: 'removed' },
    ]);
    const text = formatDiffSummary(computeDiffSummary(diffs));
    expect(text).toContain('+1');
    expect(text).toContain('-1');
  });
});

describe('formatChangeSummary', () => {
  it('returns no-diff message when no changes', () => {
    const summary = computeDiffSummary({});
    expect(formatChangeSummary(summary)).toBe('No differences found');
  });

  it('uses singular for single service', () => {
    const diffs = makeDiffs([{ name: 'web', status: 'added' }]);
    const text = formatChangeSummary(computeDiffSummary(diffs));
    expect(text).toContain('1 service');
  });

  it('uses plural for multiple services', () => {
    const diffs = makeDiffs([
      { name: 'web', status: 'added' },
      { name: 'db', status: 'removed' },
    ]);
    const text = formatChangeSummary(computeDiffSummary(diffs));
    expect(text).toContain('2 services');
  });
});
