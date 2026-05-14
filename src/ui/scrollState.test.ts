import {
  createScrollState,
  scrollUp,
  scrollDown,
  scrollToIndex,
  getVisibleRange,
  updateTotalItems,
} from './scrollState';

describe('createScrollState', () => {
  it('creates initial state with zero offsets', () => {
    const state = createScrollState(20, 10);
    expect(state.offset).toBe(0);
    expect(state.selectedIndex).toBe(0);
    expect(state.totalItems).toBe(20);
    expect(state.visibleLines).toBe(10);
  });
});

describe('scrollUp', () => {
  it('decrements selectedIndex', () => {
    const state = { offset: 0, selectedIndex: 3, totalItems: 10, visibleLines: 5 };
    expect(scrollUp(state).selectedIndex).toBe(2);
  });

  it('does not go below 0', () => {
    const state = { offset: 0, selectedIndex: 0, totalItems: 10, visibleLines: 5 };
    expect(scrollUp(state).selectedIndex).toBe(0);
  });

  it('adjusts offset when scrolling above visible area', () => {
    const state = { offset: 3, selectedIndex: 3, totalItems: 10, visibleLines: 5 };
    const next = scrollUp(state);
    expect(next.selectedIndex).toBe(2);
    expect(next.offset).toBe(2);
  });
});

describe('scrollDown', () => {
  it('increments selectedIndex', () => {
    const state = { offset: 0, selectedIndex: 2, totalItems: 10, visibleLines: 5 };
    expect(scrollDown(state).selectedIndex).toBe(3);
  });

  it('does not exceed totalItems - 1', () => {
    const state = { offset: 5, selectedIndex: 9, totalItems: 10, visibleLines: 5 };
    expect(scrollDown(state).selectedIndex).toBe(9);
  });

  it('advances offset when item goes out of view', () => {
    const state = { offset: 0, selectedIndex: 4, totalItems: 10, visibleLines: 5 };
    const next = scrollDown(state);
    expect(next.selectedIndex).toBe(5);
    expect(next.offset).toBe(1);
  });
});

describe('scrollToIndex', () => {
  it('centers view around target index', () => {
    const state = createScrollState(20, 5);
    const next = scrollToIndex(state, 10);
    expect(next.selectedIndex).toBe(10);
    expect(next.offset).toBe(8);
  });

  it('clamps to valid range', () => {
    const state = createScrollState(5, 10);
    const next = scrollToIndex(state, 100);
    expect(next.selectedIndex).toBe(4);
  });
});

describe('getVisibleRange', () => {
  it('returns correct start and end', () => {
    const state = { offset: 3, selectedIndex: 5, totalItems: 20, visibleLines: 5 };
    expect(getVisibleRange(state)).toEqual({ start: 3, end: 8 });
  });
});

describe('updateTotalItems', () => {
  it('clamps selectedIndex when totalItems shrinks', () => {
    const state = { offset: 0, selectedIndex: 8, totalItems: 10, visibleLines: 5 };
    const next = updateTotalItems(state, 5);
    expect(next.selectedIndex).toBe(4);
    expect(next.totalItems).toBe(5);
  });
});
