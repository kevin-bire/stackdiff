import {
  createContextLinesState,
  increaseContext,
  decreaseContext,
  setContextLines,
  resetContextLines,
  computeVisibleIndices,
  applyContextToLines,
} from "./contextLinesState";

describe("createContextLinesState", () => {
  it("creates state with default count 3", () => {
    const s = createContextLinesState();
    expect(s.count).toBe(3);
    expect(s.min).toBe(0);
    expect(s.max).toBe(10);
  });

  it("clamps initial value to min/max", () => {
    expect(createContextLinesState(20, 0, 10).count).toBe(10);
    expect(createContextLinesState(-5, 0, 10).count).toBe(0);
  });
});

describe("increaseContext / decreaseContext", () => {
  it("increments count", () => {
    const s = createContextLinesState(3);
    expect(increaseContext(s).count).toBe(4);
  });

  it("does not exceed max", () => {
    const s = createContextLinesState(10, 0, 10);
    expect(increaseContext(s).count).toBe(10);
  });

  it("decrements count", () => {
    const s = createContextLinesState(3);
    expect(decreaseContext(s).count).toBe(2);
  });

  it("does not go below min", () => {
    const s = createContextLinesState(0, 0, 10);
    expect(decreaseContext(s).count).toBe(0);
  });
});

describe("setContextLines", () => {
  it("sets count directly", () => {
    const s = createContextLinesState(3);
    expect(setContextLines(s, 7).count).toBe(7);
  });

  it("clamps to range", () => {
    const s = createContextLinesState(3);
    expect(setContextLines(s, 99).count).toBe(10);
    expect(setContextLines(s, -1).count).toBe(0);
  });
});

describe("resetContextLines", () => {
  it("resets to 3", () => {
    const s = setContextLines(createContextLinesState(), 8);
    expect(resetContextLines(s).count).toBe(3);
  });
});

describe("computeVisibleIndices", () => {
  it("includes changed lines and context", () => {
    const visible = computeVisibleIndices([5], 20, 2);
    expect(visible.has(3)).toBe(true);
    expect(visible.has(5)).toBe(true);
    expect(visible.has(7)).toBe(true);
    expect(visible.has(8)).toBe(false);
  });

  it("does not include out-of-bounds indices", () => {
    const visible = computeVisibleIndices([0], 5, 3);
    expect(visible.has(-1)).toBe(false);
    expect(visible.has(0)).toBe(true);
    expect(visible.has(3)).toBe(true);
    expect(visible.has(5)).toBe(false);
  });
});

describe("applyContextToLines", () => {
  const lines = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

  it("returns empty for empty input", () => {
    const s = createContextLinesState(2);
    expect(applyContextToLines([], [], s)).toEqual([]);
  });

  it("inserts separator between non-contiguous hunks", () => {
    const s = createContextLinesState(1);
    const result = applyContextToLines(lines, [1, 8], s);
    expect(result).toContain("...");
    expect(result).toContain("b"); // index 1
    expect(result).toContain("i"); // index 8
  });

  it("does not insert separator for adjacent hunks", () => {
    const s = createContextLinesState(2);
    const result = applyContextToLines(lines, [2, 5], s);
    expect(result).not.toContain("...");
  });
});
