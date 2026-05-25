import {
  createDiffStatsState,
  computeStatsFromDiffs,
  getServiceStats,
  formatStatsLine,
} from './diffStatsState';
import { ServiceDiff } from '../diff';

function makeServiceDiff(fields: Record<string, { status: string }>): ServiceDiff {
  return { fields } as unknown as ServiceDiff;
}

describe('createDiffStatsState', () => {
  it('returns zeroed state', () => {
    const state = createDiffStatsState();
    expect(state.entries).toEqual([]);
    expect(state.totalAdded).toBe(0);
    expect(state.totalRemoved).toBe(0);
    expect(state.totalChanged).toBe(0);
    expect(state.totalUnchanged).toBe(0);
  });
});

describe('computeStatsFromDiffs', () => {
  it('counts field statuses per service', () => {
    const diffs = {
      web: makeServiceDiff({
        image: { status: 'changed' },
        ports: { status: 'added' },
        env: { status: 'unchanged' },
      }),
      db: makeServiceDiff({
        image: { status: 'removed' },
        volumes: { status: 'added' },
      }),
    };

    const state = computeStatsFromDiffs(diffs);
    expect(state.entries).toHaveLength(2);

    const web = state.entries.find((e) => e.service === 'web')!;
    expect(web.changed).toBe(1);
    expect(web.added).toBe(1);
    expect(web.unchanged).toBe(1);
    expect(web.removed).toBe(0);

    const db = state.entries.find((e) => e.service === 'db')!;
    expect(db.removed).toBe(1);
    expect(db.added).toBe(1);

    expect(state.totalAdded).toBe(2);
    expect(state.totalRemoved).toBe(1);
    expect(state.totalChanged).toBe(1);
    expect(state.totalUnchanged).toBe(1);
  });

  it('handles empty diffs', () => {
    const state = computeStatsFromDiffs({});
    expect(state.entries).toHaveLength(0);
    expect(state.totalAdded).toBe(0);
  });
});

describe('getServiceStats', () => {
  it('returns entry for known service', () => {
    const state = computeStatsFromDiffs({
      api: makeServiceDiff({ port: { status: 'added' } }),
    });
    const entry = getServiceStats(state, 'api');
    expect(entry).toBeDefined();
    expect(entry!.service).toBe('api');
    expect(entry!.added).toBe(1);
  });

  it('returns undefined for unknown service', () => {
    const state = createDiffStatsState();
    expect(getServiceStats(state, 'missing')).toBeUndefined();
  });
});

describe('formatStatsLine', () => {
  it('formats a stats summary', () => {
    const state = computeStatsFromDiffs({
      svc: makeServiceDiff({
        a: { status: 'added' },
        b: { status: 'removed' },
        c: { status: 'changed' },
      }),
    });
    const text = formatStatsLine(state);
    expect(text).toContain('+1 added');
    expect(text).toContain('-1 removed');
    expect(text).toContain('~1 changed');
  });

  it('returns "No changes" when all unchanged', () => {
    const state = computeStatsFromDiffs({
      svc: makeServiceDiff({ a: { status: 'unchanged' } }),
    });
    expect(formatStatsLine(state)).toBe('No changes');
  });
});
