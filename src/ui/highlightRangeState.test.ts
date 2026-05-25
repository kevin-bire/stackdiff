import {
  createHighlightRangeState,
  beginRange,
  extendRange,
  clearRange,
  getSelectedRange,
  isLineInRange,
  getRangeLength,
} from "./highlightRangeState";

describe("createHighlightRangeState", () => {
  it("initialises with no selection", () => {
    const s = createHighlightRangeState();
    expect(s.anchorLine).toBeNull();
    expect(s.activeLine).toBeNull();
    expect(s.isSelecting).toBe(false);
  });
});

describe("beginRange", () => {
  it("sets anchor and active to the given line and marks selecting", () => {
    const s = beginRange(createHighlightRangeState(), 5);
    expect(s.anchorLine).toBe(5);
    expect(s.activeLine).toBe(5);
    expect(s.isSelecting).toBe(true);
  });
});

describe("extendRange", () => {
  it("moves activeLine while preserving anchor", () => {
    const s = extendRange(beginRange(createHighlightRangeState(), 3), 10);
    expect(s.anchorLine).toBe(3);
    expect(s.activeLine).toBe(10);
  });

  it("does nothing when not selecting", () => {
    const s = createHighlightRangeState();
    const s2 = extendRange(s, 7);
    expect(s2.activeLine).toBeNull();
  });
});

describe("clearRange", () => {
  it("resets all fields", () => {
    const s = clearRange(beginRange(createHighlightRangeState(), 4));
    expect(s.anchorLine).toBeNull();
    expect(s.activeLine).toBeNull();
    expect(s.isSelecting).toBe(false);
  });
});

describe("getSelectedRange", () => {
  it("returns null when no selection", () => {
    expect(getSelectedRange(createHighlightRangeState())).toBeNull();
  });

  it("returns ordered [start, end] regardless of direction", () => {
    const s = extendRange(beginRange(createHighlightRangeState(), 8), 2);
    expect(getSelectedRange(s)).toEqual([2, 8]);
  });
});

describe("isLineInRange", () => {
  it("returns true for lines within the range", () => {
    const s = extendRange(beginRange(createHighlightRangeState(), 3), 7);
    expect(isLineInRange(s, 3)).toBe(true);
    expect(isLineInRange(s, 5)).toBe(true);
    expect(isLineInRange(s, 7)).toBe(true);
  });

  it("returns false for lines outside the range", () => {
    const s = extendRange(beginRange(createHighlightRangeState(), 3), 7);
    expect(isLineInRange(s, 2)).toBe(false);
    expect(isLineInRange(s, 8)).toBe(false);
  });
});

describe("getRangeLength", () => {
  it("returns 0 when no selection", () => {
    expect(getRangeLength(createHighlightRangeState())).toBe(0);
  });

  it("returns inclusive line count", () => {
    const s = extendRange(beginRange(createHighlightRangeState(), 2), 5);
    expect(getRangeLength(s)).toBe(4);
  });
});
