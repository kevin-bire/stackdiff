import {
  createDiffNavigationHistory,
  pushEntry,
  goBack,
  goForward,
  canGoBack,
  canGoForward,
  currentEntry,
  clearHistory,
} from './diffNavigationHistory';

describe('diffNavigationHistory', () => {
  it('creates empty history', () => {
    const h = createDiffNavigationHistory();
    expect(h.entries).toHaveLength(0);
    expect(h.cursor).toBe(-1);
    expect(currentEntry(h)).toBeNull();
  });

  it('pushes entries and tracks cursor', () => {
    let h = createDiffNavigationHistory();
    h = pushEntry(h, 0, 0);
    h = pushEntry(h, 2, 5);
    expect(h.entries).toHaveLength(2);
    expect(h.cursor).toBe(1);
    expect(currentEntry(h)).toMatchObject({ serviceIndex: 2, scrollOffset: 5 });
  });

  it('goes back and forward', () => {
    let h = createDiffNavigationHistory();
    h = pushEntry(h, 0, 0);
    h = pushEntry(h, 1, 10);
    h = pushEntry(h, 3, 20);

    const back1 = goBack(h);
    expect(back1.entry).toMatchObject({ serviceIndex: 1 });
    const back2 = goBack(back1.history);
    expect(back2.entry).toMatchObject({ serviceIndex: 0 });
    const back3 = goBack(back2.history);
    expect(back3.entry).toBeNull();

    const fwd = goForward(back2.history);
    expect(fwd.entry).toMatchObject({ serviceIndex: 1 });
  });

  it('discards forward history on new push', () => {
    let h = createDiffNavigationHistory();
    h = pushEntry(h, 0, 0);
    h = pushEntry(h, 1, 0);
    h = pushEntry(h, 2, 0);
    const { history: back } = goBack(h);
    const updated = pushEntry(back, 5, 0);
    expect(updated.entries).toHaveLength(3);
    expect(canGoForward(updated)).toBe(false);
    expect(currentEntry(updated)).toMatchObject({ serviceIndex: 5 });
  });

  it('respects maxSize by trimming oldest entries', () => {
    let h = createDiffNavigationHistory(3);
    h = pushEntry(h, 0, 0);
    h = pushEntry(h, 1, 0);
    h = pushEntry(h, 2, 0);
    h = pushEntry(h, 3, 0);
    expect(h.entries).toHaveLength(3);
    expect(h.entries[0].serviceIndex).toBe(1);
  });

  it('canGoBack and canGoForward reflect state', () => {
    let h = createDiffNavigationHistory();
    expect(canGoBack(h)).toBe(false);
    expect(canGoForward(h)).toBe(false);
    h = pushEntry(h, 0, 0);
    h = pushEntry(h, 1, 0);
    expect(canGoBack(h)).toBe(true);
    expect(canGoForward(h)).toBe(false);
    const { history: back } = goBack(h);
    expect(canGoForward(back)).toBe(true);
  });

  it('clears history', () => {
    let h = createDiffNavigationHistory();
    h = pushEntry(h, 0, 0);
    h = pushEntry(h, 1, 0);
    h = clearHistory(h);
    expect(h.entries).toHaveLength(0);
    expect(h.cursor).toBe(-1);
  });
});
