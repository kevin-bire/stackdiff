import {
  createVirtualScrollState,
  setTotalLines,
  setViewportHeight,
  virtualScrollTo,
  virtualScrollBy,
  getVisibleWindow,
  getScrollPercent,
} from './virtualScrollState';

const lines = Array.from({ length: 100 }, (_, i) => `line ${i + 1}`);

describe('createVirtualScrollState', () => {
  it('creates state with defaults', () => {
    const s = createVirtualScrollState(100, 20);
    expect(s.totalLines).toBe(100);
    expect(s.viewportHeight).toBe(20);
    expect(s.scrollOffset).toBe(0);
    expect(s.overscan).toBe(3);
  });

  it('accepts custom overscan', () => {
    const s = createVirtualScrollState(50, 10, 5);
    expect(s.overscan).toBe(5);
  });
});

describe('setTotalLines', () => {
  it('updates total and clamps offset', () => {
    const s = virtualScrollTo(createVirtualScrollState(100, 20), 90);
    const updated = setTotalLines(s, 30);
    expect(updated.totalLines).toBe(30);
    expect(updated.scrollOffset).toBe(10);
  });
});

describe('setViewportHeight', () => {
  it('clamps offset when viewport grows', () => {
    const s = virtualScrollTo(createVirtualScrollState(100, 20), 85);
    const updated = setViewportHeight(s, 50);
    expect(updated.viewportHeight).toBe(50);
    expect(updated.scrollOffset).toBe(50);
  });
});

describe('virtualScrollTo', () => {
  it('clamps to valid range', () => {
    const s = createVirtualScrollState(100, 20);
    expect(virtualScrollTo(s, -5).scrollOffset).toBe(0);
    expect(virtualScrollTo(s, 200).scrollOffset).toBe(80);
    expect(virtualScrollTo(s, 40).scrollOffset).toBe(40);
  });
});

describe('virtualScrollBy', () => {
  it('scrolls relative to current offset', () => {
    const s = virtualScrollTo(createVirtualScrollState(100, 20), 10);
    expect(virtualScrollBy(s, 5).scrollOffset).toBe(15);
    expect(virtualScrollBy(s, -20).scrollOffset).toBe(0);
  });
});

describe('getVisibleWindow', () => {
  it('returns correct slice with overscan', () => {
    const s = virtualScrollTo(createVirtualScrollState(100, 20, 3), 10);
    const win = getVisibleWindow(s, lines);
    expect(win.startIndex).toBe(7);
    expect(win.endIndex).toBe(33);
    expect(win.lines[0]).toBe('line 8');
    expect(win.paddingTop).toBe(7);
    expect(win.paddingBottom).toBe(67);
  });

  it('does not go below zero at top', () => {
    const s = createVirtualScrollState(100, 20, 3);
    const win = getVisibleWindow(s, lines);
    expect(win.startIndex).toBe(0);
  });
});

describe('getScrollPercent', () => {
  it('returns 0 at top', () => {
    expect(getScrollPercent(createVirtualScrollState(100, 20))).toBe(0);
  });

  it('returns 100 at bottom', () => {
    const s = virtualScrollTo(createVirtualScrollState(100, 20), 80);
    expect(getScrollPercent(s)).toBe(100);
  });

  it('returns ~50 in middle', () => {
    const s = virtualScrollTo(createVirtualScrollState(100, 20), 40);
    expect(getScrollPercent(s)).toBe(50);
  });
});
