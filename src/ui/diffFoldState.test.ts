import {
  createDiffFoldState,
  addFold,
  removeFold,
  toggleFold,
  isFolded,
  getFoldAt,
  clearFolds,
  toggleFoldEnabled,
  applyFoldsToLines,
} from './diffFoldState';

describe('createDiffFoldState', () => {
  it('starts with no folds and enabled', () => {
    const s = createDiffFoldState();
    expect(s.folds).toHaveLength(0);
    expect(s.enabled).toBe(true);
  });
});

describe('addFold', () => {
  it('adds a fold region', () => {
    const s = addFold(createDiffFoldState(), { startLine: 2, endLine: 5, label: 'context' });
    expect(s.folds).toHaveLength(1);
  });

  it('does not add overlapping fold', () => {
    let s = addFold(createDiffFoldState(), { startLine: 2, endLine: 6, label: 'a' });
    s = addFold(s, { startLine: 4, endLine: 8, label: 'b' });
    expect(s.folds).toHaveLength(1);
  });
});

describe('removeFold', () => {
  it('removes fold by startLine', () => {
    let s = addFold(createDiffFoldState(), { startLine: 3, endLine: 7, label: 'x' });
    s = removeFold(s, 3);
    expect(s.folds).toHaveLength(0);
  });
});

describe('toggleFold', () => {
  it('adds if not present', () => {
    const region = { startLine: 1, endLine: 4, label: 'tog' };
    const s = toggleFold(createDiffFoldState(), region);
    expect(s.folds).toHaveLength(1);
  });

  it('removes if already present', () => {
    const region = { startLine: 1, endLine: 4, label: 'tog' };
    let s = addFold(createDiffFoldState(), region);
    s = toggleFold(s, region);
    expect(s.folds).toHaveLength(0);
  });
});

describe('isFolded', () => {
  it('returns true for lines within a fold (exclusive start)', () => {
    const s = addFold(createDiffFoldState(), { startLine: 2, endLine: 5, label: 'f' });
    expect(isFolded(s, 3)).toBe(true);
    expect(isFolded(s, 2)).toBe(false);
    expect(isFolded(s, 6)).toBe(false);
  });

  it('returns false when disabled', () => {
    let s = addFold(createDiffFoldState(), { startLine: 2, endLine: 5, label: 'f' });
    s = toggleFoldEnabled(s);
    expect(isFolded(s, 3)).toBe(false);
  });
});

describe('applyFoldsToLines', () => {
  const lines = ['a', 'b', 'c', 'd', 'e', 'f'];

  it('replaces folded lines with summary', () => {
    const s = addFold(createDiffFoldState(), { startLine: 1, endLine: 3, label: 'hidden' });
    const result = applyFoldsToLines(s, lines);
    expect(result[1]).toMatch(/hidden/);
    expect(result).not.toContain('c');
  });

  it('returns lines unchanged when disabled', () => {
    let s = addFold(createDiffFoldState(), { startLine: 1, endLine: 3, label: 'hidden' });
    s = toggleFoldEnabled(s);
    expect(applyFoldsToLines(s, lines)).toEqual(lines);
  });

  it('returns lines unchanged when no folds', () => {
    expect(applyFoldsToLines(createDiffFoldState(), lines)).toEqual(lines);
  });
});

describe('clearFolds', () => {
  it('removes all folds', () => {
    let s = addFold(createDiffFoldState(), { startLine: 0, endLine: 2, label: 'a' });
    s = clearFolds(s);
    expect(s.folds).toHaveLength(0);
  });
});
