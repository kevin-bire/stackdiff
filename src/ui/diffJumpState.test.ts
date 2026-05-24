import {
  createDiffJumpState,
  buildJumpEntries,
  jumpToNext,
  jumpToPrev,
  jumpToFirst,
  jumpToLast,
  getCurrentJumpEntry,
  canJumpNext,
  canJumpPrev,
  formatJumpStatus,
} from './diffJumpState';

const sampleLines = [
  '[web] service',
  '  image: nginx',
  '+ ports: 80:80',
  '- ports: 8080:80',
  '[db] service',
  '~ image: postgres:14',
  '  volumes: ./data',
  '+ environment: DEBUG=1',
];

const serviceKeys = ['web', 'db'];

describe('buildJumpEntries', () => {
  it('extracts added, removed, and changed entries', () => {
    const entries = buildJumpEntries(sampleLines, serviceKeys);
    expect(entries).toHaveLength(4);
    expect(entries[0]).toMatchObject({ lineIndex: 2, changeType: 'added', serviceKey: 'web' });
    expect(entries[1]).toMatchObject({ lineIndex: 3, changeType: 'removed', serviceKey: 'web' });
    expect(entries[2]).toMatchObject({ lineIndex: 5, changeType: 'changed', serviceKey: 'db' });
    expect(entries[3]).toMatchObject({ lineIndex: 7, changeType: 'added', serviceKey: 'db' });
  });

  it('returns empty for lines with no changes', () => {
    const entries = buildJumpEntries(['  image: nginx', '  ports: 80:80'], []);
    expect(entries).toHaveLength(0);
  });
});

describe('jump navigation', () => {
  const base = { ...createDiffJumpState(), entries: buildJumpEntries(sampleLines, serviceKeys) };

  it('starts at -1 (no position)', () => {
    expect(createDiffJumpState().currentIndex).toBe(-1);
  });

  it('jumpToNext advances index', () => {
    const s1 = jumpToNext(base);
    expect(s1.currentIndex).toBe(0);
    const s2 = jumpToNext(s1);
    expect(s2.currentIndex).toBe(1);
  });

  it('jumpToNext clamps at last', () => {
    const atEnd = { ...base, currentIndex: 3 };
    expect(jumpToNext(atEnd).currentIndex).toBe(3);
  });

  it('jumpToPrev decrements index', () => {
    const mid = { ...base, currentIndex: 2 };
    expect(jumpToPrev(mid).currentIndex).toBe(1);
  });

  it('jumpToPrev clamps at 0', () => {
    const atStart = { ...base, currentIndex: 0 };
    expect(jumpToPrev(atStart).currentIndex).toBe(0);
  });

  it('jumpToFirst sets index to 0', () => {
    const mid = { ...base, currentIndex: 2 };
    expect(jumpToFirst(mid).currentIndex).toBe(0);
  });

  it('jumpToLast sets index to last', () => {
    const s = jumpToLast(base);
    expect(s.currentIndex).toBe(3);
  });
});

describe('getCurrentJumpEntry', () => {
  it('returns null when index is -1', () => {
    expect(getCurrentJumpEntry(createDiffJumpState())).toBeNull();
  });

  it('returns correct entry at index', () => {
    const entries = buildJumpEntries(sampleLines, serviceKeys);
    const state = { entries, currentIndex: 1 };
    expect(getCurrentJumpEntry(state)).toEqual(entries[1]);
  });
});

describe('canJumpNext / canJumpPrev', () => {
  const entries = buildJumpEntries(sampleLines, serviceKeys);

  it('canJumpNext false at last', () => {
    expect(canJumpNext({ entries, currentIndex: 3 })).toBe(false);
  });

  it('canJumpNext true before last', () => {
    expect(canJumpNext({ entries, currentIndex: 2 })).toBe(true);
  });

  it('canJumpPrev false at 0', () => {
    expect(canJumpPrev({ entries, currentIndex: 0 })).toBe(false);
  });

  it('canJumpPrev true above 0', () => {
    expect(canJumpPrev({ entries, currentIndex: 1 })).toBe(true);
  });
});

describe('formatJumpStatus', () => {
  it('shows No changes for empty state', () => {
    expect(formatJumpStatus(createDiffJumpState())).toBe('No changes');
  });

  it('formats position and change type', () => {
    const entries = buildJumpEntries(sampleLines, serviceKeys);
    const state = { entries, currentIndex: 0 };
    expect(formatJumpStatus(state)).toContain('1/4');
    expect(formatJumpStatus(state)).toContain('[added]');
  });
});
