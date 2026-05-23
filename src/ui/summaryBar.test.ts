import { buildSummaryText } from './summaryBar';
import { computeDiffSummary } from './diffSummary';
import { ServiceDiff } from '../diff';

function makeDiffs(specs: Array<{ name: string; status: ServiceDiff['status'] }>): Record<string, ServiceDiff> {
  const result: Record<string, ServiceDiff> = {};
  for (const { name, status } of specs) {
    result[name] = { status, fields: {} } as ServiceDiff;
  }
  return result;
}

describe('buildSummaryText', () => {
  it('includes service counts and change summary', () => {
    const diffs = makeDiffs([
      { name: 'web', status: 'added' },
      { name: 'db', status: 'removed' },
    ]);
    const summary = computeDiffSummary(diffs);
    const text = buildSummaryText(summary);
    expect(text).toContain('+1');
    expect(text).toContain('-1');
    expect(text).toContain('|');
  });

  it('shows no-services text for empty diffs', () => {
    const summary = computeDiffSummary({});
    const text = buildSummaryText(summary);
    expect(text).toContain('No services');
    expect(text).toContain('No differences found');
  });

  it('shows unchanged services', () => {
    const diffs = makeDiffs([{ name: 'cache', status: 'unchanged' }]);
    const summary = computeDiffSummary(diffs);
    const text = buildSummaryText(summary);
    expect(text).toContain('1 unchanged');
  });

  it('separates left and right sections with pipe', () => {
    const diffs = makeDiffs([{ name: 'api', status: 'changed' }]);
    const summary = computeDiffSummary(diffs);
    const text = buildSummaryText(summary);
    const pipeIndex = text.indexOf('|');
    expect(pipeIndex).toBeGreaterThan(0);
  });
});
